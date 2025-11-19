# Migration Guide: localStorage to PostgreSQL

## Tổng quan (Overview)

Dự án đã được migrate từ sử dụng localStorage (client-side storage) sang PostgreSQL database (server-side storage) để cải thiện:
- ✅ Bảo mật dữ liệu
- ✅ Tính nhất quán dữ liệu
- ✅ Khả năng mở rộng
- ✅ Hiệu suất
- ✅ Quản lý dữ liệu tập trung

---

## Các thay đổi chính (Major Changes)

### 1. Database Schema

Đã tạo 7 bảng mới trong PostgreSQL:

| Bảng | Mô tả | Migration File |
|------|-------|----------------|
| `patients` | Thông tin bệnh nhân chi tiết | 007_create_remaining_tables.sql |
| `expenses` | Chi phí hoạt động | 007_create_remaining_tables.sql |
| `funds` | Quỹ tài chính (thu/chi) | 007_create_remaining_tables.sql |
| `insurance_claims` | Thanh toán bảo hiểm | 007_create_remaining_tables.sql |
| `revenue` | Doanh thu | 007_create_remaining_tables.sql |
| `laboratory_tests` | Xét nghiệm tại phòng lab | 007_create_remaining_tables.sql |
| `test_results` | Kết quả xét nghiệm | 007_create_remaining_tables.sql |

### 2. Backend API

Đã tạo controllers và routes mới:

#### Controllers (backend/src/controllers/)
- `patientsController.js` - Quản lý bệnh nhân
- `expensesController.js` - Quản lý chi phí
- `fundsController.js` - Quản lý quỹ
- `insuranceController.js` - Quản lý bảo hiểm
- `revenueController.js` - Quản lý doanh thu
- `laboratoryTestsController.js` - Quản lý xét nghiệm
- `testResultsController.js` - Quản lý kết quả xét nghiệm

#### Routes (backend/src/routes/)
- `/api/patients-new` - API quản lý bệnh nhân
- `/api/expenses-new` - API quản lý chi phí
- `/api/funds-new` - API quản lý quỹ
- `/api/insurance-new` - API quản lý bảo hiểm
- `/api/revenue-new` - API quản lý doanh thu
- `/api/laboratory-tests` - API quản lý xét nghiệm
- `/api/test-results-new` - API quản lý kết quả xét nghiệm

---

## Hướng dẫn cài đặt (Setup Instructions)

### Bước 1: Cài đặt PostgreSQL

**Trên Windows:**
```bash
# Download và cài đặt từ: https://www.postgresql.org/download/windows/
# Hoặc sử dụng Docker:
docker run --name healthcare-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres
```

**Trên macOS:**
```bash
# Sử dụng Homebrew:
brew install postgresql@15
brew services start postgresql@15

# Hoặc sử dụng Docker:
docker run --name healthcare-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres
```

**Trên Linux:**
```bash
# Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib

# Hoặc sử dụng Docker:
docker run --name healthcare-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres
```

### Bước 2: Tạo Database

```bash
# Kết nối PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE healthcare_db;

# Thoát
\q
```

### Bước 3: Cấu hình Backend

1. **Tạo file .env** trong thư mục `backend/`:
```bash
cd backend
cp .env.example .env
```

2. **Chỉnh sửa file .env**:
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# PostgreSQL Database Configuration
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=healthcare_db
PG_PASSWORD=yourpassword  # Thay đổi password của bạn
PG_PORT=5432

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Admin Default Password
ADMIN_PASSWORD=Admin@123

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Bước 4: Chạy Migrations

```bash
cd backend

# Chạy migration tạo schema
node scripts/run-migration.js 001_init_schema.sql
node scripts/run-migration.js 002_insert_sample_data.sql
node scripts/run-migration.js 003_user_profile_tables.sql
node scripts/run-migration.js 004_appointments_table.sql
node scripts/run-migration.js 005_lab_results_table.sql
node scripts/run-migration.js 006_add_employee_fields.sql
node scripts/run-migration.js 007_create_remaining_tables.sql
node scripts/run-migration.js 008_insert_comprehensive_sample_data.sql
```

