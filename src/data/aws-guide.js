/* ==========================================================================
   AI Riddle Generator - AWS Architecture & Single-Table Guide Data
   ========================================================================== */

export const awsArchitectureDiagram = `
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      SERVERLESS AMPLIFY INTEGRATION FLOW                        │
└─────────────────────────────────────────────────────────────────────────────────┘

   [ Parents / Teachers ] ──► [ AWS Amplify Hosting ] (React App Frontend)
          │
          ├─► [ AWS Cognito ] (User Auth: Teacher / Parent Signup & JWT Tokens)
          │
          ├─► [ AWS API Gateway ] (Secured with Cognito Authorizer)
          │          │
          │          ▼
          └─► [ AWS Lambda ] ◄───────────────────► [ Amazon DynamoDB ]
                     │ (Python Bedrock Runtime)       │ (Single-Table Design:
                     ▼                                │  Users, Riddles, Upvotes)
              [ Amazon Bedrock ]                      │
                └─► Claude 3.5 Sonnet                 ├── Query PK = USER#u102
                                                      └── Query GSI1PK = FEATURED#ACROSTIC
`;

export const singleTableVisualSchema = `
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                 DYNAMODB SINGLE-TABLE DESIGN LAYOUT                                                   │
├─────────────────┬──────────────────────┬─────────────────┬─────────────────────┬─────────┬──────────────┬──────────────────┬───────────────┤
│ PK (Partition)  │ SK (Sort Key)        │ EntityType      │ GSI1PK (Featured)   │ GSI1SK  │ Email / Name │ Riddle Content   │ Upvotes/TS    │
├─────────────────┼──────────────────────┼─────────────────┼─────────────────────┼─────────┼──────────────┼──────────────────┼───────────────┤
│ USER#u102       │ PROFILE              │ USER            │ -                   │ -       │ Teacher Mai  │ -                │ -             │
│ USER#u102       │ RIDDLE#ACROSTIC#r987 │ RIDDLE          │ FEATURED#ACROSTIC   │ 45      │ -            │ H-ương hoa sữa...│ 45            │
│ USER#u103       │ PROFILE              │ USER            │ -                   │ -       │ Parent Thu   │ -                │ -             │
│ USER#u102       │ UPVOTE#r987          │ UPVOTE          │ -                   │ -       │ -            │ -                │ TS: 2026-06-16│
└─────────────────┴──────────────────────┴─────────────────┴─────────────────────┴─────────┴──────────────┴──────────────────┴───────────────┘
`;

