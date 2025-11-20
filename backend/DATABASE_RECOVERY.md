# 🚨 DATABASE RECOVERY GUIDE

## Vấn Đề Bạn Đang Gặp

Bạn đang gặp các lỗi sau:

```
❌ relation "patients" does not exist
❌ relation "test_results" does not exist
❌ relation "laboratory_tests" does not exist
❌ /api/employee/admin2024 → 500 Internal Server Error
❌ Cannot convert undefined or null to object
```

**Nguyên nhân:** Database **CHƯA CÓ CÁC BẢNG** hoặc đã bị mất dữ liệu!

---

## ✅ GIẢI PHÁP NHANH (1 LỆNH)

### Option 1: Tự động (Khuyến nghị)

```bash
cd backend
./scripts/recover-database.sh
```

### Option 2: Thủ công

```bash
cd backend
psql -U postgres -d healthcare_db -f src/migrations/000_clean_migration.sql
```

**Sau khi chạy xong:**
1. ✅ Restart backend: `npm run dev`
2. ✅ Refresh browser (F5)
3. ✅ Login với: `admin` / `admin123`

---

## 📋 CHI TIẾT VẤN ĐỀ

### Vấn Đề 1: Database Thiếu Bảng

**Lỗi:**
```javascript
{
  "success": false,
  "message": "relation 'patients' does not exist"
}
```

**Nguyên nhân:**
- Database `healthcare_db` tồn tại NHƯNG **không có tables**
- Chỉ có 11 bảng thay vì 16 bảng cần thiết
- Migration chưa được chạy hoặc bị rollback

**Các bảng BỊ THIẾU:**
```
❌ patients
❌ test_results
❌ laboratory_tests
❌ expenses
❌ funds
❌ insurance_claims
❌ revenue
```

### Vấn Đề 2: Employee Route Query Sai

**Lỗi:**
```
GET /api/employee/admin2024 → 500 Internal Server Error
```

**Nguyên nhân:**
```javascript
// ❌ SAI - Query theo numeric ID
WHERE e.infor_employee_id = $1  // Expect số (1, 2, 3...)

// ✅ ĐÚNG - Query theo string employee_id
WHERE u.employee_id = $1  // Accept string ("admin2024", "EMP001"...)
```

**Đã fix:** `backend/src/controllers/employeeControllers.js:169`

### Vấn Đề 3: Frontend Crash

**Lỗi:**
```javascript
Fund_Management.jsx:169 Uncaught TypeError:
Cannot convert undefined or null to object
    at Object.entries (<anonymous>)
```

**Nguyên nhân:**
- API `/api/funds-new` trả về error (vì table không tồn tại)
- Frontend nhận `undefined` thay vì data
- `Object.entries(undefined)` → crash!

**Fix:** Khôi phục database → API hoạt động → frontend nhận data đúng

---

## 🔧 HƯỚNG DẪN KHÔI PHỤC CHI TIẾT

### Bước 1: Kiểm Tra Database Hiện Tại

```bash
psql -U postgres -d healthcare_db -c "\dt"
```

**Nếu thấy:**
- `Did not find any relations` → Chưa có bảng nào
- Chỉ 11 bảng → Thiếu 5 bảng quan trọng

### Bước 2: Chạy Migration Khôi Phục

```bash
cd /home/user/healthcare2/backend

# Option A: Dùng script tự động
./scripts/recover-database.sh

# Option B: Chạy migration trực tiếp
psql -U postgres -d healthcare_db -f src/migrations/000_clean_migration.sql
```

**Migration này sẽ:**
1. ✅ DROP tất cả bảng cũ (nếu có)
2. ✅ CREATE lại 16 bảng mới
3. ✅ Tạo indexes
4. ✅ Tạo triggers
5. ✅ Insert default data (departments, positions, accounts)

### Bước 3: Verify Database

```bash
psql -U postgres -d healthcare_db << 'EOF'
-- Kiểm tra số bảng
SELECT COUNT(*) as total_tables
FROM pg_tables
WHERE schemaname = 'public';

-- Kiểm tra dữ liệu mẫu
SELECT 'Departments' as table_name, COUNT(*) FROM list_department
UNION ALL
SELECT 'Positions', COUNT(*) FROM list_position
UNION ALL
SELECT 'Accounts', COUNT(*) FROM accounts;
EOF
```

**Kết quả mong đợi:**
```
total_tables: 16

table_name   | count
-------------|------
Departments  | 10
Positions    | 10
Accounts     | 5
```

### Bước 4: Restart Backend

```bash
cd backend
npm run dev
```

**Kiểm tra log:**
```
✅ Default admin already exists
🚀 Server running on http://localhost:5001
📚 API Documentation available at http://localhost:5001/api-docs
```

### Bước 5: Test API

```bash
# Test patients endpoint
curl http://localhost:5001/api/patients-new

# Test funds endpoint
curl http://localhost:5001/api/funds-new

# Test lab tests endpoint
curl http://localhost:5001/api/laboratory-tests

# Test employee endpoint
curl http://localhost:5001/api/employee/list-employee
```

**Tất cả phải trả về:**
```json
{
  "success": true,
  "data": []
}
```

### Bước 6: Test Frontend

