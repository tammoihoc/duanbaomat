# Dự án bảo mật — ShopPC

Ứng dụng bán máy tính gồm backend Spring Boot (`backendnosecurity/`) và frontend React + Vite (`fontend/`).

## Cấu hình trên máy mới

Các file chứa thông tin đăng nhập và khóa mã hóa trên máy phát triển không được đưa lên GitHub. Tạo bản cấu hình riêng từ các mẫu:

```bash
cp docker-compose.example.yml docker-compose.yml
cp backendnosecurity/src/main/resources/application.example.properties backendnosecurity/src/main/resources/application.properties
cp backendnosecurity/src/main/java/com/shoppc/backendnosecurity/config/CryptoKeys.java.example backendnosecurity/src/main/java/com/shoppc/backendnosecurity/config/CryptoKeys.java
```

Điền mật khẩu MySQL trong hai file cấu hình cho khớp nhau. Điền khóa AES và cặp khóa RSA riêng vào `CryptoKeys.java`; có thể tham khảo `KeyGeneratorTool.java` trong backend. Giữ nguyên khóa cũ nếu cần đọc dữ liệu đã mã hóa của một bản cài đặt có sẵn.

## Chạy dự án

1. Cài Docker Compose, Java theo phiên bản trong `backendnosecurity/pom.xml`, và Node.js/npm.
2. Khởi động MySQL: `docker compose up -d`.
3. Chạy backend từ `backendnosecurity/`: `./mvnw spring-boot:run` (API tại `http://localhost:8080`).
4. Trong `fontend/`, chạy `npm ci`, sau đó `npm run dev`; mở địa chỉ Vite in trong terminal.

Tên thư mục `fontend` và `backendnosecurity` được giữ theo dự án gốc. Dữ liệu MySQL, file upload, dependency và kết quả build không nằm trong kho mã nguồn.