export const lambdaPythonCode = `import json
import boto3
import uuid
from datetime import datetime

# Initialize Bedrock & DynamoDB clients
bedrock = boto3.client(service_name="bedrock-runtime", region_name="us-east-1")
dynamodb = boto3.resource("dynamodb")
# Using a single DynamoDB table
table = dynamodb.Table("AI_Riddle_SingleTable")

def lambda_handler(event, context):
    """
    AWS Lambda Handler for Single-Table AI Riddle Generation.
    Expected Event Body:
    {
        "userId": "u102",
        "keyword": "Hồ Gươm",
        "age_group": "Cấp 1",
        "genre": "Acrostic",
        "lang": "vi"
    }
    """
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
    }
    
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"status": "CORS OK"})}
        
    try:
        body = json.loads(event.get("body", "{}"))
        user_id = body.get("userId") or body.get("user_id") or "u102"
        keyword = body.get("keyword", "").strip()
        age_group = body.get("age_group", "Cấp 1")
        genre = body.get("genre", "Acrostic")
        lang = body.get("lang") or body.get("language") or "vi"
        
        if not keyword:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Keyword is required"})}

        # Construct System Instruction for Bedrock
        system_prompt = (
            f"You are an educational AI Riddle Generator. Create a riddle in language: '{lang}' "
            f"targeting age group: '{age_group}'.\\n"
        )
        if genre == "Acrostic":
            system_prompt += (
                f"Write an ACROSTIC poem where the first letters of each line spell out '{keyword}' vertically.\\n"
                "Emphasize the starting letters with dashes (e.g. 'H - ...').\\n"
            )
        else:
            system_prompt += f"Build clues relating to the keyword '{keyword}' in the genre '{genre}'.\\n"
            
        system_prompt += (
            "Return the response in STRICT JSON format:\\n"
            "{\\n"
            '  "riddle": "the riddle lines (use \\\\n for line breaks)",\\n'
            '  "hint1": "first subtle clue",\\n'
            '  "hint2": "second direct clue"\\n'
            "}"
        )

        # Call Bedrock Claude Model
        prompt_config = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "system": system_prompt,
            "messages": [{"role": "user", "content": f"Generate a riddle for '{keyword}'"}],
            "temperature": 0.6
        }
        
        response = bedrock.invoke_model(
            modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
            body=json.dumps(prompt_config)
        )
        response_body = json.loads(response.get("body").read().decode("utf-8"))
        ai_text = response_body["content"][0]["text"]
        riddle_data = json.loads(ai_text)
        
        # Save to DynamoDB using Single-Table schema keys
        riddle_id = "r" + str(uuid.uuid4())[:8]
        genre_upper = genre.upper()
        
        riddle_item = {
            "PK": f"USER#{user_id}",
            "SK": f"RIDDLE#{genre_upper}#{riddle_id}",
            "EntityType": "RIDDLE",
            "GSI1PK": f"FEATURED#{genre_upper}",
            "GSI1SK": "0",
            "riddle_id": riddle_id,
            "keyword": keyword,
            "age_group": age_group,
            "genre": genre,
            "riddle_content": riddle_data.get("riddle"),
            "hints": [riddle_data.get("hint1"), riddle_data.get("hint2")],
            "upvotes": 0,
            "created_at": datetime.utcnow().isoformat() + "Z" # ISO timestamp
        }
        
        table.put_item(Item=riddle_item)
        
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(riddle_item)
        }
    except Exception as e:
        print("ERROR:", str(e))
        import traceback
        traceback.print_exc()
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)})
        }
`;

export const dynamoDbTransactionCode = `// Node.js AWS SDK v3 Upvote Transaction (Single-Table Design)
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE_NAME = "AI_Riddle_SingleTable";

/**
 * Executes a Transactional Upvote in DynamoDB Single-Table Design.
 * This guarantees:
 * 1. An UPVOTE record is inserted (PK: USER#userId, SK: UPVOTE#riddleId).
 *    This will FAIL if the record already exists (conditional write checking),
 *    preventing double upvoting.
 * 2. If it succeeds, the target RIDDLE (PK: USER#creatorId, SK: RIDDLE#GENRE#riddleId)
 *    has its 'upvotes' count and 'GSI1SK' incremented by 1.
 */
export async function upvoteRiddleTransaction(userId, creatorId, genre, riddleId) {
    const command = new TransactWriteItemsCommand({
        TransactItems: [
            // Action 1: Create the duplicate-prevention vote check
            {
                Put: {
                    TableName: TABLE_NAME,
                    Item: {
                        PK: { S: \`USER#\${userId}\` },
                        SK: { S: \`UPVOTE#\${riddleId}\` },
                        EntityType: { S: "UPVOTE" },
                        Timestamp: { S: new Date().toISOString() }
                    },
                    // Fails if this user already upvoted this riddle
                    ConditionExpression: "attribute_not_exists(PK)"
                }
            },
            // Action 2: Increment the upvotes count and sync with GSI1SK sorting attribute
            {
                Update: {
                    TableName: TABLE_NAME,
                    Key: {
                        PK: { S: \`USER#\${creatorId}\` },
                        SK: { S: \`RIDDLE#\${genre.toUpperCase()}#\${riddleId}\` }
                    },
                    UpdateExpression: "SET upvotes = upvotes + :incr, GSI1SK = GSI1SK + :incr",
                    ExpressionAttributeValues: {
                        ":incr": { N: "1" }
                    }
                }
            }
        ]
    });

    try {
        await client.send(command);
        console.log("Transaction successfully executed. Vote recorded!");
        return { success: true };
    } catch (error) {
        if (error.name === "TransactionCanceledException") {
            console.warn("Transaction cancelled: User has already upvoted this riddle.");
            return { success: false, reason: "ALREADY_UPVOTED" };
        }
        console.error("DynamoDB Transaction error:", error);
        throw error;
    }
}
`;

