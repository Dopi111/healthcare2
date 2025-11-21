# Code Migration: V1 Schema → V2 Schema

## ⚠️ CRITICAL: Required Code Changes

After running `database_schema_v2_optimized.sql`, ALL backend and frontend code must be updated to use new table/column names.

---

## 📋 Table Name Changes

| V1 Name | V2 Name | Files Affected |
|---------|---------|----------------|
| `accounts` | `users` | accountRoutes.js |
| `infor_users` | `users` | employeeControllers.js, userAuthRoutes.js, userProfileRoutes.js, patientsRoutes.js |
| `infor_employee` | `employees` | employeeControllers.js |
| `list_department` | `departments` | departmentRoutes.js |
| `list_position` | `positions` | positionRoutes.js |
| `user_medical_info` | `user_medical_infos` | userProfileRoutes.js |
| `user_medical_history` | `user_medical_histories` | userProfileRoutes.js |

---

## 📋 Column Name Changes

| Table | V1 Column | V2 Column |
|-------|-----------|-----------|
| `users` | `infor_users_id` | `user_id` |
| `users` | `phone` (from accounts) | `phone_number` |
| `users` | `name` (from accounts) | `full_name` |
| `users` | `role_user` | `role` |
| `employees` | `infor_employee_id` | `employee_id` |
| `employees` | `infor_users_id` | `user_id` |
| `employees` | `status_employee` | `employment_status` |
| `employees` | `started_date` | `start_date` |
| `employees` | `business` | `business_description` |
| `employees` | `attached` | `attached_documents` |
| `departments` | (no changes) | (same) |
| `positions` | (no changes) | (same) |

---

## 📋 Removed Columns (Get via JOIN)

| Table | Removed Columns | Get From |
|-------|----------------|----------|
| `insurance_claims` | `patient_code`, `patient_name` | JOIN `patients` → `users` |
| `laboratory_tests` | `patient_code`, `patient_name` | JOIN `patients` → `users` |
| `test_results` | `patient_code`, `patient_name` | JOIN `patients` → `users` |

---

## 🔧 Backend Files to Update

### 1. `/routes/accountRoutes.js`

**Changes:**
- `accounts` → `users`
- `employee_id` stays same
- `password` stays same
- `name` → `full_name`
- `phone` → `phone_number`
- `role` stays same (but note: accounts.role → users.role, NOT users.role_user)

**Example:**
```javascript
// OLD (V1)
const result = await pool.query(
  'SELECT id, employee_id, name, phone, email, role FROM accounts WHERE employee_id = $1 AND password = $2',
  [employeeId, password]
);

// NEW (V2)
const result = await pool.query(
  'SELECT user_id, employee_id, full_name, phone_number, email, role FROM users WHERE employee_id = $1 AND password = $2',
  [employeeId, password]
);
```

---

### 2. `/controllers/employeeControllers.js`

**Changes:**
- `infor_users` → `users`
- `infor_employee` → `employees`
- `infor_users_id` → `user_id`
- `infor_employee_id` → `employee_id`
- `role_user` → `role`
- `status_employee` → `employment_status`
- `list_position` → `positions`
- `list_department` → `departments`

**getEmployeeById:**
```javascript
// OLD (V1)
const q = `
  SELECT *
  FROM infor_employee e
  JOIN infor_users u ON e.infor_users_id = u.infor_users_id
  WHERE u.employee_id = $1
`;

// NEW (V2)
const q = `
  SELECT
    u.*,
    e.*,
    p.position_name,
    d.department_name
  FROM users u
  JOIN employees e ON e.user_id = u.user_id
  LEFT JOIN positions p ON e.position_id = p.position_id
  LEFT JOIN departments d ON e.department_id = d.department_id
  WHERE u.employee_id = $1
`;
```

**createEmployeeFull:**
```javascript
// OLD (V1)
const insertQuery = `
  INSERT INTO infor_users
    (employee_id, phone_number, card_id, password, full_name, ...)
  VALUES ($1, $2, $3, $4, $5, ..., 'employee')
  RETURNING infor_users_id, ...
`;

const insertEmployeeQuery = `
  INSERT INTO infor_employee
    (infor_users_id, position_id, department_id, status_employee)
  VALUES ($1, $2, $3, 'active')
`;

// NEW (V2)
const insertQuery = `
  INSERT INTO users
    (employee_id, phone_number, card_id, password, full_name, ..., role)
  VALUES ($1, $2, $3, $4, $5, ..., 'employee')
  RETURNING user_id, ...
