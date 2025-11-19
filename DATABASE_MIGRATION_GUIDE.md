# Hướng Dẫn Migration Database - Sửa Lỗi Naming Convention

## Vấn Đề
PostgreSQL tự động chuyển đổi tên cột không có quotes sang lowercase, dẫn đến:
- `employeeId` → `employeeid` ❌
- Cần dùng `employee_id` (snake_case) ✅

## Giải Pháp
Đã cập nhật toàn bộ hệ thống sử dụng snake_case naming convention đúng chuẩn PostgreSQL.

---

## 🚀 Bước 1: Chạy Migration Fixed

### Option A: Sử dụng psql command line

```bash
# Connect đến database
psql -U postgres -d healthcare_db

# Chạy migration fixed
\i backend/src/migrations/009_create_accounts_table_fixed.sql

# Verify kết quả
SELECT * FROM accounts;
```

### Option B: Sử dụng database client (DBeaver, pgAdmin, etc.)

1. Mở database client của bạn
2. Connect đến database `healthcare_db`
3. Copy toàn bộ nội dung file: `backend/src/migrations/009_create_accounts_table_fixed.sql`
4. Paste và Execute
5. Verify: `SELECT * FROM accounts;`

### Option C: Sử dụng Node.js script

```bash
cd backend
node -e "
const { Pool } = require('pg');
const fs = require('fs');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'healthcare_db',
  password: 'your_password',
  port: 5432,
});
const sql = fs.readFileSync('src/migrations/009_create_accounts_table_fixed.sql', 'utf8');
pool.query(sql).then(() => {
  console.log('✅ Migration completed!');
  pool.end();
}).catch(err => {
  console.error('❌ Migration failed:', err);
  pool.end();
});
"
```

---

## 🔍 Bước 2: Verify Migration

### Kiểm tra cấu trúc bảng:

```sql
-- Show table structure
\d accounts

-- Should see:
--   id              | integer
--   employee_id     | character varying(50)  ✅ (NOT employeeid)
--   password        | character varying(255)
--   name            | character varying(100)
--   department      | character varying(100)
--   position        | character varying(100)
--   role            | character varying(50)
--   phone           | character varying(20)
--   email           | character varying(100)
--   status          | character varying(20)
--   created_at      | timestamp
--   updated_at      | timestamp
```

### Kiểm tra dữ liệu:

```sql
-- Check default accounts
SELECT id, employee_id, name, role, status FROM accounts;

-- Should return 5 rows:
-- id | employee_id   | name                    | role           | status
-- ---|---------------|-------------------------|----------------|--------
--  1 | admin         | Admin                   | administrator  | active
--  2 | doctor01      | Bác sĩ Nguyễn Văn A     | doctor         | active
--  3 | nurse01       | Y tá Trần Thị B         | nurse          | active
--  4 | reception01   | Lễ tân Lê Văn C         | receptionist   | active
--  5 | accountant01  | Kế toán Phạm Thị D      | accountant     | active
```

### Test login query:

```sql
-- Test login for admin account
SELECT id, employee_id, name, role
FROM accounts
WHERE employee_id = 'admin' AND password = 'admin123';

-- Should return 1 row with admin info
```

---

## 🔄 Bước 3: Restart Backend Server

```bash
cd backend

# Install dependencies if needed
npm install

# Start server
npm run dev

# Server should start on port 5001
# Check console for: "Server running on port 5001"
```

---

## 🎯 Bước 4: Test API Endpoints

### Test 1: Get All Accounts
```bash
curl http://localhost:5001/api/account
```

