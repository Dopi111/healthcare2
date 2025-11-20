# 🚀 Hướng Dẫn Khôi Phục Database Với pgAdmin 4

## ⚡ Cách Dùng (2 Phút)

### Bước 1: Mở pgAdmin 4
- Khởi động pgAdmin 4
- Kết nối tới PostgreSQL server của bạn

### Bước 2: Chọn Database
- Click vào **Servers** → **PostgreSQL**
- Chọn database **`healthcare_db`**
- Nếu chưa có, tạo mới:
  ```sql
  CREATE DATABASE healthcare_db;
  ```

### Bước 3: Mở Query Tool
- Click chuột phải vào database **`healthcare_db`**
- Chọn **Query Tool** (hoặc nhấn `F5`)

### Bước 4: Chạy File SQL
**Option A: Copy-Paste (Khuyến nghị)**
1. Mở file `RECOVERY_FOR_PGADMIN.sql` bằng text editor
2. Copy toàn bộ nội dung (Ctrl+A → Ctrl+C)
3. Paste vào Query Tool của pgAdmin (Ctrl+V)
4. Nhấn **Execute** (▶ icon) hoặc `F5`
5. Đợi 5-10 giây

**Option B: Open File**
1. Trong Query Tool, click **File** → **Open**
2. Chọn file `RECOVERY_FOR_PGADMIN.sql`
3. Nhấn **Execute** (▶ icon) hoặc `F5`

### Bước 5: Kiểm Tra Kết Quả

Bạn sẽ thấy các thông báo:
```
✅ Đã xóa các bảng cũ
🏗️ Đang tạo 16 bảng mới...
✅ Đã tạo 16 bảng thành công
📊 Đang thêm dữ liệu mẫu...
✅ Đã thêm dữ liệu mẫu
🔍 Đang tạo indexes...
✅ Đã tạo indexes

========================================
✅ KHÔI PHỤC DATABASE HOÀN TẤT!
========================================

📊 Thống kê:
  - Tổng số bảng: 16
  - Khoa: 10 bản ghi
  - Chức vụ: 10 bản ghi
  - Accounts: 5 bản ghi

🔐 Tài khoản đăng nhập mặc định:
  👤 Username: admin
  🔑 Password: admin123
```

### Bước 6: Verify Bảng

Trong pgAdmin, expand:
```
healthcare_db
  └── Schemas
      └── public
          └── Tables
```

Bạn phải thấy **16 tables:**
- ✅ accounts
- ✅ appointments
- ⭐ expenses
- ⭐ funds
- ✅ infor_auth_employee
- ✅ infor_employee
- ✅ infor_users
- ⭐ insurance_claims
- ✅ lab_results
- ⭐ laboratory_tests
- ✅ list_department
- ✅ list_position
- ⭐ patients
- ⭐ revenue
- ⭐ test_results
- ✅ user_medical_info

⭐ = Bảng quan trọng (trước đây bị thiếu)

---

## 🔐 Login Sau Khi Khôi Phục

Restart backend server:
```bash
cd backend
npm run dev
```

Login vào frontend với:
- **Username:** `admin`
- **Password:** `admin123`

---

## 📋 16 Bảng Đã Tạo

| # | Tên Bảng | Mô Tả |
|---|-----------|-------|
| 1 | `list_department` | Danh sách 10 khoa |
| 2 | `list_position` | Danh sách 10 chức vụ |
| 3 | `infor_users` | Users & Employees |
| 4 | `infor_employee` | Chi tiết nhân viên |
| 5 | `infor_auth_employee` | Auth legacy |
| 6 | `user_medical_info` | Thông tin y tế |
| 7 | `appointments` | Lịch hẹn |
| 8 | `lab_results` | Kết quả XN user |
| 9 | **`patients`** ⭐ | **Hồ sơ bệnh nhân** |
| 10 | **`expenses`** ⭐ | **Chi phí** |
| 11 | **`funds`** ⭐ | **Quỹ tài chính** |
| 12 | **`insurance_claims`** ⭐ | **Bảo hiểm** |
| 13 | **`revenue`** ⭐ | **Doanh thu** |
| 14 | **`laboratory_tests`** ⭐ | **Xét nghiệm** |
| 15 | **`test_results`** ⭐ | **Kết quả test** |
| 16 | `accounts` | Login accounts |

---

## ⚠️ Lưu Ý

### File SQL Sẽ XÓA DỮ LIỆU CŨ

Script bắt đầu với:
```sql
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
-- ... (xóa tất cả bảng)
```

**Nếu bạn có dữ liệu quan trọng:**
1. Backup trước khi chạy:
   - Click chuột phải vào `healthcare_db`
   - Chọn **Backup...**
   - Lưu file `.backup` hoặc `.sql`

2. Hoặc không chạy file này, dùng migration khác

### Passwords Mặc Định

File tạo 5 accounts với passwords:
- `admin` / `admin123`
- `doctor01` / `doctor123`
- `nurse01` / `nurse123`
- `reception01` / `reception123`
- `accountant01` / `accountant123`

**Đổi password ngay sau khi login!**

---

## 🐛 Troubleshooting

### Lỗi: "database does not exist"

**Giải pháp:**
1. Trong pgAdmin, click chuột phải vào **Databases**
2. Chọn **Create** → **Database...**
3. Tên database: `healthcare_db`
4. Owner: `postgres`
5. Click **Save**

### Lỗi: "permission denied"

**Giải pháp:**
```sql
-- Chạy trước khi execute recovery file
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON DATABASE healthcare_db TO postgres;
```

### Query Chạy Quá Lâu

**Bình thường!** Tạo 16 bảng + insert data + indexes mất 5-10 giây.

Nếu quá 30 giây:
- Check Messages tab (dưới Query Tool)
- Xem có error message không

### Không Thấy Thông Báo

**Messages Tab:**
- Dưới Query Tool có tab **Messages**
- Click vào đó để thấy tất cả thông báo `RAISE NOTICE`

---

## 📊 Verify Thành Công

### Check 1: Số Bảng

```sql
SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';
```

Kết quả phải: **16**

### Check 2: Dữ Liệu Mẫu

```sql
SELECT 'Departments' as table_name, COUNT(*) FROM list_department
UNION ALL
SELECT 'Positions', COUNT(*) FROM list_position
UNION ALL
SELECT 'Accounts', COUNT(*) FROM accounts;
```

Kết quả:
```
table_name   | count
-------------|------
Departments  | 10
Positions    | 10
Accounts     | 5
```

### Check 3: Tables List

```sql
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Phải thấy tất cả 16 bảng

---

## 🎯 Tóm Tắt

### Để Khôi Phục Database:

1. ✅ Mở pgAdmin 4
2. ✅ Chọn database `healthcare_db`
3. ✅ Mở Query Tool (F5)
4. ✅ Copy-paste file `RECOVERY_FOR_PGADMIN.sql`
5. ✅ Execute (F5)
6. ✅ Đợi 5-10 giây
7. ✅ Check Messages tab
8. ✅ Restart backend: `npm run dev`
9. ✅ Login: `admin` / `admin123`

### Kết Quả:
- ✅ 16 bảng được tạo
- ✅ 10 khoa + 10 chức vụ
- ✅ 5 accounts mặc định
- ✅ Tất cả indexes đã tạo
- ✅ API hoạt động bình thường
- ✅ Frontend không còn crash

---

**File:** `RECOVERY_FOR_PGADMIN.sql`
**Thời gian:** 2-5 phút
**Khó:** ⭐☆☆☆☆ (Rất dễ)
