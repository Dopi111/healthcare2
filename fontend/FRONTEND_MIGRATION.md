# Frontend Migration: localStorage → PostgreSQL API

## ✅ Hoàn thành

### 🔄 Service Files đã được thay thế

Tất cả các Service files đã được migrate từ localStorage sang API calls:

| File cũ (localStorage) | File mới (PostgreSQL API) | Status |
|------------------------|---------------------------|---------|
| `services/PatientService.js` | `services/PatientService.js` | ✅ Migrated |
| `services/ExpenseService.js` | `services/ExpenseService.js` | ✅ Migrated |
| `services/FundService.js` | `services/FundService.js` | ✅ Migrated |
| `services/InsuranceService.js` | `services/InsuranceService.js` | ✅ Migrated |
| `services/RevenueService.js` | `services/RevenueService.js` | ✅ Migrated |
| `services/LaboratoryService.js` | `services/LaboratoryService.js` | ✅ Migrated |
| `services/TestResultService.js` | `services/TestResultService.js` | ✅ Migrated |

### 📦 Dependencies

**Đã cài đặt:**
- `axios` - HTTP client cho API calls

### 🆕 Files mới

**`services/api.js`** - API Configuration
- Centralized axios instance
- Request/Response interceptors
- Auto token injection
- Error handling

## 📝 Cách sử dụng Services mới

### PatientService Example

```javascript
import PatientService from './services/PatientService';

// Lấy tất cả bệnh nhân
const patients = await PatientService.getAllPatients();

// Lấy bệnh nhân theo ID
const patient = await PatientService.getPatientById(1);

// Thêm bệnh nhân mới
const newPatient = await PatientService.addPatient({
  patient_code: 'BN001',
  infor_users_id: 1,
  doctor_in_charge: 'BS. Nguyễn Văn A',
  visit_date: '2024-11-20',
  diagnosis: 'Cảm cúm',
  status: 'Đang điều trị'
});

// Cập nhật bệnh nhân
const updated = await PatientService.updatePatient(1, {
  status: 'Hoàn thành'
});

// Xóa bệnh nhân
await PatientService.deletePatient(1);

// Tìm kiếm bệnh nhân
const results = await PatientService.searchPatients('Nguyễn');
```

### ExpenseService Example

```javascript
import ExpenseService from './services/ExpenseService';

// Lấy tất cả chi phí
const expenses = await ExpenseService.getAllExpenses();

// Thêm chi phí mới
const newExpense = await ExpenseService.addExpense({
  expense_code: 'CP001',
  date: '2024-11-20',
  category: 'Lương',
  amount: 50000000,
  description: 'Lương tháng 11',
  status: 'Chờ duyệt'
});

// Lấy thống kê chi phí
const stats = await ExpenseService.getStatistics();
```

### FundService Example

```javascript
import FundService from './services/FundService';

// Lấy tất cả giao dịch
const funds = await FundService.getAllFunds();

// Thêm giao dịch mới
const newFund = await FundService.addFund({
  transaction_code: 'TXN001',
  date: '2024-11-20',
  type: 'Thu',
  category: 'Khám bệnh',
  amount: 15000000,
  description: 'Thu phí khám bệnh'
});

// Lấy thống kê quỹ
const stats = await FundService.getStatistics();

// Lấy xu hướng theo tháng
const trend = await FundService.getMonthlyTrend(6);
```

## 🔧 Configuration

### Environment Variables

Tạo file `.env` trong thư mục `fontend/`:

```env
VITE_API_URL=http://localhost:5001/api
```

### API Client Configuration

File `services/api.js` đã được cấu hình với:
- Base URL: `http://localhost:5001/api` (hoặc từ env)
- Auto token injection từ localStorage
- Error handling tự động
- Redirect to login nếu 401 Unauthorized

## 🔐 Authentication

### Token Storage

Token được lưu trong localStorage với key `authToken`:

```javascript
// Sau khi login thành công
localStorage.setItem('authToken', response.data.token);

// Token tự động được gửi trong header của mỗi request:
// Authorization: Bearer <token>
```

### Logout

```javascript
// Clear token và redirect
localStorage.removeItem('authToken');
window.location.href = '/login';
```

## 📊 API Endpoints

Tất cả services gọi đến các endpoints sau:

### Patients
- `GET /patients-new` - Lấy tất cả
- `GET /patients-new/:id` - Lấy theo ID
- `GET /patients-new/code/:code` - Lấy theo mã
- `POST /patients-new` - Tạo mới
- `PUT /patients-new/:id` - Cập nhật
- `DELETE /patients-new/:id` - Xóa
- `GET /patients-new/search?query=xxx` - Tìm kiếm