Expected response:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "employee_id": "admin",
      "name": "Admin",
      "department": "Quản trị",
      "position": "Quản trị viên",
      "role": "administrator",
      "phone": "0123456789",
      "email": "admin@healthcare.com",
      "status": "active",
      "created_at": "2025-11-19T..."
    },
    ...
  ]
}
```

### Test 2: Login
```bash
curl -X POST http://localhost:5001/api/account/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"admin","password":"admin123"}'
```

Expected response:
```json
{
  "success": true,
  "account": {
    "id": 1,
    "employee_id": "admin",
    "name": "Admin",
    "role": "administrator",
    ...
  }
}
```

---

## 🖥️ Bước 5: Test Frontend

### Start frontend:
```bash
cd fontend
npm run dev
```

### Test login page:
1. Mở browser: `http://localhost:5173/Admin/auth/login`
2. Login với: `admin` / `admin123`
3. Kiểm tra:
   - ✅ Demo accounts hiển thị đúng
   - ✅ Login thành công
   - ✅ Redirect đến Dashboard
   - ✅ Không có lỗi trong Console

### Test Accounts Management:
1. Navigate đến: `/Admin/Adminstator/Accounts_Management`
2. Kiểm tra:
   - ✅ Danh sách accounts load được
   - ✅ Search hoạt động
   - ✅ Add account mới
   - ✅ Edit account
   - ✅ Delete account

---

## 📋 Các Thay Đổi Đã Thực Hiện

### Backend:
- ✅ `backend/src/migrations/009_create_accounts_table_fixed.sql` - Migration mới với snake_case
- ✅ `backend/src/routes/accountRoutes.js` - Cập nhật queries dùng `employee_id`

### Frontend:
- ✅ `fontend/src/services/AccountService.js` - Sử dụng `employee_id`
- ✅ `fontend/src/pages/AdminPage/auth/Login_E.jsx` - Cập nhật field names
- ✅ `fontend/src/pages/AdminPage/Adminstator/Accounts_Management.jsx` - Cập nhật field names

---

## 🐛 Troubleshooting

### Lỗi: "column employeeid does not exist"
**Nguyên nhân**: Bảng cũ vẫn tồn tại với tên cột sai

**Giải pháp**:
```sql
-- Drop bảng cũ và chạy lại migration
DROP TABLE IF EXISTS accounts CASCADE;
\i backend/src/migrations/009_create_accounts_table_fixed.sql
```

### Lỗi: "relation accounts does not exist"
**Nguyên nhân**: Migration chưa chạy

**Giải pháp**: Chạy lại migration fixed (Bước 1)

### Lỗi: "Cannot connect to database"
**Nguyên nhân**: PostgreSQL chưa chạy hoặc config sai

**Giải pháp**:
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Verify connection
psql -U postgres -d healthcare_db -c "SELECT 1"
```

### Lỗi: "Network Error" từ frontend
**Nguyên nhân**: Backend chưa chạy hoặc CORS issues

**Giải pháp**:
```bash
# Check backend is running
curl http://localhost:5001/api/account

# Check .env file in backend:
PORT=5001
CORS_ORIGIN=http://localhost:5173
```

### Lỗi: "employee_id is undefined" trong frontend
**Nguyên nhân**: Code chưa được cập nhật hoặc cache

**Giải pháp**:
```bash
# Clear cache and rebuild frontend
cd fontend
rm -rf node_modules/.vite
npm run dev
```

---

## ✅ Checklist Hoàn Thành

- [ ] Database migration chạy thành công
- [ ] Bảng `accounts` có cột `employee_id` (NOT `employeeid`)
- [ ] 5 default accounts được tạo
- [ ] Backend API trả về `employee_id` trong response
- [ ] Login API hoạt động với admin/admin123
- [ ] Frontend login page hoạt động
- [ ] Accounts Management page hoạt động
- [ ] Không có lỗi trong browser console
- [ ] Không có lỗi trong backend logs

---

## 📞 Cần Hỗ Trợ?

### Check logs:
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd fontend && npm run dev

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Quick fixes:
```bash
# Restart everything
pkill -f node
sudo systemctl restart postgresql

# Clean install
cd backend && rm -rf node_modules && npm install
cd fontend && rm -rf node_modules && npm install
```

---

## 🎉 Hoàn Tất!

Sau khi hoàn thành tất cả các bước, hệ thống của bạn sẽ:
- ✅ Sử dụng PostgreSQL thay vì localStorage
- ✅ Naming convention đúng chuẩn (snake_case)
- ✅ Login hoạt động với database
- ✅ CRUD accounts hoạt động hoàn chỉnh
