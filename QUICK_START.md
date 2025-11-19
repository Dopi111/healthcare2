# 🚀 Quick Start Guide - Healthcare Management System

## ⚡ Quick Migration (3 Steps)

### **Bước 1: Chạy Clean Migration** ⭐ RECOMMENDED

```bash
# Option A: psql command (Recommended - Fastest)
psql -U postgres -d healthcare_db -f backend/src/migrations/000_clean_migration.sql

# Option B: psql interactive
psql -U postgres -d healthcare_db
\i backend/src/migrations/000_clean_migration.sql
```

**Lưu ý**:
- Sử dụng `000_clean_migration.sql` (KHÔNG có sample data, tránh lỗi foreign key)
- Nếu cần sample data, chạy riêng sau khi migration xong

### **Bước 2: Verify Database**

```bash
psql -U postgres -d healthcare_db -f backend/src/migrations/verify_database.sql
```

Nếu thấy tất cả ✅ thì DONE!

### **Bước 3: Start Servers**

```bash
# Terminal 1 - Backend
cd backend
npm install  # chỉ cần lần đầu
npm run dev

# Terminal 2 - Frontend
cd fontend
npm install  # chỉ cần lần đầu
npm run dev
```

**Test Login**: http://localhost:5173/Admin/auth/login
- Username: `admin`
- Password: `admin123`

---

## 📋 Migration Scripts Available

### **000_clean_migration.sql** ⭐ RECOMMENDED
- Clean schema only, NO sample data
- Tránh lỗi foreign key constraint
- Chỉ tạo 16 tables + essential data (departments, positions, accounts)
- **Use this for production!**

### **000_master_migration.sql**
- Includes schema + may include sample data
- Có thể gặp lỗi nếu sample data không hợp lệ
- Use only if you need full sample data

**Recommended**: Luôn dùng `000_clean_migration.sql`

Script clean migration sẽ tự động tạo:

1. ✅ **001** - Core tables (users, employees, departments, positions)
2. ✅ **003** - User medical info
3. ✅ **004** - Appointments
4. ✅ **005** - Lab results
5. ✅ **006** - Employee fields
6. ✅ **007** - Patients, expenses, funds, insurance, revenue, tests
7. ✅ **009** - Accounts table (snake_case)

---

## 🗂️ Database Structure

### Core Tables (Employee Management)
```
list_department       → Danh sách phòng ban
list_position         → Danh sách chức vụ
infor_users          → Thông tin người dùng (users + employees)
infor_employee       → Chi tiết nhân viên
infor_auth_employee  → Xác thực nhân viên (legacy)
accounts             → Tài khoản đăng nhập (NEW)
```

### Healthcare Tables
```
patients             → Bệnh nhân
appointments         → Lịch hẹn
user_medical_info    → Thông tin y tế
lab_results          → Kết quả xét nghiệm
laboratory_tests     → Phòng lab
test_results         → Phiếu kết quả
```

### Financial Tables
```
expenses             → Chi phí
funds                → Quỹ
insurance_claims     → Bảo hiểm
revenue              → Doanh thu
```

---

## 🔍 Verify Commands

### Check Tables
```sql
-- List all tables
\dt

-- Check specific table
\d accounts
\d infor_users
\d patients
```

### Check Data
```sql
-- Departments (should be 10)
SELECT COUNT(*) FROM list_department;

-- Positions (should be 10)
SELECT COUNT(*) FROM list_position;

-- Accounts (should be 5)
SELECT * FROM accounts;
```

### Test Login
```sql
-- Test admin login
SELECT id, employee_id, name, role
FROM accounts
WHERE employee_id = 'admin' AND password = 'admin123';

-- Should return 1 row
```

---

## 🔥 Troubleshooting

### Problem: "relation does not exist"
**Solution**: Chạy clean migration
```bash
psql -U postgres -d healthcare_db -f backend/src/migrations/000_clean_migration.sql
```

### Problem: "column employeeid does not exist" hoặc "foreign key constraint violation"
**Solution**: Bảng cũ tồn tại với naming sai hoặc data không hợp lệ. Drop và chạy lại:
```bash
# Drop everything và chạy clean migration
psql -U postgres -d healthcare_db -f backend/src/migrations/000_clean_migration.sql
```

### Problem: "Error ensuring default admin: foreign key violation"
**Solution**: Đây là lỗi từ sample data cũ. Chạy clean migration:
```bash
psql -U postgres -d healthcare_db -f backend/src/migrations/000_clean_migration.sql
```