### Bước 5: Cài đặt Dependencies và Chạy Backend

```bash
cd backend
npm install
npm start
```

Server sẽ chạy tại: http://localhost:5001

---

## API Endpoints

### Patients API (Bệnh nhân)
```
GET    /api/patients-new              - Lấy tất cả bệnh nhân
GET    /api/patients-new/:id          - Lấy bệnh nhân theo ID
GET    /api/patients-new/code/:code   - Lấy bệnh nhân theo mã
POST   /api/patients-new              - Tạo bệnh nhân mới
PUT    /api/patients-new/:id          - Cập nhật bệnh nhân
DELETE /api/patients-new/:id          - Xóa bệnh nhân
GET    /api/patients-new/search?query=xxx - Tìm kiếm bệnh nhân
GET    /api/patients-new/status/:status - Lấy bệnh nhân theo trạng thái
GET    /api/patients-new/doctor/:name - Lấy bệnh nhân theo bác sĩ
```

### Expenses API (Chi phí)
```
GET    /api/expenses-new              - Lấy tất cả chi phí
GET    /api/expenses-new/:id          - Lấy chi phí theo ID
POST   /api/expenses-new              - Tạo chi phí mới
PUT    /api/expenses-new/:id          - Cập nhật chi phí
DELETE /api/expenses-new/:id          - Xóa chi phí
GET    /api/expenses-new/statistics   - Lấy thống kê chi phí
```

### Funds API (Quỹ tài chính)
```
GET    /api/funds-new                 - Lấy tất cả giao dịch
GET    /api/funds-new/:id             - Lấy giao dịch theo ID
POST   /api/funds-new                 - Tạo giao dịch mới
PUT    /api/funds-new/:id             - Cập nhật giao dịch
DELETE /api/funds-new/:id             - Xóa giao dịch
GET    /api/funds-new/statistics      - Lấy thống kê quỹ
```

### Insurance API (Bảo hiểm)
```
GET    /api/insurance-new             - Lấy tất cả hồ sơ bảo hiểm
GET    /api/insurance-new/:id         - Lấy hồ sơ theo ID
POST   /api/insurance-new             - Tạo hồ sơ mới
PUT    /api/insurance-new/:id         - Cập nhật hồ sơ
DELETE /api/insurance-new/:id         - Xóa hồ sơ
GET    /api/insurance-new/statistics  - Lấy thống kê bảo hiểm
```

### Revenue API (Doanh thu)
```
GET    /api/revenue-new               - Lấy tất cả doanh thu
GET    /api/revenue-new/:id           - Lấy doanh thu theo ID
GET    /api/revenue-new/month/:month  - Lấy doanh thu theo tháng
POST   /api/revenue-new               - Tạo doanh thu mới
PUT    /api/revenue-new/:id           - Cập nhật doanh thu
DELETE /api/revenue-new/:id           - Xóa doanh thu
GET    /api/revenue-new/statistics    - Lấy thống kê doanh thu
GET    /api/revenue-new/monthly-comparison?months=6 - So sánh theo tháng
```

### Laboratory Tests API (Xét nghiệm)
```
GET    /api/laboratory-tests          - Lấy tất cả xét nghiệm
GET    /api/laboratory-tests/:id      - Lấy xét nghiệm theo ID
GET    /api/laboratory-tests/code/:code - Lấy xét nghiệm theo mã
POST   /api/laboratory-tests          - Tạo xét nghiệm mới
PUT    /api/laboratory-tests/:id      - Cập nhật xét nghiệm
DELETE /api/laboratory-tests/:id      - Xóa xét nghiệm
GET    /api/laboratory-tests/search?query=xxx - Tìm kiếm xét nghiệm
GET    /api/laboratory-tests/status/:status - Lấy xét nghiệm theo trạng thái
GET    /api/laboratory-tests/statistics - Lấy thống kê xét nghiệm
```

