# Healthcare Management System - REST API Documentation

## Tổng quan

Backend API cho Hệ thống Quản lý Bệnh viện với Swagger UI documentation hoàn chỉnh.

## Cách sử dụng

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Chạy server

```bash
npm start
```

Server sẽ chạy tại: `http://localhost:5001`

### 3. Truy cập Swagger UI Documentation

Mở trình duyệt và truy cập:

```
http://localhost:5001/api-docs
```

Tại đây bạn có thể:
- Xem tất cả API endpoints
- Test các API trực tiếp trong trình duyệt
- Xem request/response schema
- Xem các ví dụ về cách sử dụng

## API Endpoints

### 1. Laboratory Management (Quản lý Xét nghiệm)
- `GET /api/laboratory` - Lấy danh sách xét nghiệm
- `GET /api/laboratory/:id` - Lấy chi tiết xét nghiệm
- `POST /api/laboratory` - Tạo phiếu xét nghiệm mới
- `PUT /api/laboratory/:id` - Cập nhật xét nghiệm
- `DELETE /api/laboratory/:id` - Xóa xét nghiệm
- `GET /api/laboratory/statistics/summary` - Thống kê xét nghiệm

### 2. Fund Management (Quản lý Quỹ)
- `GET /api/fund` - Lấy danh sách giao dịch
- `GET /api/fund/:id` - Lấy chi tiết giao dịch
- `POST /api/fund` - Tạo giao dịch mới
- `PUT /api/fund/:id` - Cập nhật giao dịch
- `DELETE /api/fund/:id` - Xóa giao dịch
- `GET /api/fund/statistics/summary` - Thống kê quỹ (thu/chi/số dư)

### 3. Medical Revenue (Doanh thu Khám chữa bệnh)
- `GET /api/revenue` - Lấy danh sách doanh thu
- `GET /api/revenue/:id` - Lấy chi tiết doanh thu
- `POST /api/revenue` - Tạo bản ghi doanh thu
- `PUT /api/revenue/:id` - Cập nhật doanh thu
- `DELETE /api/revenue/:id` - Xóa bản ghi
- `GET /api/revenue/statistics/summary` - Thống kê doanh thu

### 4. Insurance Management (Quản lý Bảo hiểm)
- `GET /api/insurance` - Lấy danh sách hồ sơ bảo hiểm
- `GET /api/insurance/:id` - Lấy chi tiết hồ sơ
- `POST /api/insurance` - Tạo hồ sơ bảo hiểm mới
- `PUT /api/insurance/:id` - Cập nhật hồ sơ
- `DELETE /api/insurance/:id` - Xóa hồ sơ
- `GET /api/insurance/statistics/summary` - Thống kê bảo hiểm

### 5. Operating Expenses (Chi phí Hoạt động)
- `GET /api/expense` - Lấy danh sách chi phí
- `GET /api/expense/:id` - Lấy chi tiết chi phí
- `POST /api/expense` - Tạo chi phí mới
- `PUT /api/expense/:id` - Cập nhật chi phí
- `DELETE /api/expense/:id` - Xóa chi phí
- `GET /api/expense/statistics/summary` - Thống kê chi phí

### 6. Patient Management (Quản lý Bệnh nhân)
- `GET /api/patient` - Lấy danh sách bệnh nhân
- `GET /api/patient/:id` - Lấy thông tin bệnh nhân
- `POST /api/patient` - Tạo bệnh nhân mới
- `PUT /api/patient/:id` - Cập nhật thông tin
- `DELETE /api/patient/:id` - Xóa bệnh nhân
- `GET /api/patient/search/:query` - Tìm kiếm bệnh nhân

### 7. Work Schedule (Lịch làm việc)
- `GET /api/schedule` - Lấy danh sách lịch làm việc
- `GET /api/schedule/:id` - Lấy chi tiết lịch
- `POST /api/schedule` - Tạo lịch mới
- `PUT /api/schedule/:id` - Cập nhật lịch
- `DELETE /api/schedule/:id` - Xóa lịch
- `GET /api/schedule/employee/:employeeId` - Lấy lịch theo nhân viên

### 8. Account Management (Quản lý Tài khoản)
- `GET /api/account` - Lấy danh sách tài khoản
- `GET /api/account/:id` - Lấy thông tin tài khoản
- `POST /api/account` - Tạo tài khoản mới
- `PUT /api/account/:id` - Cập nhật tài khoản
- `DELETE /api/account/:id` - Xóa tài khoản
- `POST /api/account/login` - Đăng nhập

## Response Format

Tất cả API đều trả về JSON theo format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // Optional, for list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## Ví dụ sử dụng

### 1. Lấy danh sách xét nghiệm
```bash
curl http://localhost:5001/api/laboratory
```

### 2. Tạo giao dịch quỹ mới
```bash
curl -X POST http://localhost:5001/api/fund \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN003",
    "date": "2024-11-15",
    "type": "Thu",
    "category": "Xét nghiệm",
    "amount": 5000000,
    "description": "Thu phí xét nghiệm",
    "createdBy": "Kế toán A"
  }'
```

### 3. Lấy thống kê doanh thu
```bash
curl http://localhost:5001/api/revenue/statistics/summary
```

### 4. Đăng nhập
```bash
curl -X POST http://localhost:5001/api/account/login \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "admin",
    "password": "admin123"
  }'
```

## Lưu ý

1. **In-memory Storage**: Tất cả data được lưu trong bộ nhớ (in-memory), khi restart server data sẽ reset về mặc định.
2. **CORS**: API chấp nhận request từ `http://localhost:5173` (frontend).
3. **No Authentication**: API hiện tại không có authentication middleware (chỉ demo).
4. **Swagger UI**: Sử dụng Swagger UI để test API dễ dàng hơn.

## Demo cho Giáo viên

1. Start server: `npm start`
2. Mở trình duyệt: `http://localhost:5001/api-docs`
3. Thử các API endpoints trực tiếp trong Swagger UI
4. Xem response data và schema

## Technology Stack

- **Express.js 5.1.0** - Web framework
- **Swagger UI Express** - API documentation UI
- **Swagger JSDoc** - Generate OpenAPI spec from JSDoc comments
- **CORS** - Cross-Origin Resource Sharing
- **ES6 Modules** - Modern JavaScript

## API Tags

Tất cả endpoints được nhóm theo các tags sau trong Swagger UI:

- 🔬 **Laboratory** - Quản lý xét nghiệm
- 💰 **Fund** - Quản lý quỹ
- 💵 **Revenue** - Doanh thu khám chữa bệnh
- 🏥 **Insurance** - Thanh toán bảo hiểm
- 💸 **Expense** - Chi phí hoạt động
- 👤 **Patient** - Quản lý bệnh nhân
- 📅 **Schedule** - Lịch làm việc
- 🔐 **Account** - Quản lý tài khoản