`;

const insertEmployeeQuery = `
  INSERT INTO employees
    (user_id, position_id, department_id, employment_status)
  VALUES ($1, $2, $3, 'active')
`;
```

**getListEmployee:**
```javascript
// OLD (V1)
const q = `
  SELECT *
  FROM infor_users
  WHERE role_user = 'employee'
`;

// NEW (V2)
const q = `
  SELECT *
  FROM users
  WHERE role IN ('employee', 'administrator', 'doctor', 'nurse', 'receptionist', 'accountant', 'technician')
`;
```

---

### 3. `/routes/departmentRoutes.js`

**Changes:**
- `list_department` → `departments`

```javascript
// OLD (V1)
const result = await pool.query('SELECT * FROM list_department');

// NEW (V2)
const result = await pool.query('SELECT * FROM departments WHERE is_active = true');
```

---

### 4. `/routes/positionRoutes.js`

**Changes:**
- `list_position` → `positions`

```javascript
// OLD (V1)
const result = await pool.query('SELECT * FROM list_position');

// NEW (V2)
const result = await pool.query('SELECT * FROM positions WHERE is_active = true');
```

---

### 5. `/routes/userAuthRoutes.js`

**Changes:**
- `infor_users` → `users`
- `infor_users_id` → `user_id`
- `role_user` → `role`

```javascript
// OLD (V1) - Register
const result = await pool.query(
  `INSERT INTO infor_users (phone_number, card_id, password, full_name, role_user)
   VALUES ($1, $2, $3, $4, 'users')
   RETURNING infor_users_id, phone_number, full_name`,
  [phone_number, card_id, hashedPassword, full_name]
);

// NEW (V2) - Register
const result = await pool.query(
  `INSERT INTO users (phone_number, card_id, password, full_name, role)
   VALUES ($1, $2, $3, $4, 'patient')
   RETURNING user_id, phone_number, full_name`,
  [phone_number, card_id, hashedPassword, full_name]
);

// OLD (V1) - Login
const result = await pool.query(
  'SELECT * FROM infor_users WHERE phone_number = $1 AND role_user = $2',
  [phone_number, 'users']
);

// NEW (V2) - Login
const result = await pool.query(
  'SELECT * FROM users WHERE phone_number = $1 AND role = $2',
  [phone_number, 'patient']
);
```

---

### 6. `/routes/userProfileRoutes.js`

**Changes:**
- `infor_users` → `users`
- `infor_users_id` → `user_id`
- `user_medical_info` → `user_medical_infos`
- `user_medical_history` → `user_medical_histories`

```javascript
// OLD (V1)
const userResult = await pool.query(
  `SELECT * FROM infor_users WHERE infor_users_id = $1`,
  [user_id]
);

const medicalResult = await pool.query(
  `SELECT * FROM user_medical_info WHERE infor_users_id = $1`,
  [user_id]
);

// NEW (V2)
const userResult = await pool.query(
  `SELECT * FROM users WHERE user_id = $1`,
  [user_id]
);

const medicalResult = await pool.query(
  `SELECT * FROM user_medical_infos WHERE user_id = $1`,
  [user_id]
);
```

---

### 7. `/routes/patientsRoutes.js`

**Changes:**
- `infor_users` → `users`
- `infor_users_id` → `user_id`
- `role_user` → `role`

```javascript
// OLD (V1)
const result = await pool.query(
  `SELECT * FROM infor_users WHERE role_user = 'users'`
);

// NEW (V2)
const result = await pool.query(
  `SELECT * FROM users WHERE role = 'patient'`
);
```

---

### 8. `/routes/insuranceNewRoutes.js`

**CRITICAL CHANGE:** Remove `patient_code` and `patient_name` columns

```javascript
// OLD (V1) - Bad (data duplication)
router.get('/:id', async (req, res) => {
  const result = await pool.query(
    'SELECT insurance_id, claim_code, patient_code, patient_name, total_amount FROM insurance_claims WHERE insurance_id = $1',
    [req.params.id]
  );
});

router.post('/', async (req, res) => {
  const { patient_id, patient_code, patient_name, total_amount } = req.body;
  const result = await pool.query(
    'INSERT INTO insurance_claims (patient_id, patient_code, patient_name, total_amount) VALUES ($1, $2, $3, $4)',
    [patient_id, patient_code, patient_name, total_amount]
  );
});

// NEW (V2) - Good (get via JOIN)
router.get('/:id', async (req, res) => {
  const result = await pool.query(
    `SELECT
      ic.insurance_id,
      ic.claim_code,
      ic.total_amount,
      ic.insurance_covered,
      ic.patient_pay,
      p.patient_code,
      u.full_name as patient_name,
      u.phone_number as patient_phone
    FROM insurance_claims ic
    JOIN patients p ON p.patient_id = ic.patient_id
    LEFT JOIN users u ON u.user_id = p.user_id
    WHERE ic.insurance_id = $1`,
    [req.params.id]
  );
});

router.post('/', async (req, res) => {
  const { patient_id, total_amount, insurance_covered, patient_pay } = req.body;
  // NO patient_code or patient_name in INSERT
  const result = await pool.query(
    'INSERT INTO insurance_claims (patient_id, total_amount, insurance_covered, patient_pay, claim_code, visit_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [patient_id, total_amount, insurance_covered, patient_pay, generateClaimCode(), new Date(), 'pending']
  );
});
```

