# Database Schema V2 - Quick Migration Guide

**Target Audience**: Developers updating code for v2 schema compatibility

---

## 🎯 Quick Reference: Find & Replace

### SQL Queries

```sql
-- Table Names
infor_users → users
infor_employee → employees
user_medical_info → user_medical_infos
list_department → departments
list_position → positions

-- Column Names
infor_users_id → user_id
role_user → role
status_employee → employment_status
started_date → start_date
business → business_description
attached → attached_documents

-- Financial Tables
expenses.date → expenses.expense_date
funds.date → funds.transaction_date
funds.type → funds.transaction_type
revenue.date → revenue.revenue_date
revenue.month → revenue.month_year (format: YYYY-MM)
```

### JOIN Patterns

#### Before (V1):
```sql
SELECT p.*, u.full_name
FROM patients p
LEFT JOIN infor_users u ON p.infor_users_id = u.infor_users_id
```

#### After (V2):
```sql
SELECT p.*, u.full_name
FROM patients p
LEFT JOIN users u ON p.user_id = u.user_id
```

---

## 🔍 Pattern Matching for Controllers

### 1. Laboratory Tests / Test Results / Insurance

**REMOVE THESE FIELDS from INSERT/UPDATE**:
- `patient_code`
- `patient_name`

**KEEP ONLY**:
- `patient_id` (foreign key to `patients` table)

**Example Change**:
```javascript
// ❌ OLD - Don't do this anymore
const { patient_id, patient_code, patient_name, test_type } = req.body;
await pool.query(
  'INSERT INTO laboratory_tests (patient_id, patient_code, patient_name, test_type) VALUES ($1, $2, $3, $4)',
  [patient_id, patient_code, patient_name, test_type]
);

// ✅ NEW - Do this instead
const { patient_id, test_type } = req.body;
await pool.query(
  'INSERT INTO laboratory_tests (patient_id, test_type) VALUES ($1, $2)',
  [patient_id, test_type]
);

// To get patient info, use JOIN:
const result = await pool.query(`
  SELECT
    lt.*,
    p.patient_code,
    u.full_name as patient_name,
    u.phone_number
  FROM laboratory_tests lt
  JOIN patients p ON lt.patient_id = p.patient_id
  LEFT JOIN users u ON p.user_id = u.user_id
  WHERE lt.lab_test_id = $1
`, [lab_test_id]);
```

### 2. Financial Controllers

#### Expenses
```javascript
// ❌ OLD
const { date, category, amount } = req.body;
await pool.query(
  'INSERT INTO expenses (date, category, amount) VALUES ($1, $2, $3)',
  [date, category, amount]
);

// ✅ NEW
const { expense_date, category, amount } = req.body;
await pool.query(
  'INSERT INTO expenses (expense_date, category, amount) VALUES ($1, $2, $3)',
  [expense_date, category, amount]
);
```

#### Funds
```javascript
// ❌ OLD
const { date, type, category, amount } = req.body;
await pool.query(
  'INSERT INTO funds (date, type, category, amount) VALUES ($1, $2, $3, $4)',
  [date, type, category, amount]
);

// ✅ NEW
const { transaction_date, transaction_type, category, amount } = req.body;
await pool.query(
  'INSERT INTO funds (transaction_date, transaction_type, category, amount) VALUES ($1, $2, $3, $4)',
  [transaction_date, transaction_type, category, amount]
);
```

#### Revenue
```javascript
// ❌ OLD
const { date, category, revenue_amount, month } = req.body;
await pool.query(
  'INSERT INTO revenue (date, category, revenue_amount, month) VALUES ($1, $2, $3, $4)',
  [date, category, revenue_amount, month]
);

// ✅ NEW
const { revenue_date, category, revenue_amount, month_year } = req.body;
// Ensure month_year is in YYYY-MM format
const formattedMonth = month_year || new Date(revenue_date).toISOString().slice(0, 7);
await pool.query(
  'INSERT INTO revenue (revenue_date, category, revenue_amount, month_year) VALUES ($1, $2, $3, $4)',
  [revenue_date, category, revenue_amount, formattedMonth]
);
```

---

## 📝 Frontend Updates

### Service Files

#### Pattern 1: Remove Duplicate Fields
```javascript
// ❌ OLD
const addLabTest = async (data) => {
  return api.post('/laboratory-tests', {
    patient_id: data.patient_id,
    patient_code: data.patient_code,
    patient_name: data.patient_name,
    test_type: data.test_type
  });
};

// ✅ NEW
const addLabTest = async (data) => {
  return api.post('/laboratory-tests', {
    patient_id: data.patient_id,  // Only patient_id needed
    test_type: data.test_type
  });
};
```

#### Pattern 2: Update Date Fields
```javascript
// ❌ OLD
const addExpense = async (data) => {
  return api.post('/expenses-new', {
    date: data.date,
    category: data.category,
    amount: data.amount
  });
};

// ✅ NEW
const addExpense = async (data) => {
  return api.post('/expenses-new', {
    expense_date: data.date,  // Renamed field
    category: data.category,
    amount: data.amount
  });
};
```

### Form Components

#### Pattern 1: Remove Patient Name/Code Inputs
```jsx
{/* ❌ OLD - Don't collect patient_code and patient_name */}
<input name="patient_code" placeholder="Mã bệnh nhân" />
<input name="patient_name" placeholder="Tên bệnh nhân" />

{/* ✅ NEW - Use patient selector instead */}
<select name="patient_id" onChange={handlePatientSelect}>
  {patients.map(p => (
    <option key={p.patient_id} value={p.patient_id}>
      {p.patient_code} - {p.full_name}
    </option>
  ))}
</select>
```