export const lambdaLibraryCode = `import json
import boto3
from datetime import datetime
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("AI_Riddle_SingleTable")

def lambda_handler(event, context):
    """
    AWS Lambda Handler for Managing User Riddle Library.
    Supports:
    - GET /riddles/library?userId=...  => Query user's saved riddles
    - POST /riddles/library            => Save a new riddle to library
    - DELETE /riddles/library?userId=...&riddleId=... => Delete a riddle
    """
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS"
    }

    http_method = event.get("httpMethod")
    if http_method == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"status": "CORS OK"})}

    try:
        if http_method == "GET":
            query_params = event.get("queryStringParameters") or {}
            user_id = query_params.get("userId")
            if not user_id:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Missing userId"})}
            
            # Query DynamoDB Table by PK
            response = table.query(
                KeyConditionExpression=Key("PK").eq(f"USER#{user_id}") & Key("SK").begins_with("RIDDLE#")
            )
            items = response.get("Items", [])
            
            riddles = []
            for item in items:
                riddles.append({
                    "PK": item.get("PK"),
                    "SK": item.get("SK"),
                    "riddle_id": item.get("riddle_id"),
                    "keyword": item.get("keyword"),
                    "metadata": {
                        "age_group": item.get("age_group"),
                        "genre": item.get("genre"),
                        "topic": item.get("topic", "Địa lý"),
                        "language": item.get("language", "vi")
                    },
                    "content": {
                        "raw_text": item.get("riddle_content"),
                        "rendered_html": f"<p>{item.get('riddle_content').replace(chr(10), '<br>')}</p>",
                        "hints": item.get("hints", [])
                    },
                    "community": {
                        "created_by": user_id,
                        "creator_role": "Teacher",
                        "is_public": True,
                        "upvotes": int(item.get("upvotes", 0))
                    }
                })
            return {"statusCode": 200, "headers": headers, "body": json.dumps(riddles)}

        elif http_method == "POST":
            body = json.loads(event.get("body", "{}"))
            user_id = body.get("userId")
            riddle = body.get("riddle")
            if not user_id or not riddle:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Missing userId or riddle"})}
            
            # Robust hybrid parser for nested or flat formats
            metadata = riddle.get("metadata") if isinstance(riddle.get("metadata"), dict) else {}
            content = riddle.get("content") if isinstance(riddle.get("content"), dict) else {}
            community = riddle.get("community") if isinstance(riddle.get("community"), dict) else {}
            sys_timestamps = riddle.get("sys_timestamps") if isinstance(riddle.get("sys_timestamps"), dict) else {}

            genre = metadata.get("genre") or riddle.get("genre") or "ACROSTIC"
            genre_upper = genre.upper()
            riddle_id = riddle.get("riddle_id")
            
            riddle_item = {
                "PK": f"USER#{user_id}",
                "SK": f"RIDDLE#{genre_upper}#{riddle_id}",
                "EntityType": "RIDDLE",
                "GSI1PK": f"FEATURED#{genre_upper}",
                "GSI1SK": str(community.get("upvotes") or riddle.get("upvotes") or 0),
                "riddle_id": riddle_id,
                "keyword": riddle.get("keyword"),
                "age_group": metadata.get("age_group") or riddle.get("age_group"),
                "genre": genre,
                "riddle_content": content.get("raw_text") or riddle.get("riddle_content"),
                "hints": content.get("hints") or riddle.get("hints") or [],
                "upvotes": int(community.get("upvotes") or riddle.get("upvotes") or 0),
                "created_at": sys_timestamps.get("created_at") or riddle.get("created_at") or ""
            }
            
            table.put_item(Item=riddle_item)
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"success": True})}

        elif http_method == "DELETE":
            query_params = event.get("queryStringParameters") or {}
            user_id = query_params.get("userId")
            riddle_id = query_params.get("riddleId")
            if not user_id or not riddle_id:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Missing userId or riddleId"})}
            
            response = table.query(
                KeyConditionExpression=Key("PK").eq(f"USER#{user_id}") & Key("SK").begins_with("RIDDLE#")
            )
            items = response.get("Items", [])
            target_sk = None
            for item in items:
                if item.get("riddle_id") == riddle_id:
                    target_sk = item.get("SK")
                    break
            
            if target_sk:
                table.delete_item(Key={"PK": f"USER#{user_id}", "SK": target_sk})
                return {"statusCode": 200, "headers": headers, "body": json.dumps({"success": True})}
            else:
                return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Riddle not found"})}

    except Exception as e:
        print("ERROR:", str(e))
        import traceback
        traceback.print_exc()
        return {"statusCode": 500, "headers": headers, "body": json.dumps({"error": str(e)})}
`;