---

### 9. `/routes/laboratoryTestsRoutes.js`

**Same changes as insurance - remove patient_code/patient_name**

```javascript
// NEW (V2)
router.get('/:id', async (req, res) => {
  const result = await pool.query(
    `SELECT
      lt.lab_test_id,
      lt.test_code,
      lt.test_type,
      lt.status,
      p.patient_code,
      u.full_name as patient_name
    FROM laboratory_tests lt
    JOIN patients p ON p.patient_id = lt.patient_id
    LEFT JOIN users u ON u.user_id = p.user_id
    WHERE lt.lab_test_id = $1`,
    [req.params.id]
  );
});
```

---

### 10. `/routes/testResultsNewRoutes.js`

**Same changes as above**

```javascript
// NEW (V2)
router.get('/:id', async (req, res) => {
  const result = await pool.query(
    `SELECT
      tr.test_result_id,
      tr.test_code,
      tr.test_name,
      tr.result_value,
      tr.status,
      p.patient_code,
      u.full_name as patient_name
    FROM test_results tr
    JOIN patients p ON p.patient_id = tr.patient_id
    LEFT JOIN users u ON u.user_id = p.user_id
    WHERE tr.test_result_id = $1`,
    [req.params.id]
  );
});
```

---

## 🎨 Frontend Files to Update

### 1. `/services/AccountService.js`

**No changes needed** - API endpoints stay same (`/api/account/*`)
**BUT response field names change:**

```javascript
// OLD (V1)
const data = response.data.account;
console.log(data.name); // ❌
console.log(data.phone); // ❌

// NEW (V2)
const data = response.data.account;
console.log(data.full_name); // ✅
console.log(data.phone_number); // ✅
```

---

### 2. All other frontend services

**Update field access:**
- `infor_users_id` → `user_id`
- `name` → `full_name` (in account responses)
- `phone` → `phone_number` (in account responses)
- `role_user` → `role`

---

## 🔍 Search & Replace Patterns

**Safe to do global search-replace:**

```bash
# Backend SQL queries
FROM infor_users → FROM users
FROM infor_employee → FROM employees
FROM list_department → FROM departments
FROM list_position → FROM positions

# Backend column references (be careful with these)
infor_users_id → user_id  # (only in SQL queries, not all JS vars)
role_user → role  # (SQL queries only)
status_employee → employment_status
```

**NOT safe for global replace** (need manual review):
- `phone` → `phone_number` (many other uses of "phone")
- `name` → `full_name` (too generic)

---

## ✅ Testing Checklist

After updating code:

- [ ] **Login works** (`/api/account/login`)
- [ ] **User login works** (`/api/user-auth/login`)
- [ ] **Employee CRUD** (`/api/employee/*`)
- [ ] **Department list** (`/api/department`)
- [ ] **Position list** (`/api/position`)
- [ ] **Patient list** (`/api/patients`)
- [ ] **Insurance claims** (with JOIN - no patient_code/patient_name in INSERT)
- [ ] **Lab tests** (with JOIN)
- [ ] **Test results** (with JOIN)
- [ ] **User profile** (`/api/user-profile/:user_id`)
- [ ] **Appointments** (`/api/appointments`)
- [ ] **Financial reports** (expenses, funds, revenue)

---

## 🚨 Critical Notes

1. **DON'T mix V1 and V2 code** - Update ALL files or none
2. **Test on dev database first** - Never test on production
3. **Backup before migration** - Can rollback if needed
4. **Update in this order:**
   - Backend routes first
   - Then backend controllers
   - Then frontend services
   - Then test everything
5. **insurance/lab tables:** Never send patient_code or patient_name in POST requests

---

**Status:** ❌ NOT YET APPLIED
**Next Step:** Apply changes file by file (starting with this document's order)