### Problem: "database does not exist"
**Solution**: Tạo database trước:
```bash
# Login as postgres
psql -U postgres

# Create database
CREATE DATABASE healthcare_db;

# Exit and run migration
\q
psql -U postgres -d healthcare_db -f backend/src/migrations/000_master_migration.sql
```

### Problem: Backend không start
**Check**:
```bash
# 1. Check .env file exists
ls -la backend/.env

# 2. Check .env content
cat backend/.env

# Should have:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=healthcare_db
# DB_USER=postgres
# DB_PASSWORD=your_password

# 3. Test database connection
psql -U postgres -d healthcare_db -c "SELECT 1"
```

### Problem: Frontend lỗi CORS
**Check**:
```bash
# Backend .env should have:
CORS_ORIGIN=http://localhost:5173

# Frontend .env should have:
VITE_API_URL=http://localhost:5001/api
```

---

## 🧪 API Testing

### Test Endpoints
```bash
# 1. Get all accounts
curl http://localhost:5001/api/account

# 2. Login
curl -X POST http://localhost:5001/api/account/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"admin","password":"admin123"}'

# 3. Get patients
curl http://localhost:5001/api/patients-new

# 4. Get expenses
curl http://localhost:5001/api/expenses-new
```

---

## 📁 Project Structure

```
healthcare2/
├── backend/
│   ├── src/
│   │   ├── migrations/
│   │   │   ├── 000_master_migration.sql     ← RUN THIS
│   │   │   ├── verify_database.sql          ← VERIFY WITH THIS
│   │   │   ├── 001_init_schema.sql
│   │   │   ├── 002_insert_sample_data.sql
│   │   │   ├── 003-008...
│   │   │   └── 009_create_accounts_table_fixed.sql
│   │   ├── routes/
│   │   │   ├── accountRoutes.js             ← Uses employee_id
│   │   │   ├── patientsNewRoutes.js
│   │   │   └── ...
│   │   └── controllers/
│   ├── .env                                  ← DB config
│   └── package.json
│
├── fontend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── AccountService.js            ← Uses employee_id
│   │   │   ├── PatientService.js
│   │   │   └── api.js
│   │   ├── pages/
│   │   │   └── AdminPage/
│   │   │       ├── auth/
│   │   │       │   └── Login_E.jsx          ← Login page
│   │   │       └── Adminstator/
│   │   │           └── Accounts_Management.jsx
│   │   └── App.jsx
│   ├── .env                                  ← API URL
│   └── package.json
│
├── DATABASE_MIGRATION_GUIDE.md               ← Detailed guide
└── QUICK_START.md                            ← This file
```

---

## ✅ Success Checklist

After running migration, verify:

- [ ] Master migration ran without errors
- [ ] Verify script shows all tables ✅
- [ ] 5 accounts exist in database
- [ ] Backend starts on port 5001
- [ ] Frontend starts on port 5173
- [ ] Login page loads
- [ ] Can login with admin/admin123
- [ ] Redirects to dashboard
- [ ] No errors in console

---

## 🎯 Default Accounts

| Username | Password | Role | Department |
|----------|----------|------|------------|
| admin | admin123 | administrator | Quản trị |
| doctor01 | doctor123 | doctor | Bác sĩ chuyên khoa |
| nurse01 | nurse123 | nurse | Điều dưỡng |
| reception01 | reception123 | receptionist | Tiếp tân |
| accountant01 | accountant123 | accountant | Kế toán |

---

## 📞 Need Help?

### View Logs
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd fontend && npm run dev

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Clean Restart
```bash
# Stop everything
pkill -f node
sudo systemctl restart postgresql

# Start fresh
cd backend && npm run dev
cd fontend && npm run dev
```

### Check Database
```bash
# Connect to database
psql -U postgres -d healthcare_db

# List tables
\dt

# Check accounts
SELECT * FROM accounts;

# Exit
\q
```

---

## 🎉 Done!

Nếu mọi thứ hoạt động:
1. ✅ Database có đầy đủ tables
2. ✅ Backend API hoạt động
3. ✅ Frontend login thành công
4. ✅ Không có lỗi trong console

**Bạn đã sẵn sàng phát triển! 🚀**

---

For detailed documentation, see:
- `DATABASE_MIGRATION_GUIDE.md` - Chi tiết migration
- `ACCOUNT_SERVICE_MIGRATION.md` - Account service migration
- `backend/src/migrations/` - Các migration files
