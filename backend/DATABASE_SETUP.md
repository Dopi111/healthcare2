# 🏥 HƯỚNG DẪN SETUP DATABASE HEALTHCARE

> **Tài liệu này hướng dẫn cách tạo database PostgreSQL từ đầu cho Healthcare Management System**

---

## 📋 MỤC LỤC

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Bước 1: Tạo Database mới](#bước-1-tạo-database-mới)
3. [Bước 2: Chạy Migration Schema](#bước-2-chạy-migration-schema)
4. [Bước 3: Import Sample Data](#bước-3-import-sample-data)
5. [Bước 4: Verify Database](#bước-4-verify-database)
6. [Bước 5: Cấu hình Backend](#bước-5-cấu-hình-backend)
7. [Troubleshooting](#troubleshooting)

---

## ⚙️ YÊU CẦU HỆ THỐNG

- **PostgreSQL**: Version 12+ (khuyến nghị 14+)
- **psql**: PostgreSQL command-line tool
- **Node.js**: Version 18+ (để chạy backend)
- **npm**: Version 9+

Kiểm tra version:
```bash
psql --version        # PostgreSQL 14.x trở lên
node --version        # v18.x trở lên
npm --version         # 9.x trở lên
```

---

## 🗄️ BƯỚC 1: TẠO DATABASE MỚI

### Option 1: Sử dụng psql command line

```bash
# 1. Kết nối vào PostgreSQL với user postgres
psql -U postgres

# 2. Xóa database cũ (nếu có)
DROP DATABASE IF EXISTS healthcare;

# 3. Tạo database mới
CREATE DATABASE healthcare;

# 4. Kết nối vào database vừa tạo
\c healthcare

# 5. Thoát psql (sau khi hoàn thành các bước tiếp theo)
\q
```

### Option 2: Sử dụng pgAdmin

1. Mở **pgAdmin**
2. Kết nối vào PostgreSQL server
3. **Xóa database cũ** (nếu có):
   - Right-click vào database `healthcare` → **Delete/Drop**
4. **Tạo database mới**:
   - Right-click vào **Databases** → **Create** → **Database**
   - Database name: `healthcare`
   - Owner: `postgres` (hoặc user của bạn)
   - Click **Save**

---

## 📊 BƯỚC 2: CHẠY MIGRATION SCHEMA

### Cách 1: Sử dụng psql (Command Line) - KHUYẾN NGHỊ

```bash
# Di chuyển vào thư mục backend
cd backend

# Chạy migration schema
psql -U postgres -d healthcare -f src/migrations/001_init_schema.sql
```

**Output mong đợi:**
```
CREATE EXTENSION
DROP TABLE
DROP TABLE
...
CREATE TABLE
CREATE TABLE
CREATE INDEX
...
NOTICE:  ========================================
NOTICE:  ✅ DATABASE INITIALIZATION COMPLETE
NOTICE:  ========================================
NOTICE:  Tables created: 5
NOTICE:  Departments: 10
NOTICE:  Positions: 10
NOTICE:  ========================================
```

### Cách 2: Sử dụng pgAdmin (Query Tool)

1. Mở **pgAdmin**
2. Chọn database `healthcare`
3. Click **Tools** → **Query Tool**
4. Mở file `backend/src/migrations/001_init_schema.sql`
5. Copy toàn bộ nội dung và paste vào Query Tool
6. Click **Execute** (F5)
7. Kiểm tra **Messages** tab để xem kết quả

### Cách 3: Chạy từ node script

Tạo file `backend/scripts/run-migration.js`:

```javascript
import fs from 'fs';
import pool from '../src/config/db.js';

async function runMigration() {
  try {
    const sql = fs.readFileSync('./src/migrations/001_init_schema.sql', 'utf8');
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
```

Chạy:
```bash
node scripts/run-migration.js
```

---

## 📝 BƯỚC 3: IMPORT SAMPLE DATA

### Chạy migration sample data

```bash
# Vẫn ở trong thư mục backend
psql -U postgres -d healthcare -f src/migrations/002_insert_sample_data.sql
```

**Output mong đợi:**
```
INSERT 0 12
INSERT 0 10
INSERT 0 1
INSERT 0 1
...
NOTICE:  ========================================
NOTICE:  ✅ SAMPLE DATA INSERTION COMPLETE
NOTICE:  ========================================
NOTICE:  📋 Patients (Bệnh nhân): 12
NOTICE:  👨‍⚕️ Employees (Nhân viên): 10
NOTICE:  📊 Employee Details: 10
NOTICE:  ========================================
```

### Sample Data Included:

#### Bệnh nhân (Patients): 12 người
- Nguyễn Văn An (0901234567)
- Trần Thị Bích (0902345678)
- Lê Văn Cường (0903456789)
- ... và 9 người khác

#### Nhân viên (Employees): 10 người

**Bác sĩ (3 người):**
- BS. Nguyễn Văn Anh - Khoa Nội (0201050607 / 0911111111)
- BS. Trần Thị Bảo - Khoa Ngoại (0201050608 / 0922222222)
- BS. Lê Văn Cường - Khoa Nhi (0201050609 / 0933333333)

**Y tá (3 người):**
- YT. Phạm Thị Duyên - Khoa Nội (0201050610 / 0944444444)
- YT. Hoàng Văn Em - Cấp cứu (0201050611 / 0955555555)
- YT. Võ Thị Phương - Khoa Ngoại (0201050612 / 0966666666)

**Lễ tân (2 người):**
- Đặng Thị Giang (0201050613 / 0977777777)
- Bùi Văn Hùng (0201050614 / 0988888888)

**Khác:**
- Phan Thị Hoa - Kế toán (0201050615 / 0999999999)
- Ngô Văn Khải - Kỹ thuật viên (0201050616 / 0900000000)

> **Lưu ý:** Password mặc định cho nhân viên là placeholders. Sử dụng API `/api/employee/register` để tạo account với password thật.

---

## ✅ BƯỚC 4: VERIFY DATABASE

### Kiểm tra tables đã được tạo

```bash
psql -U postgres -d healthcare
```

Trong psql, chạy:

```sql
-- Xem danh sách tables
\dt

-- Đếm số lượng records
SELECT 'Patients' as type, COUNT(*) as count FROM infor_users WHERE role_user = 'users'
UNION ALL
SELECT 'Employees', COUNT(*) FROM infor_users WHERE role_user = 'employee'
UNION ALL
SELECT 'Departments', COUNT(*) FROM list_department
UNION ALL
SELECT 'Positions', COUNT(*) FROM list_position
UNION ALL
SELECT 'Employee Details', COUNT(*) FROM infor_employee;

-- Xem cấu trúc table infor_users
\d infor_users

-- Xem indexes
\di

-- Xem foreign keys
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

**Kết quả mong đợi:**

```
      type       | count
-----------------+-------
 Patients        |    12
 Employees       |    10
 Departments     |    10
 Positions       |    10
 Employee Details|    10
```

### Test queries

```sql
-- Lấy danh sách bệnh nhân
SELECT full_name, phone_number, card_id FROM infor_users WHERE role_user = 'users' LIMIT 5;

-- Lấy danh sách nhân viên với phòng ban
SELECT
    u.full_name,
    u.employee_id,
    p.position_name,
    d.department_name
FROM infor_users u
JOIN infor_employee e ON u.infor_users_id = e.infor_users_id
LEFT JOIN list_position p ON e.position_id = p.position_id
LEFT JOIN list_department d ON e.department_id = d.department_id
WHERE u.role_user = 'employee';
```

---

## ⚙️ BƯỚC 5: CẤU HÌNH BACKEND

### 1. Tạo file `.env` trong thư mục `backend`

```bash
cd backend
touch .env
```

### 2. Thêm cấu hình database vào `.env`

```env
# PostgreSQL Configuration
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=healthcare
PG_PASSWORD=your_password_here
PG_PORT=5432

# Server Configuration
PORT=5001

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Node Environment
NODE_ENV=development
```

> **⚠️ QUAN TRỌNG**: Thay `your_password_here` bằng password PostgreSQL của bạn!

### 3. Install dependencies

```bash
npm install
```

### 4. Chạy backend server

```bash
npm start
```

**Output mong đợi:**
```
🚀 Server đang chạy tại cổng 5001
✅ Kết nối PostgreSQL thành công!
📚 Swagger docs: http://localhost:5001/api-docs
```

### 5. Test API

Mở trình duyệt hoặc Postman:

```bash
# Test health check
curl http://localhost:5001/

# Test get patients
curl http://localhost:5001/api/patients

# Test get employees
curl http://localhost:5001/api/employee/list-employee

# Test Swagger docs
# Mở browser: http://localhost:5001/api-docs
```

---

## 🚀 CHẠY FRONTEND

```bash
# Di chuyển vào thư mục frontend
cd fontend

# Install dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173` (Vite) hoặc `http://localhost:3000` (CRA)

---

## 🔧 TROUBLESHOOTING

### ❌ Lỗi: "database 'healthcare' does not exist"

**Nguyên nhân:** Database chưa được tạo

**Giải pháp:**
```bash
psql -U postgres -c "CREATE DATABASE healthcare;"
```

---

### ❌ Lỗi: "password authentication failed for user 'postgres'"

**Nguyên nhân:** Password trong `.env` không đúng

**Giải pháp:**
1. Kiểm tra password PostgreSQL của bạn
2. Cập nhật `PG_PASSWORD` trong file `.env`
3. Restart server: `npm start`

---

### ❌ Lỗi: "relation 'infor_users' does not exist"

**Nguyên nhân:** Migration chưa được chạy

**Giải pháp:**
```bash
cd backend
psql -U postgres -d healthcare -f src/migrations/001_init_schema.sql
```

---

### ❌ Lỗi: "column 'id' does not exist"

**Nguyên nhân:** Code đang dùng cột sai (dùng `id` thay vì `infor_users_id`)

**Giải pháp:** Database đã được setup đúng, lỗi này đã được fix trong code mới nhất. Pull code mới nhất:
```bash
git pull origin main
```

---

### ❌ Lỗi: "duplicate key value violates unique constraint"

**Nguyên nhân:** Đang cố insert data đã tồn tại

**Giải pháp 1:** Xóa hết data và insert lại
```sql
DELETE FROM infor_employee;
DELETE FROM infor_users;
-- Sau đó chạy lại 002_insert_sample_data.sql
```

**Giải pháp 2:** Drop database và tạo lại từ đầu
```bash
psql -U postgres -c "DROP DATABASE healthcare;"
psql -U postgres -c "CREATE DATABASE healthcare;"
# Chạy lại từ BƯỚC 2
```

---

### ❌ Lỗi: "connect ECONNREFUSED ::1:5432"

**Nguyên nhân:** PostgreSQL service không chạy

**Giải pháp:**

**Windows:**
```bash
# Mở Services (Win + R → services.msc)
# Tìm "postgresql-x64-14" (hoặc version của bạn)
# Right-click → Start
```

**macOS:**
```bash
brew services start postgresql@14
```

**Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

---

### ❌ Backend chạy nhưng API trả về lỗi 500

**Kiểm tra:**

1. **Database connection:**
```bash
psql -U postgres -d healthcare -c "SELECT 1;"
```

2. **Xem logs chi tiết:**
```bash
cd backend
npm start
# Xem console output khi gọi API
```

3. **Verify tables:**
```sql
\c healthcare
\dt
SELECT COUNT(*) FROM infor_users;
```

---

## 📚 CẤU TRÚC DATABASE

### Tables:

1. **infor_users** - Thông tin người dùng (bệnh nhân + nhân viên)
2. **infor_employee** - Chi tiết nhân viên
3. **infor_auth_employee** - Xác thực nhân viên (legacy)
4. **list_department** - Danh sách phòng ban
5. **list_position** - Danh sách chức vụ

### Relationships:

```
infor_users (1) ─────< (1) infor_employee
                           ├─< list_position
                           └─< list_department
```

---

## 🔄 RESET DATABASE (Khi cần)

### Script reset database hoàn toàn:

```bash
#!/bin/bash
# File: backend/scripts/reset-database.sh

echo "🗑️  Dropping database..."
psql -U postgres -c "DROP DATABASE IF EXISTS healthcare;"

echo "🆕 Creating new database..."
psql -U postgres -c "CREATE DATABASE healthcare;"

echo "📊 Running schema migration..."
psql -U postgres -d healthcare -f src/migrations/001_init_schema.sql

echo "📝 Inserting sample data..."
psql -U postgres -d healthcare -f src/migrations/002_insert_sample_data.sql

echo "✅ Database reset complete!"
```

Chạy:
```bash
chmod +x backend/scripts/reset-database.sh
./backend/scripts/reset-database.sh
```

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:

1. Kiểm tra [Troubleshooting](#troubleshooting) section
2. Xem logs trong console
3. Kiểm tra file `.env` configuration
4. Verify PostgreSQL service đang chạy
5. Test connection: `psql -U postgres -d healthcare`

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] PostgreSQL đã cài đặt và chạy
- [ ] Database `healthcare` đã được tạo
- [ ] Migration schema đã chạy thành công (5 tables)
- [ ] Sample data đã được import (12 patients, 10 employees)
- [ ] File `.env` đã được cấu hình đúng
- [ ] Backend server chạy thành công tại port 5001
- [ ] API test thành công (GET /api/patients)
- [ ] Frontend đã connect được với backend
- [ ] Có thể đăng nhập vào dashboard

---

## 🎉 HOÀN THÀNH!

Database của bạn đã sẵn sàng. Bây giờ bạn có thể:

1. ✅ Thêm bệnh nhân mới qua UI "Thêm BN mới"
2. ✅ Xem danh sách bệnh nhân qua "Danh sách BN"
3. ✅ Quản lý nhân viên
4. ✅ Tìm kiếm và xóa bệnh nhân
5. ✅ Test tất cả API endpoints qua Swagger

**Happy coding! 🚀**
