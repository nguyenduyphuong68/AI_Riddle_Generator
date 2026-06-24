# AI Riddle Generator - Hệ Thống Tạo Câu Đố Tư Duy Cho Trẻ Em

Ứng dụng web Single Page Application (SPA) đơn giản, tinh gọn và đẹp mắt sử dụng Trí Tuệ Nhân Tạo (AI) để chuyển đổi từ khóa đáp án thành các câu đố học thuật (Lịch sử, Văn học, Khoa học) hoặc mật mã chữ đầu (Acrostic) nhằm phát triển trí não cho học sinh Cấp 1 & Cấp 2.

Dự án được chuẩn bị sẵn cấu trúc Serverless để kết nối trực tiếp với các dịch vụ đám mây của **Amazon Web Services (AWS)**.

---

## 📂 Cấu trúc Thư mục Dự án

```
AI_Riddle_Generator/
├── index.html              # Trang giao diện chính (Single Page Application layout)
├── style.css               # Giao diện Glassmorphism hiện đại, Dark Mode & cấu hình in PDF
├── README.md               # Hướng dẫn này
└── js/
    ├── app.js              # Xử lý các sự kiện click, định tuyến tab, LocalStorage và Print
    ├── database.js         # Dữ liệu câu đố cộng đồng và bộ sinh mô phỏng AI (Mock Generator)
    └── aws-guide.js        # Hướng dẫn chi tiết thiết lập AWS & Code Lambda mẫu
```

---

## ⚙️ Hướng dẫn Khởi chạy Giao diện Cục bộ (Local Run)

Vì ứng dụng được xây dựng hoàn toàn bằng **HTML5, CSS3 và Javascript (ES Modules)** nguyên bản, bạn có hai cách cực kỳ đơn giản để chạy thử nghiệm:

### Cách 1: Sử dụng Liveserver (Khuyên Dùng)
Do JS sử dụng ES Modules (`type="module"`), trình duyệt yêu cầu chạy tệp từ một Web Server cục bộ thay vì nhấp đúp trực tiếp vào file.
1. Nếu dùng **VS Code**, hãy cài đặt extension **Live Server**.
2. Nhấp chuột phải vào `index.html` và chọn **Open with Live Server**.
3. Ứng dụng sẽ tự động chạy tại cổng `http://127.0.0.1:5500`.

### Cách 2: Khởi chạy Máy chủ Cục bộ qua Python
Nếu máy bạn đã cài sẵn Python:
1. Mở cửa sổ terminal/command prompt tại thư mục dự án `D:\Thuc Tap AWS\du an\project-nhom\AI_Riddle_Generator`.
2. Chạy lệnh:
   ```bash
   python -m http.server 8000
   ```
3. Mở trình duyệt và truy cập: `http://localhost:8000`.

---

## ☁️ Tích hợp Dịch vụ đám mây AWS (Serverless Setup Roadmap)

Ứng dụng được thiết kế để kết nối trực tiếp với AWS. Trong tab **AWS Developer Hub** tích hợp trực tiếp trên giao diện ứng dụng, chúng tôi đã chuẩn bị:
1. **Sơ đồ luồng kiến trúc (Architecture Map):** Phối hợp các dịch vụ S3, CloudFront, API Gateway, Lambda, DynamoDB và Amazon Bedrock.
2. **Mã nguồn AWS Lambda (Python):** Viết sẵn hàm xử lý để gửi câu lệnh chỉ thị (System Prompts) lên Bedrock (Claude 3.5 Sonnet) để sinh câu đố chuẩn hóa dạng JSON và lưu vết vào DynamoDB.
3. **Mẫu kết nối RESTful API:** Đoạn code Javascript giúp bạn thay thế cơ chế sinh câu đố mô phỏng bằng API Gateway thực tế.
4. **Hướng dẫn cấu hình CORS:** Hướng dẫn chi tiết cách cấu hình API Gateway để tránh các lỗi bảo mật chặn CORS khi gọi từ trình duyệt.
