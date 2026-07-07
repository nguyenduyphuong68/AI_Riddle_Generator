# AI Riddle Generator - React.js (AWS Amplify)

Ứng dụng web được lập trình bằng **React.js (Vite)** dùng để tạo câu đố tư duy và mật mã chữ đầu (Acrostic) cho trẻ em. Dự án được tối ưu hóa cấu trúc để sẵn sàng triển khai tự động lên **AWS Amplify Console** và tích hợp trực tiếp với cơ sở dữ liệu **DynamoDB Single-Table Design**.

---

## 📂 Cấu trúc Thư mục

```
AI_Riddle_Generator/
├── amplify.yml             # Cấu hình build CI/CD tự động của AWS Amplify
├── package.json            # Khai báo thư viện React và tập lệnh build
├── vite.config.js          # Cấu hình biên dịch Vite
├── index.html              # Điểm neo ứng dụng
└── src/
    ├── main.jsx            # Khởi tạo React root
    ├── App.jsx             # Router chính, quản lý Theme và IAM profiles
    ├── index.css           # Cấu hình giao diện Glassmorphism và Dark Mode
    ├── data/
    │   ├── db.js           # Client giả lập Single-Table DynamoDB (UserProfile, Riddle, Upvote)
    │   └── aws-guide.js    # Tài liệu cấu hình AWS & Code Lambda mẫu
    └── components/
        ├── Header.jsx      # Thanh menu, Identity switcher và Theme toggle
        ├── Generator.jsx   # Khung sinh câu đố với AI & cơ chế gợi ý 2 bước
        ├── Community.jsx   # Kho câu đố cộng đồng (GSI1 Index) & Kiểm soát Upvote
        ├── Library.jsx     # Kho lưu trữ câu đố cá nhân (Query PK) & Xuất PDF
        └── DeveloperHub.jsx# Dashboard hiển thị mã nguồn và hướng dẫn setup AWS
```

---

## ⚙️ Hướng dẫn Chạy Cục bộ (Local Development)

Yêu cầu máy cài đặt sẵn **Node.js 18+**.

1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

2. Khởi chạy máy chủ phát triển cục bộ:
   ```bash
   npm run dev
   ```

3. Mở trình duyệt và truy cập đường dẫn hiển thị (thường là `http://localhost:5173`).

---

## ☁️ Cấu hình Triển khai AWS Amplify

Dự án đã có tệp `amplify.yml` cấu hình sẵn các bước build. Để đưa dự án lên Cloud:

1. Đẩy mã nguồn của bạn lên một kho lưu trữ **GitHub** (hoặc GitLab / Bitbucket).
2. Truy cập **AWS Amplify Console** trên tài khoản AWS của bạn.
3. Nhấp **Create new app** -> Chọn nguồn Git tương ứng và liên kết repo.
4. Amplify sẽ tự động nhận diện cấu hình `amplify.yml` và tiến hành biên dịch ứng dụng React thành mã tĩnh để phân phối qua hệ thống CDN của AWS.

---

## 📊 Mô hình Single-Table DynamoDB được sử dụng

Ứng dụng giả lập chuẩn cấu trúc Single-Table Design trong DynamoDB:

1. **User Profile (Hồ sơ):**
   - **PK:** `USER#<UserId>` (Ví dụ: `USER#u102`)
   - **SK:** `PROFILE`
   - **Attributes:** `EntityType` ("USER"), `Email`, `Role` ("Teacher" | "Parent"), `CreatedAt`

2. **Riddle (Câu đố):**
   - **PK:** `USER#<CreatorUserId>`
   - **SK:** `RIDDLE#<GENRE>#<RiddleId>`
   - **GSI1PK (Khóa chỉ mục phụ):** `FEATURED#<GENRE>`
   - **GSI1SK (Sắp xếp chỉ mục phụ):** `<Upvotes>` (Dùng để sắp xếp câu đố nổi bật từ cao xuống thấp)
   - **Attributes:** `riddle_id`, `keyword`, `age_group`, `genre`, `riddle_content`, `hints` (array), `upvotes`, `created_at`

3. **Upvote (Kiểm soát lượt vote):**
   - **PK:** `USER#<VoterUserId>`
   - **SK:** `UPVOTE#<RiddleId>`
   - **Attributes:** `EntityType` ("UPVOTE"), `Timestamp`
   - *Logic nghiệp vụ:* Trước khi cho phép cộng lượt upvote, hệ thống sẽ thực hiện kiểm tra điều kiện bản ghi `UPVOTE` để đảm bảo mỗi tài khoản chỉ được vote một lần duy nhất.