### Test Results API (Kết quả xét nghiệm)
```
GET    /api/test-results-new          - Lấy tất cả kết quả
GET    /api/test-results-new/:id      - Lấy kết quả theo ID
GET    /api/test-results-new/code/:code - Lấy kết quả theo mã
POST   /api/test-results-new          - Tạo kết quả mới
PUT    /api/test-results-new/:id      - Cập nhật kết quả
DELETE /api/test-results-new/:id      - Xóa kết quả
GET    /api/test-results-new/search?query=xxx - Tìm kiếm kết quả
GET    /api/test-results-new/status/:status - Lấy kết quả theo trạng thái
GET    /api/test-results-new/patient/:patientId - Lấy kết quả theo bệnh nhân
GET    /api/test-results-new/doctor/:doctorName - Lấy kết quả theo bác sĩ
```

---

## Cập nhật Frontend (TODO)

### Cần thay thế các Service files:

1. **PatientService.js** → Sử dụng `/api/patients-new`
2. **ExpenseService.js** → Sử dụng `/api/expenses-new`
3. **FundService.js** → Sử dụng `/api/funds-new`
4. **InsuranceService.js** → Sử dụng `/api/insurance-new`
5. **RevenueService.js** → Sử dụng `/api/revenue-new`
6. **LaboratoryService.js** → Sử dụng `/api/laboratory-tests`
7. **TestResultService.js** → Sử dụng `/api/test-results-new`
8. **AccountService.js** → Sử dụng `/api/account` (đã có sẵn)

### Authentication
- Cần implement JWT authentication thay vì localStorage tokens
- Login sẽ trả về JWT token
- Frontend lưu token trong memory hoặc HttpOnly cookie
- Gửi token trong Authorization header cho mỗi request

---

## Sample Data

Migrations đã tạo sample data cho:
- ✅ 12 bệnh nhân (patients)
- ✅ 10 nhân viên (employees)
- ✅ 10 chi phí (expenses)
- ✅ 15 giao dịch quỹ (funds)
- ✅ 4 hồ sơ bảo hiểm (insurance claims)
- ✅ 16 bản ghi doanh thu (revenue)
- ✅ 5 xét nghiệm (laboratory tests)
- ✅ 3 kết quả xét nghiệm (test results)

---

## Testing

### Test Backend APIs
```bash
# Sử dụng curl hoặc Postman

# Test get all patients
curl http://localhost:5001/api/patients-new

# Test get all expenses
curl http://localhost:5001/api/expenses-new

# Test statistics
curl http://localhost:5001/api/funds-new/statistics
```

### Swagger Documentation
Truy cập: http://localhost:5001/api-docs

---

## Troubleshooting

### Lỗi kết nối database
```bash
# Kiểm tra PostgreSQL đang chạy
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Kiểm tra connection string trong .env
```

### Lỗi migration
```bash
# Drop database và tạo lại
psql -U postgres -c "DROP DATABASE healthcare_db;"
psql -U postgres -c "CREATE DATABASE healthcare_db;"

# Chạy lại migrations
```

### Lỗi CORS
```bash
# Kiểm tra CORS_ORIGIN trong .env
# Đảm bảo frontend chạy tại đúng port (5173)
```

---

## Next Steps

1. ✅ Database schema created
2. ✅ Backend APIs created
3. ✅ Sample data generated
4. ⏳ Update frontend services to use APIs
5. ⏳ Implement JWT authentication
6. ⏳ Update login components
7. ⏳ Test all features
8. ⏳ Deploy to production

---

## Support

Nếu gặp vấn đề, kiểm tra:
1. PostgreSQL đang chạy
2. File .env được cấu hình đúng
3. Migrations đã chạy thành công
4. Backend server đang chạy
5. CORS được cấu hình đúng

---

## License

Copyright © 2024 HealthCare Management System
