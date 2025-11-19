# Backend Code Fix - Foreign Key Constraint Error

## Vấn Đề Đã Sửa

### Lỗi Gốc:
```
❌ Error ensuring default admin: insert or update on table "infor_employee"
violates foreign key constraint "fk_employee_department"
```

### Nguyên Nhân:
File `backend/src/server.js` có code hardcoded `department_id = 1` với comment "giả sử đã có phòng ban IT":

```javascript
const department_id = 1; // giả sử đã có phòng ban IT
```

Nhưng migration tạo 10 phòng ban và KHÔNG có "Phòng IT" nào:
1. Khoa Nội
2. Khoa Ngoại
3. ...
8. Phòng Hành chính
9. Phòng Kế toán
10. Tiếp tân

**Kết quả**: `department_id = 1` tồn tại (Khoa Nội), NHƯNG nếu migration chưa chạy hoặc chạy sai thứ tự, hoặc nếu có conflicts, ID có thể không tồn tại → Foreign key error!

---

## Giải Pháp

### 1. Sửa `server.js` - Query Department ID Thay Vì Hardcode

**Trước** (❌ Hardcoded):
```javascript
const department_id = 1; // giả sử đã có phòng ban IT
```

**Sau** (✅ Query từ database):
```javascript
// Lấy department_id hợp lệ từ database (Phòng Hành chính)
const deptResult = await pool.query(
  `SELECT department_id FROM list_department WHERE department_name = 'Phòng Hành chính' LIMIT 1`
);

const department_id = deptResult.rows.length > 0 ? deptResult.rows[0].department_id : null;
```

**Lợi ích**:
- ✅ Không phụ thuộc vào hardcoded ID
- ✅ Tự động lấy ID đúng từ database
- ✅ Nếu không tìm thấy department, cho phép NULL (constraint cho phép)
- ✅ Thêm error logging chi tiết hơn

### 2. Cập Nhật Migration - Thêm Comments Về IDs

Thêm comments vào `000_clean_migration.sql`:

```sql
-- IMPORTANT: Department IDs will be auto-generated (1-10)
-- Backend code should query department_id by name, NOT hardcode IDs!
-- Example: SELECT department_id FROM list_department WHERE department_name = 'Phòng Hành chính'
INSERT INTO list_department (department_name, description) VALUES
  ('Khoa Nội', 'Khám và điều trị các bệnh lý nội khoa'),     -- ID: 1
  ('Khoa Ngoại', 'Phẫu thuật và điều trị ngoại khoa'),        -- ID: 2
  ...
  ('Phòng Hành chính', 'Quản lý hành chính và nhân sự'),     -- ID: 8 (Used for default admin)
  ('Phòng Kế toán', 'Quản lý tài chính'),                    -- ID: 9
  ('Tiếp tân', 'Tiếp nhận bệnh nhân và hướng dẫn')           -- ID: 10
```

---

## Testing

### Test 1: Chạy Migration
```bash
psql -U postgres -d healthcare_db -f backend/src/migrations/000_clean_migration.sql
```

Expected:
```
Departments: 10
Positions: 10
Accounts: 5
```

### Test 2: Start Backend
```bash
cd backend
npm run dev
```

Expected output:
```
✅ Default admin created successfully. Employee ID: 0000000001, Department: 8
```

hoặc nếu đã tồn tại:
```
ℹ️ Default admin already exists.
```

### Test 3: Verify Database
```sql
-- Check admin employee
SELECT
  u.employee_id,
  u.full_name,
  e.department_id,
  d.department_name
FROM infor_users u
JOIN infor_employee e ON u.infor_users_id = e.infor_users_id
LEFT JOIN list_department d ON e.department_id = d.department_id
WHERE u.employee_id = '0000000001';

-- Should return:
-- employee_id | full_name    | department_id | department_name
-- ------------|--------------|---------------|------------------
-- 0000000001  | Admin System | 8             | Phòng Hành chính
```

---

## Best Practices

### ❌ NEVER Do This:
```javascript
// Hardcoded IDs - Bad!
const department_id = 1;
const position_id = 5;
```

### ✅ ALWAYS Do This:
```javascript
// Query by name - Good!
const deptResult = await pool.query(
  `SELECT department_id FROM list_department WHERE department_name = $1`,
  ['Phòng Hành chính']
);
const department_id = deptResult.rows[0]?.department_id || null;
```

### Why?
1. **Auto-increment IDs can change** between environments
2. **Migration order matters** - IDs might be different
3. **Database resets** - IDs might change
4. **Flexibility** - Easy to change department names without code changes

---

## Files Changed

1. **backend/src/server.js**
   - Fixed `ensureDefaultAdmin()` function
   - Query department_id instead of hardcoding
   - Better error logging

2. **backend/src/migrations/000_clean_migration.sql**
   - Added comments for department IDs
   - Added comments for position IDs
   - Clear warning about NOT hardcoding IDs

---

## Future Prevention

To prevent this issue in the future:

1. **Code Review**: Check for hardcoded IDs (department_id, position_id, etc.)
2. **Linting**: Add ESLint rule to detect hardcoded FK values
3. **Documentation**: Always document that IDs should be queried, not hardcoded
4. **Testing**: Test with fresh database to catch missing FK references

---

## Related Issues Fixed

This fix also resolves:
- ❌ "foreign key constraint violation" errors
- ❌ "Error ensuring default admin" on server start
- ❌ Dependency on hardcoded department/position IDs
- ✅ More robust default admin creation
- ✅ Better error messages for debugging