export const lambdaProfileCode = `import json
import boto3
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("AI_Riddle_SingleTable")

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
    }

    http_method = event.get("httpMethod")
    if http_method == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": json.dumps({"status": "CORS OK"})}

    try:
        if http_method == "POST":
            body = json.loads(event.get("body", "{}"))
            user_id = body.get("userId")
            profile = body.get("profile") or {}
            
            if not user_id or not profile:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "Missing userId or profile"})}
            
            profile_item = {
                "PK": f"USER#{user_id}",
                "SK": "PROFILE",
                "EntityType": "USER",
                "Name": profile.get("name"),
                "Email": profile.get("email"),
                "Role": profile.get("role", "Teacher"),
                "created_at": datetime.utcnow().isoformat() + "Z"
            }
            table.put_item(Item=profile_item)
            return {"statusCode": 200, "headers": headers, "body": json.dumps({"success": True})}

    except Exception as e:
        print("ERROR:", str(e))
        import traceback
        traceback.print_exc()
        return {"statusCode": 500, "headers": headers, "body": json.dumps({"error": str(e)})}
`;



export const awsSetupSteps = [
    {
        title: "1. Kích hoạt AWS Bedrock (Claude 3.5 Sonnet)",
        details: "Mở AWS Console -> Amazon Bedrock -> Model Access. Chọn khu vực N. Virginia (us-east-1) hoặc Oregon (us-west-2). Yêu cầu cấp quyền cho mô hình Anthropic Claude 3.5 Sonnet."
    },
    {
        title: "2. Tạo bảng DynamoDB Single-Table",
        details: "Tạo bảng 'AI_Riddle_SingleTable' với Partition Key (PK) kiểu String và Sort Key (SK) kiểu String. Tiếp tục tạo chỉ mục phụ toàn cục (GSI) tên là 'GSI1' với GSI1PK (String) là Partition Key và GSI1SK (Number) là Sort Key."
    },
    {
        title: "3. Triển khai Hàm AWS Lambda & Cấp Quyền IAM",
        details: "Tạo hàm Lambda chạy Python 3.9+. Gán IAM Role cho phép gọi mô hình Bedrock ('bedrock:InvokeModel') và thao tác bảng DynamoDB ('dynamodb:PutItem', 'dynamodb:GetItem', 'dynamodb:TransactWriteItems'). Dán mã Lambda Python ở tab bên cạnh vào."
    },
    {
        title: "4. Liên kết API Gateway RESTful & CORS",
        details: "Tạo một REST API trong API Gateway. Thêm endpoint '/generate' nhận POST. Bật tính năng 'CORS OPTIONS' trên phương thức để cho phép ứng dụng client-side React gửi request mà không bị chặn chéo nguồn."
    },
    {
        title: "5. Host mã nguồn React lên AWS Amplify",
        details: "Kết nối tài khoản GitHub chứa mã nguồn React này với AWS Amplify Console. Amplify sẽ đọc file 'amplify.yml' ở thư mục gốc để tự động cài đặt gói, biên dịch gói 'dist' và cấp phát tên miền HTTPS miễn phí để truy cập."
    }
];
