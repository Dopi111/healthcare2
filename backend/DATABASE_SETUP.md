# Database Setup - PostgreSQL

## Hướng dẫn cài đặt Database cho Healthcare Management System

### 1. Cài đặt PostgreSQL

#### Windows:
1. Download PostgreSQL từ: https://www.postgresql.org/download/windows/
2. Chạy installer và làm theo hướng dẫn
3. Ghi nhớ password cho user `postgres`

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Tạo Database

Mở terminal/command prompt và chạy:

```bash
# Đăng nhập vào PostgreSQL
psql -U postgres

# Tạo database mới
CREATE DATABASE healthcare_db;

# Thoát khỏi psql
\q
```

### 3. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `/backend`:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=healthcare_db
DB_PASSWORD=your_password_here
DB_PORT=5432

# Server Configuration
PORT=5001

# Admin Password (cho ensureDefaultAdmin)
ADMIN_PASSWORD=Admin@123
```

**Lưu ý:** Thay `your_password_here` bằng password PostgreSQL của bạn.

### 4. Chạy Migration

Có 2 cách để chạy migration:

#### Cách 1: Sử dụng psql (Khuyên dùng)

```bash
# Chạy migration file
psql -U postgres -d healthcare_db -f src/migrations/001_create_healthcare_tables.sql
```

#### Cách 2: Sử dụng pgAdmin hoặc DBeaver

1. Mở pgAdmin hoặc DBeaver
2. Kết nối đến database `healthcare_db`
3. Mở file `src/migrations/001_create_healthcare_tables.sql`
4. Chạy toàn bộ script

### 5. Kiểm tra Database

Sau khi chạy migration, kiểm tra xem các bảng đã được tạo:

```bash
psql -U postgres -d healthcare_db
```

Trong psql, chạy:

```sql
-- Liệt kê tất cả các bảng
\dt

-- Kiểm tra dữ liệu mẫu
SELECT * FROM laboratory_tests;
SELECT * FROM fund_transactions;
SELECT * FROM medical_revenue;
SELECT * FROM insurance_claims;
SELECT * FROM operating_expenses;
SELECT * FROM patients;
SELECT * FROM work_schedules;
SELECT * FROM accounts;
```

### 6. Chạy Server

```bash
cd backend
npm install
npm start
```

Server sẽ chạy tại: `http://localhost:5001`
Swagger UI: `http://localhost:5001/api-docs`

### 7. Test APIs

Sử dụng Swagger UI hoặc curl để test:

```bash
# Test Laboratory API
curl http://localhost:5001/api/laboratory

# Test Fund API
curl http://localhost:5001/api/fund

# Test Statistics
curl http://localhost:5001/api/laboratory/statistics/summary
```

## Database Schema

### Tables Created:

1. **laboratory_tests** - Quản lý xét nghiệm
2. **fund_transactions** - Giao dịch quỹ
3. **medical_revenue** - Doanh thu khám chữa bệnh
4. **insurance_claims** - Hồ sơ bảo hiểm
5. **operating_expenses** - Chi phí hoạt động
6. **patients** - Bệnh nhân
7. **work_schedules** - Lịch làm việc
8. **accounts** - Tài khoản

### Sample Data

Migration file đã tự động insert dữ liệu mẫu cho tất cả các bảng. Bạn có thể:
- Xem dữ liệu mẫu để hiểu cấu trúc
- Xóa dữ liệu mẫu nếu muốn bắt đầu từ database trống
- Sửa đổi dữ liệu mẫu theo nhu cầu

## Troubleshooting

### Lỗi: "connect ECONNREFUSED 127.0.0.1:5432"

**Nguyên nhân:** PostgreSQL chưa chạy

**Giải pháp:**
```bash
# Windows
# Mở Services → Tìm PostgreSQL → Start

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
sudo systemctl status postgresql
```

### Lỗi: "password authentication failed for user postgres"

**Nguyên nhân:** Sai password trong file `.env`

**Giải pháp:**
1. Kiểm tra lại password PostgreSQL
2. Cập nhật `DB_PASSWORD` trong file `.env`

### Lỗi: "database healthcare_db does not exist"

**Nguyên nhân:** Chưa tạo database

**Giải pháp:**
```bash
psql -U postgres
CREATE DATABASE healthcare_db;
\q
```

### Lỗi: "relation laboratory_tests does not exist"

**Nguyên nhân:** Chưa chạy migration

**Giải pháp:**
```bash
psql -U postgres -d healthcare_db -f src/migrations/001_create_healthcare_tables.sql
```

## Reset Database

Nếu muốn reset database về trạng thái ban đầu:

```sql
-- Xóa tất cả dữ liệu nhưng giữ cấu trúc
TRUNCATE TABLE laboratory_tests RESTART IDENTITY CASCADE;
TRUNCATE TABLE fund_transactions RESTART IDENTITY CASCADE;
TRUNCATE TABLE medical_revenue RESTART IDENTITY CASCADE;
TRUNCATE TABLE insurance_claims RESTART IDENTITY CASCADE;
TRUNCATE TABLE operating_expenses RESTART IDENTITY CASCADE;
TRUNCATE TABLE patients RESTART IDENTITY CASCADE;
TRUNCATE TABLE work_schedules RESTART IDENTITY CASCADE;
TRUNCATE TABLE accounts RESTART IDENTITY CASCADE;

-- Hoặc xóa và tạo lại database hoàn toàn
DROP DATABASE healthcare_db;
CREATE DATABASE healthcare_db;
-- Sau đó chạy lại migration
```

## Backup & Restore

### Backup:
```bash
pg_dump -U postgres healthcare_db > backup.sql
```

### Restore:
```bash
psql -U postgres healthcare_db < backup.sql
```

## Production Deployment

Khi deploy lên production:

1. Tạo user PostgreSQL riêng (không dùng user `postgres`)
2. Set strong password
3. Cấu hình SSL cho database connection
4. Sử dụng environment variables từ hosting provider
5. Backup database định kỳ

## Thông tin liên hệ

Nếu gặp vấn đề, tham khảo:
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Node.js pg library: https://node-postgres.com/