### Expenses
- `GET /expenses-new` - Lấy tất cả
- `GET /expenses-new/statistics` - Thống kê
- `POST /expenses-new` - Tạo mới
- Etc...

### Funds
- `GET /funds-new` - Lấy tất cả
- `GET /funds-new/statistics` - Thống kê
- `POST /funds-new` - Tạo mới
- Etc...

### Insurance
- `GET /insurance-new` - Lấy tất cả
- `GET /insurance-new/statistics` - Thống kê
- Etc...

### Revenue
- `GET /revenue-new` - Lấy tất cả
- `GET /revenue-new/statistics` - Thống kê
- `GET /revenue-new/monthly-comparison` - So sánh tháng
- Etc...

### Laboratory Tests
- `GET /laboratory-tests` - Lấy tất cả
- `GET /laboratory-tests/statistics` - Thống kê
- `GET /laboratory-tests/search?query=xxx` - Tìm kiếm
- Etc...

### Test Results
- `GET /test-results-new` - Lấy tất cả
- `GET /test-results-new/search?query=xxx` - Tìm kiếm
- Etc...

## 🔄 Backward Compatibility

Các methods cũ vẫn có thể hoạt động:

```javascript
// Old method (localStorage)
PatientService.initializePatients(); // Now calls getAllPatients()

// Old method (localStorage)
PatientService.resetToDefault(); // Shows warning, returns []
```

## 🚨 Breaking Changes

### 1. Async/Await Required

Tất cả methods bây giờ là async và return Promise:

```javascript
// ❌ Cũ (synchronous)
const patients = PatientService.getAllPatients();

// ✅ Mới (asynchronous)
const patients = await PatientService.getAllPatients();
```

### 2. Error Handling

Cần wrap trong try-catch:

```javascript
try {
  const patients = await PatientService.getAllPatients();
  // Handle success
} catch (error) {
  // Handle error
  console.error('Error:', error);
}
```

### 3. Data Structure

Response data structure từ API:

```javascript
// API response structure
{
  success: true,
  count: 10,
  data: [...]  // Actual data array
}

// Service returns only data:
const patients = await PatientService.getAllPatients(); // Returns data array
```

## 📋 Migration Checklist

### ✅ Đã hoàn thành
- [x] Backup old Service files
- [x] Install axios
- [x] Create api.js config
- [x] Migrate PatientService.js
- [x] Migrate ExpenseService.js
- [x] Migrate FundService.js
- [x] Migrate InsuranceService.js
- [x] Migrate RevenueService.js
- [x] Migrate LaboratoryService.js
- [x] Migrate TestResultService.js

### 🔜 Cần làm tiếp
- [ ] Update all components using these services
- [ ] Add loading states in components
- [ ] Add error handling in components
- [ ] Implement JWT authentication
- [ ] Update login/logout flows
- [ ] Test all functionality
- [ ] Remove old localStorage data (optional)

## 🧪 Testing

### Manual Testing

1. Start backend server:
```bash
cd backend
npm start
```

2. Start frontend:
```bash
cd fontend
npm run dev
```

3. Test each module:
- Navigate to each page
- Try CRUD operations
- Check browser console for errors
- Verify data in PostgreSQL

### API Testing with curl

```bash
# Test patients API
curl http://localhost:5001/api/patients-new

# Test expenses API
curl http://localhost:5001/api/expenses-new

# Test funds API
curl http://localhost:5001/api/funds-new
```

## 📚 Documentation

- Backend API: See `/backend/MIGRATION_GUIDE.md`
- API Documentation: http://localhost:5001/api-docs (Swagger)

## 🐛 Troubleshooting

### CORS Error
```
Access to XMLHttpRequest at 'http://localhost:5001/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:** Đảm bảo backend có cấu hình CORS cho origin `http://localhost:5173`

### Network Error
```
Error: Network Error
```

**Solution:** Kiểm tra backend server đang chạy tại port 5001

### 401 Unauthorized
```
Error: Request failed with status code 401
```

**Solution:** Đảm bảo đã login và có token trong localStorage

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Backend server đang chạy
2. Database connection OK
3. CORS configured correctly
4. Token được lưu trong localStorage
5. API endpoints correct

---

**Last Updated:** 2024-11-19
**Migration Status:** ✅ Services Completed, 🔜 Components Pending
