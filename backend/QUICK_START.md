# Quick Start Guide - Healthcare Backend

## Đã sửa lỗi Network Error ✅

Đã thêm 2 API routes mới để sửa lỗi network error ở trang **Thông tin cá nhân** và **Cập nhật thông tin**:

- `GET /api/department/:id` - Lấy thông tin phòng ban theo ID
- `GET /api/department` - Lấy danh sách tất cả phòng ban
- `GET /api/position/:id` - Lấy thông tin chức vụ theo ID
- `GET /api/position` - Lấy danh sách tất cả chức vụ

## Cách chạy Backend

### 1. Cài đặt dependencies (nếu chưa có)
```bash
cd backend
npm install
```

### 2. Cấu hình Database

Tạo file `.env` trong thư mục `backend`:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=healthcare_db
DB_PASSWORD=1231234
DB_PORT=5433

# Server Configuration
PORT=5001

# Admin Password
ADMIN_PASSWORD=Admin@123
```

**Lưu ý:** Thay đổi `DB_PASSWORD` và `DB_PORT` theo cấu hình PostgreSQL của bạn.

### 3. Khởi động Server

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5001`

### 4. Kiểm tra API

Truy cập Swagger UI để test APIs:
```
http://localhost:5001/api-docs
```

## Danh sách tất cả API Endpoints

### Employee & Organization
- `GET /api/employee/:employee_id` - Lấy thông tin nhân viên
- `GET /api/employee/list-employee` - Danh sách nhân viên
- `POST /api/employee/register` - Đăng ký nhân viên
- `POST /api/employee/login` - Đăng nhập
- `PUT /api/employee/update/:employee_id` - Cập nhật thông tin

### Department & Position (MỚI ✨)
- `GET /api/department/:id` - Lấy thông tin phòng ban
- `GET /api/department` - Danh sách phòng ban
- `GET /api/position/:id` - Lấy thông tin chức vụ
- `GET /api/position` - Danh sách chức vụ

### Healthcare Management
- `GET /api/laboratory` - Quản lý xét nghiệm
- `GET /api/fund` - Quản lý quỹ
- `GET /api/revenue` - Doanh thu khám chữa bệnh
- `GET /api/insurance` - Thanh toán bảo hiểm
- `GET /api/expense` - Chi phí hoạt động
- `GET /api/patient` - Quản lý bệnh nhân
- `GET /api/schedule` - Lịch làm việc
- `GET /api/account` - Quản lý tài khoản

## Troubleshooting

### Lỗi: "Cannot find module 'express'"
```bash
cd backend
npm install
```

### Lỗi: "connect ECONNREFUSED 127.0.0.1:5432"

**Nguyên nhân:** PostgreSQL chưa chạy hoặc port sai

**Giải pháp:**
1. Kiểm tra PostgreSQL đang chạy
2. Kiểm tra `DB_PORT` trong file `.env` (có thể là 5432 hoặc 5433)
3. Kiểm tra `DB_PASSWORD` đúng với password PostgreSQL của bạn

### Lỗi: "Network Error" ở frontend

**Đã sửa!** Đảm bảo backend đang chạy tại `http://localhost:5001`

Kiểm tra:
```bash
curl http://localhost:5001/api/department/1
curl http://localhost:5001/api/position/1
```

### Database chưa được setup

Xem hướng dẫn chi tiết tại: [DATABASE_SETUP.md](./DATABASE_SETUP.md)

Tóm tắt:
```bash
# 1. Tạo database
createdb healthcare_db -U postgres

# 2. Chạy migration (nếu có file migration mới từ main)
psql -U postgres -d healthcare_db -f src/migrations/PG_HealthCare.session.sql

# Hoặc import từ backup
psql -U postgres -d healthcare_db < backup.sql
```

## Test Connection

Chạy script test database:
```bash
cd backend
node test-db.js
```

Nếu kết nối thành công, bạn sẽ thấy:
```
✅ Connection SUCCESSFUL!
⏰ Server time: ...
```

## Cấu trúc Database

Backend sử dụng các bảng:

### Bảng cũ (đã có):
- `infor_users` - Thông tin người dùng
- `infor_employee` - Thông tin nhân viên
- `infor_auth_employee` - Xác thực nhân viên
- `list_department` - Danh sách phòng ban
- `list_position` - Danh sách chức vụ

### Bảng mới (PostgreSQL migration):
- `laboratory_tests` - Xét nghiệm
- `fund_transactions` - Giao dịch quỹ
- `medical_revenue` - Doanh thu
- `insurance_claims` - Bảo hiểm
- `operating_expenses` - Chi phí
- `patients` - Bệnh nhân
- `work_schedules` - Lịch làm việc
- `accounts` - Tài khoản

## Next Steps

1. ✅ Backend đã sửa xong lỗi network error
2. ✅ Đã thêm Department và Position routes
3. ✅ Swagger UI đã cập nhật
4. 🔄 Cần setup database nếu chưa có
5. 🔄 Chạy backend và test

## Support

Nếu gặp vấn đề:
1. Kiểm tra file `.env` có đúng cấu hình không
2. Kiểm tra PostgreSQL đang chạy
3. Kiểm tra console log khi chạy `npm start`
4. Xem chi tiết lỗi trong terminal

Happy coding! 🚀
