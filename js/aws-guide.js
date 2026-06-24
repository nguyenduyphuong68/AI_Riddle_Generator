/* ==========================================================================
   AI Riddle Generator - AWS Architecture & Integration Guide
   ========================================================================== */

export const awsArchitectureDiagram = `
┌────────────────────────────────────────────────────────────────────────┐
│                      ARCHITECTURAL FLOW DIAGRAM                        │
└────────────────────────────────────────────────────────────────────────┘

  [ Parent / Teacher ]    ───► [ S3 Bucket + CloudFront CDN ]
         │ (Web Browser)                (Static Web Assets & HTML/CSS/JS)
         ▼
  [ API Gateway Endpoint ]
         │ (REST API HTTPS Request)
         ▼
  [ AWS Lambda Function ]  ◄───► [ DynamoDB Tables ]
         │ (Python Runtime)          ├── RiddleLibrary (Save & Load)
         │                           └── FeaturedRiddles (Likes & Upvotes)
         ▼
  [ AWS Bedrock Service ]
         └── Anthropic Claude 3.5 Sonnet / Meta Llama 3
             (Riddle Generation LLM Prompt Inference)
`;

export const lambdaPythonCode = `import json
import boto3
import uuid
import os

# Initialize AWS clients
bedrock = boto3.client(service_name="bedrock-runtime", region_name="us-east-1")
dynamodb = boto3.resource("dynamodb")
table_library = dynamodb.Table("RiddleLibrary")

def lambda_handler(event, context):
    """
    AWS Lambda Handler for AI Riddle Generator.
    Expected API Payload:
    {
        "keyword": "Hồ Gươm",
        "grade": "primary",          # primary | secondary
        "genre": "history-lit",      # history-lit | acrostic | modern-meme | music-art | science-math
        "lang": "vi"                 # vi | en
    }
    """
    try:
        # Enable CORS
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
            "Access-Control-Allow-Methods": "POST,GET,OPTIONS"
        }
        
        # Handle Preflight OPTIONS request
        if event.get("httpMethod") == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": headers,
                "body": json.dumps({"status": "CORS OK"})
            }
            
        body = json.loads(event.get("body", "{}"))
        keyword = body.get("keyword", "").strip()
        grade = body.get("grade", "primary")
        genre = body.get("genre", "history-lit")
        lang = body.get("lang", "vi")
        
        if not keyword:
            return {
                "statusCode": 400,
                "headers": headers,
                "body": json.dumps({"error": "Keyword is required"})
            }

        # Construct System Prompt for Bedrock based on selections
        system_instructions = (
            "You are an AI Riddle Generator designed for school kids. "
            f"Generate a creative riddle in language: '{lang}' for a target age level: "
            f"'{'Grade 1 to 5 (simple, visual clues)' if grade == 'primary' else 'Grade 6 to 9 (deep association, critical thinking)'}'.\\n"
        )
        
        if genre == "acrostic":
            system_instructions += (
                f"Write an ACROSTIC poem where the first letter of each line spells out the word '{keyword}' vertically.\\n"
                "Capitalize and emphasize the first letter of each line (e.g. 'H - ...').\\n"
            )
        elif genre == "history-lit":
            system_instructions += f"Base the riddle on literature, folklore, or history of the target word: '{keyword}'.\\n"
        elif genre == "modern-meme":
            system_instructions += f"Use friendly, clean teen memes, modern trends or catchy vibes related to: '{keyword}'.\\n"
        elif genre == "music-art":
            system_instructions += f"Use song lyrics, melodies, or art descriptions to point to the answer: '{keyword}'.\\n"
        else:
            system_instructions += f"Use simple math, logic, or science puzzles to hint at: '{keyword}'.\\n"
            
        system_instructions += (
            "Return the output in STRICT JSON format with these exact keys:\\n"
            "{\\n"
            '  "riddle": "the riddle text (use \\\\n for line breaks)",\\n'
            '  "hint1": "a general hint for parents to assist kids",\\n'
            '  "hint2": "a more specific hint or clue",\\n'
            '  "answer": "the actual keyword provided"\\n'
            "}"
        )

        # Call Bedrock - Using Claude 3.5 Sonnet
        prompt_config = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "system": system_instructions,
            "messages": [
                {
                    "role": "user",
                    "content": f"Generate a riddle for the keyword: '{keyword}'"
                }
            ],
            "temperature": 0.7
        }
        
        response = bedrock.invoke_model(
            modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
            body=json.dumps(prompt_config)
        )
        
        response_body = json.loads(response.get("body").read().decode("utf-8"))
        ai_response_text = response_body["content"][0]["text"]
        
        # Parse the JSON response from Bedrock
        riddle_data = json.loads(ai_response_text)
        
        # Save search query to DynamoDB for audit/library log
        riddle_id = str(uuid.uuid4())
        table_library.put_item(
            Item={
                "riddleId": riddle_id,
                "keyword": keyword,
                "riddleText": riddle_data.get("riddle"),
                "hint1": riddle_data.get("hint1"),
                "hint2": riddle_data.get("hint2"),
                "answer": riddle_data.get("answer"),
                "grade": grade,
                "genre": genre,
                "lang": lang
            }
        )
        
        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "id": riddle_id,
                **riddle_data
            })
        }
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({"error": str(e)})
        }
`;