#### Pattern 2: Update Date Field Names
```jsx
{/* ❌ OLD */}
<input type="date" name="date" />

{/* ✅ NEW */}
<input type="date" name="expense_date" />  {/* for expenses */}
<input type="date" name="transaction_date" />  {/* for funds */}
<input type="date" name="revenue_date" />  {/* for revenue */}
```

---

## ✅ Validation Updates

### Phone Number
```javascript
// V2 Schema: ^0[0-9]{9}$ (10 digits, starts with 0)
const phoneRegex = /^0[0-9]{9}$/;
if (!phoneRegex.test(phone_number)) {
  return res.status(400).json({ message: 'Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0' });
}
```

### Card ID (CCCD)
```javascript
// V2 Schema: ^[0-9]{12}$ (12 digits)
const cardIdRegex = /^[0-9]{12}$/;
if (!cardIdRegex.test(card_id)) {
  return res.status(400).json({ message: 'Số CCCD phải gồm đúng 12 chữ số' });
}
```

### Employee ID
```javascript
// V2 Schema: ^[0-9]{10}$ (10 digits, for employees only)
const employeeIdRegex = /^[0-9]{10}$/;
if (employee_id && !employeeIdRegex.test(employee_id)) {
  return res.status(400).json({ message: 'Mã nhân viên phải gồm đúng 10 chữ số' });
}
```

### Status Enums

```javascript
// Patient Status
const validPatientStatus = ['active', 'discharged', 'transferred', 'deceased', 'cancelled'];

// Appointment Status
const validAppointmentStatus = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'];

// Expense Status
const validExpenseStatus = ['pending', 'approved', 'rejected', 'paid'];

// Lab Test Status
const validLabStatus = ['pending', 'in_progress', 'completed', 'verified', 'cancelled'];

// Transaction Type (Funds)
const validTransactionType = ['income', 'expense'];

// Gender
const validGender = ['Nam', 'Nữ', 'Khác'];

// Role
const validRole = ['patient', 'employee', 'administrator', 'doctor', 'nurse', 'receptionist', 'accountant', 'technician'];
```

---

## 🔄 Common Refactoring Tasks

### Task 1: Update Lab Test Controller

**Files to modify**:
- `backend/src/controllers/laboratoryTestsController.js`

**Changes**:
1. Remove `patient_code`, `patient_name` from create/update functions
2. Add JOIN queries to get patient info
3. Update search queries to JOIN with patients + users tables

**Search for**:
```javascript
patient_code
patient_name
```

**Replace with JOIN**:
```javascript
// Add to all SELECT queries:
JOIN patients p ON lt.patient_id = p.patient_id
LEFT JOIN users u ON p.user_id = u.user_id
```

### Task 2: Update Financial Controllers

**Files to modify**:
- `backend/src/controllers/expensesController.js`
- `backend/src/controllers/fundsController.js`
- `backend/src/controllers/revenueController.js`

**Search for**:
```javascript
// In expensesController:
date → expense_date

// In fundsController:
date → transaction_date
type → transaction_type

// In revenueController:
date → revenue_date
month → month_year
```

### Task 3: Update Frontend Services

**Files to modify**:
- `fontend/src/services/LaboratoryService.js`
- `fontend/src/services/TestResultService.js`
- `fontend/src/services/InsuranceService.js`
- `fontend/src/services/ExpenseService.js`
- `fontend/src/services/FundService.js`
- `fontend/src/services/RevenueService.js`

**Pattern to follow**:
```javascript
// For lab services: Remove patient_code, patient_name from POST/PUT
// For financial services: Update date field names in POST/PUT
```

---

## 🧪 Testing Checklist

After making changes, test these scenarios:

### Lab Tests
- [ ] Create lab test with only `patient_id`
- [ ] Retrieve lab test and verify patient info is JOINed correctly
- [ ] Search lab tests by patient name (should work via JOIN)

### Financial Operations
- [ ] Create expense with `expense_date`
- [ ] Create fund transaction with `transaction_date` and `transaction_type`
- [ ] Create revenue with `revenue_date` and `month_year`
- [ ] Filter financial data by date ranges

### Patients
- [ ] Register patient (creates record in `users` table with role='patient')
- [ ] Create patient record (creates record in `patients` table)
- [ ] Link patient record to user via `user_id`
- [ ] Retrieve patient with JOINed user data

---

## 📞 Quick Help

### Issue: "Column does not exist"
**Cause**: Using old column name
**Fix**: Check the Quick Reference section above

### Issue: "Foreign key violation"
**Cause**: Trying to use `infor_users_id` instead of `user_id`
**Fix**: Update to `user_id`

### Issue: "Null value in column violates not-null constraint"
**Cause**: Missing required field in v2
**Fix**: Check schema for `NOT NULL` columns

### Issue: "Invalid input syntax for type json"
**Cause**: JSONB field expects JSON object, not string
**Fix**: Use `'{}'` or valid JSON object

---

## 📚 Additional Resources

- **Full Schema**: `backend/database_schema_v2_optimized.sql`
- **Migration Script**: `backend/scripts/migrate-to-v2.js`
- **Detailed Summary**: `SYNCHRONIZATION_SUMMARY.md`
- **Recovery Script**: `backend/RECOVERY_FOR_PGADMIN.sql` (outdated - needs update for v2)

---

**Last Updated**: 2025-11-24
**Version**: 2.0