1. Refresh browser (F5)
2. Login với: `admin` / `admin123`
3. Kiểm tra các trang:
   - ✅ Bệnh nhân
   - ✅ Quỹ
   - ✅ Xét nghiệm
   - ✅ Nhân viên

---

## 📊 16 BẢNG CẦN THIẾT

Sau khi chạy migration, database phải có **16 bảng:**

| # | Table Name | Purpose |
|---|------------|---------|
| 1 | `list_department` | Danh sách khoa |
| 2 | `list_position` | Danh sách chức vụ |
| 3 | `infor_users` | Thông tin users/employees |
| 4 | `infor_employee` | Chi tiết nhân viên |
| 5 | `infor_auth_employee` | Auth legacy |
| 6 | `user_medical_info` | Thông tin y tế user |
| 7 | `appointments` | Lịch hẹn |
| 8 | `lab_results` | Kết quả xét nghiệm (user) |
| 9 | **`patients`** | **Hồ sơ bệnh nhân** ⭐ |
| 10 | **`expenses`** | **Chi phí** ⭐ |
| 11 | **`funds`** | **Quỹ tài chính** ⭐ |
| 12 | **`insurance_claims`** | **Bảo hiểm** ⭐ |
| 13 | **`revenue`** | **Doanh thu** ⭐ |
| 14 | **`laboratory_tests`** | **Xét nghiệm** ⭐ |
| 15 | **`test_results`** | **Kết quả test** ⭐ |
| 16 | `accounts` | Tài khoản login |

**⭐ = Bảng đang BỊ THIẾU gây lỗi**

---

## 🔐 DEFAULT LOGIN ACCOUNTS

Sau khi chạy migration, sẽ có 5 accounts mặc định:

| Username | Password | Role | Email |
|----------|----------|------|-------|
| `admin` | `admin123` | administrator | admin@healthcare.com |
| `doctor01` | `doctor123` | doctor | doctor01@healthcare.com |
| `nurse01` | `nurse123` | nurse | nurse01@healthcare.com |
| `reception01` | `reception123` | receptionist | reception01@healthcare.com |
| `accountant01` | `accountant123` | accountant | accountant01@healthcare.com |

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Migration Sẽ XÓA DỮ LIỆU CŨ

```sql
-- Migration bắt đầu bằng:
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
-- ... (xóa tất cả bảng cũ)
```

**Nếu bạn có dữ liệu quan trọng:**
1. Backup trước khi chạy:
   ```bash
   pg_dump -U postgres healthcare_db > backup_$(date +%Y%m%d).sql
   ```
2. Hoặc dùng migration khác không DROP data

### 2. Database Phải Tồn Tại

```bash
# Tạo database nếu chưa có
psql -U postgres -c "CREATE DATABASE healthcare_db;"
```

### 3. Check PostgreSQL Đang Chạy

```bash
# Kiểm tra service
sudo systemctl status postgresql

# Hoặc
pg_isready -U postgres
```

---

## 🐛 TROUBLESHOOTING

### Lỗi: "psql: command not found"

```bash
# Ubuntu/Debian
sudo apt install postgresql-client

# macOS
brew install postgresql
```

### Lỗi: "FATAL: database 'healthcare_db' does not exist"

```bash
# Tạo database
psql -U postgres -c "CREATE DATABASE healthcare_db;"
```

### Lỗi: "FATAL: password authentication failed"

```bash
# Cập nhật .env với password đúng
echo "PG_PASSWORD=your_password" >> backend/.env
```

### Lỗi: "permission denied for schema public"

```bash
# Grant quyền
psql -U postgres -d healthcare_db -c "GRANT ALL ON SCHEMA public TO postgres;"
```

### Migration Chạy Nhưng Vẫn Thiếu Bảng

```bash
# Kiểm tra lỗi trong migration
psql -U postgres -d healthcare_db -f src/migrations/000_clean_migration.sql 2>&1 | grep -i error

# Chạy lại với verbose
psql -U postgres -d healthcare_db -f src/migrations/000_clean_migration.sql -a -e
```

---

## 📝 TÓM TẮT

### Bạn Cần Làm Gì:

```bash
# 1. Vào thư mục backend
cd /home/user/healthcare2/backend

# 2. Chạy recovery script
./scripts/recover-database.sh

# 3. Restart server
npm run dev

# 4. Refresh browser và login
# Username: admin
# Password: admin123
```

### Sau Khi Khôi Phục:

- ✅ 16 bảng đã được tạo
- ✅ 10 departments mặc định
- ✅ 10 positions mặc định
- ✅ 5 accounts login mặc định
- ✅ Tất cả API hoạt động
- ✅ Frontend không còn crash

---

## 🎯 NEXT STEPS

Sau khi database hoạt động:

1. **Apply Performance Optimization:**
   ```bash
   ./scripts/optimize-database.sh
   ```

2. **Test All Features:**
   - Tạo bệnh nhân mới
   - Tạo appointment
   - Thêm xét nghiệm
   - Quản lý quỹ

3. **Backup Định Kỳ:**
   ```bash
   # Tạo cron job backup hàng ngày
   0 3 * * * pg_dump -U postgres healthcare_db > /backups/healthcare_$(date +\%Y\%m\%d).sql
   ```

---

**Created:** 2025-11-19
**Status:** Ready to Execute
**Estimated Time:** 2-5 minutes