export const frontendIntegrationSnippet = `// Code for connecting your frontend app.js to API Gateway (AWS Integration)
const AWS_API_GATEWAY_URL = "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/generate";

async function generateRiddleWithAWS(payload) {
    try {
        const response = await fetch(AWS_API_GATEWAY_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        return {
            keyword: data.answer,
            text: data.riddle,
            hint1: data.hint1,
            hint2: data.hint2,
            answer: data.answer,
            grade: payload.grade,
            genre: payload.genre,
            lang: payload.lang
        };
    } catch (error) {
        console.error("AWS Generation Failed:", error);
        throw error;
    }
}`;

export const awsStepsList = [
    {
        title: "Bước 1: Thiết lập Mô hình trên AWS Bedrock",
        details: "Đăng nhập vào AWS Console. Đi tới **Amazon Bedrock**. Chọn khu vực hỗ trợ (ví dụ: `us-east-1` N. Virginia). Vào tab **Model access** bên thanh điều hướng trái và gửi yêu cầu kích hoạt quyền sử dụng mô hình **Anthropic Claude 3.5 Sonnet** hoặc **Meta Llama 3**."
    },
    {
        title: "Bước 2: Tạo Bảng Cơ sở dữ liệu DynamoDB",
        details: "Tìm kiếm dịch vụ **DynamoDB** trên thanh công cụ. Tạo bảng mới tên là `RiddleLibrary` với Khóa chính (Partition Key) là `riddleId` (loại String). Các thuộc tính khác sẽ được lưu trữ động khi Lambda ghi dữ liệu."
    },
    {
        title: "Bước 3: Tạo Hàm Xử lý AWS Lambda",
        details: "Tạo một hàm Lambda viết bằng ngôn ngữ **Python 3.9+** với tên `ai-riddle-generator`. Gán quyền thực thi (IAM Role) có các chính sách (Policy) cấp quyền truy cập đầy đủ vào **Amazon Bedrock** (`bedrock:InvokeModel`) và quyền ghi/đọc dữ liệu từ bảng **DynamoDB** `RiddleLibrary` (`dynamodb:PutItem`, `dynamodb:GetItem`)."
    },
    {
        title: "Bước 4: Cấu hình Cổng kết nối API Gateway",
        details: "Tạo một API REST sử dụng **Amazon API Gateway**. Tạo tài nguyên `/generate` hỗ trợ phương thức `POST` và trỏ nó vào hàm Lambda vừa tạo ở Bước 3. Hãy nhớ **Bật tính năng CORS** (Cross-Origin Resource Sharing) trong cấu hình của tài nguyên API Gateway để ứng dụng web Client-side chạy trên trình duyệt có thể gửi yêu cầu HTTP POST trực tiếp."
    },
    {
        title: "Bước 5: Triển khai Ứng dụng Giao diện lên S3 + CloudFront",
        details: "Tạo một S3 Bucket với tính năng **Static Website Hosting**. Đẩy các file giao diện (`index.html`, `style.css`, thư mục `js/`) lên bucket này. Cấu hình phân phối nội dung qua **AWS CloudFront** để cung cấp chứng chỉ bảo mật HTTPS toàn cầu và tăng tốc độ tải trang."
    }
];

export const awsLinks = [
    { label: "Amazon Bedrock documentation", url: "https://docs.aws.amazon.com/bedrock/" },
    { label: "AWS Lambda Developer Guide", url: "https://docs.aws.amazon.com/lambda/" },
    { label: "Amazon API Gateway - CORS Setup", url: "https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html" },
    { label: "AWS DynamoDB CRUD operations", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJS.html" }
];
