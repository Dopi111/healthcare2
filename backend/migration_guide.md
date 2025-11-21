# Database Schema V2 Migration Guide

## 🎯 Overview

This guide covers the migration from Schema V1 to Schema V2 - a complete database refactor to eliminate data duplication, enforce data integrity, and establish a production-ready foundation.

**Migration Type**: **BREAKING CHANGES** - Full schema rebuild required
**Downtime Required**: Yes (estimated 30-60 minutes for production)
**Rollback Strategy**: Full database backup required before migration

---

## 📋 Table of Contents

1. [Breaking Changes Summary](#breaking-changes-summary)
2. [Table Name Changes](#table-name-changes)
3. [Column Name Changes](#column-name-changes)
4. [Removed Tables](#removed-tables)
5. [Data Migration Script](#data-migration-script)
6. [API Endpoint Updates](#api-endpoint-updates)
7. [Testing Checklist](#testing-checklist)
8. [Rollback Procedure](#rollback-procedure)

---

## ⚠️ Breaking Changes Summary

### 1. **MERGED TABLES** ✨

**`accounts` + `infor_users` → `users`**

**Reason**: These two tables stored duplicate data (employee_id, phone, email, etc.) with no foreign key relationship. This caused:
- Data inconsistency risks
- Duplicate maintenance burden
- Confusing for developers
- No single source of truth for authentication

**Impact**:
- ✅ Single table for ALL users (employees AND patients)
- ✅ One password field, one phone field, one email field
- ✅ No more sync issues between tables
- ❌ ALL existing queries must be updated

**Migration**: Merge data prioritizing `infor_users` as source of truth (more complete data)

---

### 2. **REMOVED DATA DUPLICATION** 🗑️

**Tables Affected**: `insurance_claims`, `laboratory_tests`, `test_results`

**V1 Schema** (❌ Bad):
```sql
CREATE TABLE insurance_claims (
    patient_id INT REFERENCES patients(patient_id),
    patient_code VARCHAR(50),  -- DUPLICATE!
    patient_name VARCHAR(100), -- DUPLICATE!
    ...
);
```

**V2 Schema** (✅ Good):
```sql
CREATE TABLE insurance_claims (
    patient_id INT NOT NULL REFERENCES patients(patient_id) ON DELETE RESTRICT,
    -- Get patient_code and patient_name via JOIN with patients table
    ...
);
```

**Reason**:
- Violates database normalization principles
- Risk of outdated data (patient changes name but insurance_claims.patient_name not updated)
- Wastes storage space
- Harder to maintain data integrity

**Impact**:
- ❌ Columns `patient_code` and `patient_name` REMOVED from:
  - `insurance_claims`
  - `laboratory_tests`
  - `test_results`
- ✅ Must use JOIN to get patient information
- ✅ Data always current and consistent

---

### 3. **REMOVED LEGACY TABLE** 🗑️

**Table Removed**: `infor_auth_employee`

**Reason**:
- Legacy authentication table no longer used
- Redundant with `users` table
- No FK relationship with other tables
- Confusing for new developers

**Impact**:
- ❌ Any code referencing `infor_auth_employee` will break
- ✅ Use `users` table for authentication instead

---

### 4. **COMPREHENSIVE CONSTRAINTS ADDED** 🔒

**Added Constraints**:

- ✅ **CHECK constraints** for all enums and formats
- ✅ **NOT NULL** for critical business fields
- ✅ **Email validation** regex
- ✅ **Phone number validation** (Vietnamese format: ^0[0-9]{9}$)
- ✅ **Amount validation** (>= 0)
- ✅ **Business logic validation** (e.g., total_amount = insurance_covered + patient_pay)

**Example**:
```sql
-- V1: No validation (❌)
gender VARCHAR(10) DEFAULT 'Nam'

-- V2: Enforced validation (✅)
gender VARCHAR(10) DEFAULT 'Nam' NOT NULL
CHECK (gender IN ('Nam', 'Nữ', 'Khác'))
```

**Impact**:
- ❌ Cannot insert invalid data (will throw errors)
- ✅ Data quality guaranteed at database level
- ✅ Business logic violations caught immediately

---

### 5. **STANDARDIZED NAMING** 📝

**Changes**:
- Prefix: `infor_` → `info_` (shorter, cleaner)
- Some tables pluralized for consistency
- Column names remain snake_case (no change)

---

### 6. **OPTIMIZED FOREIGN KEYS** 🔗

**V2 Foreign Key Strategy**:

| Scenario | Delete Strategy | Reason |
|----------|----------------|--------|
| `employees.user_id` → `users` | `ON DELETE CASCADE` | Employee record meaningless without user |
| `patients.user_id` → `users` | `ON DELETE SET NULL` | Preserve patient records for historical data (walk-ins may not have user account) |
| `insurance_claims.patient_id` → `patients` | `ON DELETE RESTRICT` | Cannot delete patient with active insurance claims |
| `employees.position_id` → `positions` | `ON DELETE SET NULL` | Preserve employee record even if position deleted (historical data) |

**Impact**:
- ✅ Data integrity enforced automatically
- ✅ Clear deletion rules
- ❌ Some deletions may be blocked (e.g., cannot delete patient with active claims)

---

### 7. **AUTO-UPDATE TRIGGERS** ⏰

**Added Triggers**:
- All tables with `updated_at` now have automatic trigger
- `updated_at` automatically set to CURRENT_TIMESTAMP on UPDATE

**Impact**:
- ✅ No need to manually set `updated_at` in queries
- ✅ Accurate audit trail

---

## 📊 Table Name Changes

| V1 Name | V2 Name | Change Type |
|---------|---------|-------------|
| `accounts` | **MERGED** → `users` | Merged |
| `infor_users` | `users` | Renamed + Merged |
| `infor_employee` | `employees` | Renamed |
| `infor_auth_employee` | **REMOVED** | Deleted |
| `list_department` | `departments` | Renamed |
| `list_position` | `positions` | Renamed |
| `user_medical_info` | `user_medical_infos` | Pluralized |
| `user_relatives` | `user_relatives` | No change |
| `user_medical_history` | `user_medical_histories` | Pluralized |
| `appointments` | `appointments` | No change |
| `lab_results` | `lab_results` | No change |
| `patients` | `patients` | No change |
| `expenses` | `expenses` | No change |
| `funds` | `funds` | No change |
| `insurance_claims` | `insurance_claims` | No change |
| `revenue` | `revenue` | No change |
| `laboratory_tests` | `laboratory_tests` | No change |
| `test_results` | `test_results` | No change |

---

## 🔄 Column Name Changes

### `users` (merged from `accounts` + `infor_users`)

| V1 Column (accounts) | V1 Column (infor_users) | V2 Column | Notes |
|---------------------|------------------------|-----------|-------|
| `id` | `infor_users_id` | `user_id` | New unified ID |
| `employee_id` | `employee_id` | `employee_id` | No change |
| `phone` | `phone_number` | `phone_number` | Standardized |
| `email` | `email` | `email` | No change |
| `name` | `full_name` | `full_name` | Standardized |
| `password` | `password` | `password` | No change |
| `role` | `role_user` | `role` | Simplified |
| `status` | - | `status` | Added to V2 |
| `department` | `department` | `department` | No change |
| `position` | `position` | `position` | No change |
| - | `card_id` | `card_id` | From infor_users |
| - | `date_of_birth` | `date_of_birth` | From infor_users |
| - | `gender` | `gender` | From infor_users |

### `employees` (from `infor_employee`)

| V1 Column | V2 Column | Notes |
|-----------|-----------|-------|
| `infor_employee_id` | `employee_id` | Renamed |
| `infor_users_id` | `user_id` | Renamed |
| `status_employee` | `employment_status` | Renamed |
| `attached` | `attached_documents` | More descriptive |
| `business` | `business_description` | More descriptive |
| `started_date` | `start_date` | Standardized |
| - | `end_date` | Added |

### `departments` (from `list_department`)

| V1 Column | V2 Column | Notes |
|-----------|-----------|-------|
| `department_id` | `department_id` | No change |
| `department_name` | `department_name` | No change |
| - | `description` | Added |
| - | `is_active` | Added (soft delete) |

### `insurance_claims`, `laboratory_tests`, `test_results`

**REMOVED COLUMNS** (get via JOIN instead):
- ❌ `patient_code`
- ❌ `patient_name`

**UPDATED COLUMNS**:
- `patient_id`: Now `NOT NULL` and `ON DELETE RESTRICT`

---

## 🗄️ Removed Tables

### `infor_auth_employee`

**Reason**: Legacy authentication table, replaced by `users` table

**Migration**: No data migration needed - was not actively used

**Impact**: Remove any code referencing this table

---

## 📜 Data Migration Script

### Pre-Migration Checklist

- [ ] **Backup production database**
  ```bash
  pg_dump -h localhost -U postgres -d healthcare_db > backup_v1_$(date +%Y%m%d_%H%M%S).sql
  ```
- [ ] **Test migration on staging/development first**
- [ ] **Notify users of maintenance window**
- [ ] **Stop application servers** (prevent writes during migration)

### Migration SQL Script

```sql
-- ============================================
-- DATA MIGRATION: V1 → V2
-- Run this AFTER creating V2 schema
-- ============================================

-- STEP 1: Backup V1 data to temp tables
-- ============================================

CREATE TABLE backup_accounts AS SELECT * FROM accounts;
CREATE TABLE backup_infor_users AS SELECT * FROM infor_users;
CREATE TABLE backup_infor_employee AS SELECT * FROM infor_employee;

-- STEP 2: Migrate users (merge accounts + infor_users)
-- ============================================

-- Strategy: Use infor_users as source of truth, backfill from accounts

INSERT INTO users (
    phone_number,
    card_id,
    password,
    full_name,
    date_of_birth,
    gender,
    email,
    employee_id,
    position,
    department,
    specialty,
    permanent_address,
    current_address,
    role,
    status,
    created_at
)
SELECT
    COALESCE(iu.phone_number, a.phone),
    iu.card_id,
    COALESCE(iu.password, a.password),
    COALESCE(iu.full_name, a.name),
    COALESCE(iu.date_of_birth, '1990-01-01'::DATE), -- Default if missing
    COALESCE(iu.gender, 'Nam'),
    COALESCE(iu.email, a.email),
    iu.employee_id,
    COALESCE(iu.position, a.position),
    COALESCE(iu.department, a.department),
    iu.specialty,
    iu.permanent_address,
    iu.current_address,
    CASE
        WHEN a.role = 'administrator' THEN 'administrator'
        WHEN a.role = 'doctor' THEN 'doctor'
        WHEN a.role = 'nurse' THEN 'nurse'
        WHEN a.role = 'receptionist' THEN 'receptionist'
        WHEN a.role = 'accountant' THEN 'accountant'
        WHEN iu.role_user = 'employee' THEN 'employee'
        ELSE 'patient'
    END,
    COALESCE(a.status, 'active'),
    COALESCE(iu.created_at, a.created_at, CURRENT_TIMESTAMP)
FROM infor_users iu
LEFT JOIN accounts a ON a.employee_id = iu.employee_id
WHERE iu.role_user IN ('employee', 'users')

UNION

-- Add accounts that don't exist in infor_users (if any)
SELECT
    a.phone,
    LPAD(SUBSTRING(a.phone FROM 2), 12, '0'), -- Generate card_id from phone
    a.password,
    a.name,
    '1990-01-01'::DATE, -- Default date_of_birth
    'Nam',
    a.email,
    a.employee_id,
    a.position,
    a.department,
    NULL, -- specialty
    NULL, -- permanent_address
    NULL, -- current_address
    a.role,
    a.status,
    a.created_at
FROM accounts a
WHERE NOT EXISTS (
    SELECT 1 FROM infor_users iu WHERE iu.employee_id = a.employee_id
);

-- STEP 3: Migrate employees
-- ============================================

INSERT INTO employees (
    user_id,
    position_id,
    department_id,
    business_description,
    start_date,
    salary,
    coefficient,
    attached_documents,
    employment_status,
    created_at
)
SELECT
    u.user_id,
    ie.position_id,
    ie.department_id,
    ie.business,
    ie.started_date,
    ie.salary,
    ie.coefficient,
    ie.attached,
    ie.status_employee,
    ie.created_at
FROM infor_employee ie
JOIN infor_users iu ON iu.infor_users_id = ie.infor_users_id
JOIN users u ON u.employee_id = iu.employee_id;

-- STEP 4: Update Foreign Keys
-- ============================================

-- Update patients.user_id
UPDATE patients p
SET user_id = u.user_id
FROM infor_users iu
JOIN users u ON u.phone_number = iu.phone_number
WHERE p.infor_users_id = iu.infor_users_id;

-- Update appointments.user_id
UPDATE appointments a
SET user_id = u.user_id
FROM infor_users iu
JOIN users u ON u.phone_number = iu.phone_number
WHERE a.infor_users_id = iu.infor_users_id;

-- Update lab_results.user_id
UPDATE lab_results lr
SET user_id = u.user_id
FROM infor_users iu
JOIN users u ON u.phone_number = iu.phone_number
WHERE lr.infor_users_id = iu.infor_users_id;

-- Update user_medical_infos.user_id
UPDATE user_medical_info mi
SET user_id = u.user_id
FROM infor_users iu
JOIN users u ON u.phone_number = iu.phone_number
WHERE mi.infor_users_id = iu.infor_users_id;

-- Update user_relatives.user_id
UPDATE user_relatives ur
SET user_id = u.user_id
FROM infor_users iu
JOIN users u ON u.phone_number = iu.phone_number
WHERE ur.infor_users_id = iu.infor_users_id;

-- Update user_medical_history.user_id
UPDATE user_medical_history mh
SET user_id = u.user_id
FROM infor_users iu
JOIN users u ON u.phone_number = iu.phone_number
WHERE mh.infor_users_id = iu.infor_users_id;

-- STEP 5: Verify Migration
-- ============================================

-- Check counts
SELECT 'Users' as table_name, COUNT(*) as v1_count FROM backup_infor_users
UNION ALL
SELECT 'Users (V2)', COUNT(*) FROM users
UNION ALL
SELECT 'Employees' as table_name, COUNT(*) FROM backup_infor_employee
UNION ALL
SELECT 'Employees (V2)', COUNT(*) FROM employees;

-- Check for orphaned records
SELECT 'Patients without user' as issue, COUNT(*) as count
FROM patients WHERE user_id IS NULL
UNION ALL
SELECT 'Employees without user', COUNT(*)
FROM employees WHERE user_id NOT IN (SELECT user_id FROM users);

-- STEP 6: Cleanup (ONLY after verification)
-- ============================================

-- DROP TABLE backup_accounts;
-- DROP TABLE backup_infor_users;
-- DROP TABLE backup_infor_employee;
```

---

## 🔌 API Endpoint Updates

### Authentication Endpoints

**V1 Code** (❌):
```javascript
// Login using accounts table
const result = await db.query(
  'SELECT * FROM accounts WHERE employee_id = $1',
  [employeeId]
);
```

**V2 Code** (✅):
```javascript
// Login using users table
const result = await db.query(
  'SELECT * FROM users WHERE employee_id = $1 AND role != $2',
  [employeeId, 'patient']
);
```

### Employee Endpoints

**V1**: `GET /api/employee/:employee_id`
```javascript
// V1: JOIN with infor_employee
const q = `
  SELECT *
  FROM infor_employee e
  JOIN infor_users u ON e.infor_users_id = u.infor_users_id
  WHERE u.employee_id = $1
`;
```

**V2**: `GET /api/employee/:employee_id`
```javascript
// V2: JOIN with employees (updated names)
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

### Patient Endpoints (Insurance/Lab Tests)

**V1** (❌ Duplication):
```javascript
// V1: patient data duplicated in insurance_claims
const result = await db.query(`
  SELECT
    claim_code,
    patient_id,
    patient_code,  -- DUPLICATE!
    patient_name,  -- DUPLICATE!
    total_amount
  FROM insurance_claims
  WHERE claim_id = $1
`, [claimId]);
```

**V2** (✅ Normalized):
```javascript
// V2: JOIN to get patient data
const result = await db.query(`
  SELECT
    ic.claim_code,
    ic.patient_id,
    p.patient_code,  -- From JOIN
    u.full_name as patient_name,  -- From JOIN
    ic.total_amount
  FROM insurance_claims ic
  JOIN patients p ON p.patient_id = ic.patient_id
  LEFT JOIN users u ON u.user_id = p.user_id
  WHERE ic.claim_id = $1
`, [claimId]);
```

### Summary of API Changes

| Endpoint | V1 Table | V2 Table | Join Required? |
|----------|----------|----------|----------------|
| `/api/account/login` | `accounts` | `users` | No |
| `/api/employee/:id` | `infor_employee` + `infor_users` | `employees` + `users` | Yes (renamed) |
| `/api/patient/:id` | `patients` | `patients` | No |
| `/api/insurance/:id` | `insurance_claims` | `insurance_claims` + `patients` + `users` | **YES (NEW)** |
| `/api/laboratory-tests/:id` | `laboratory_tests` | `laboratory_tests` + `patients` + `users` | **YES (NEW)** |
| `/api/test-results/:id` | `test_results` | `test_results` + `patients` + `users` | **YES (NEW)** |

---

## ✅ Testing Checklist

### Database Level

- [ ] **Schema created successfully**
  ```sql
  SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';
  -- Should return 18 tables
  ```

- [ ] **All constraints work**
  ```sql
  -- Test gender constraint
  INSERT INTO users (..., gender) VALUES (..., 'Invalid'); -- Should FAIL

  -- Test phone format
  INSERT INTO users (..., phone_number) VALUES (..., '123'); -- Should FAIL

  -- Test amount >= 0
  INSERT INTO expenses (..., amount) VALUES (..., -100); -- Should FAIL
  ```

- [ ] **Triggers work**
  ```sql
  UPDATE users SET full_name = 'Test' WHERE user_id = 1;
  SELECT updated_at FROM users WHERE user_id = 1; -- Should be recent
  ```

- [ ] **Foreign keys cascade correctly**
  ```sql
  -- Test CASCADE
  DELETE FROM users WHERE user_id = (SELECT user_id FROM employees LIMIT 1);
  -- Employee record should also be deleted

  -- Test SET NULL
  DELETE FROM users WHERE user_id = (SELECT user_id FROM patients LIMIT 1);
  -- Patient record should remain, user_id set to NULL

  -- Test RESTRICT
  DELETE FROM patients WHERE patient_id IN (SELECT patient_id FROM insurance_claims LIMIT 1);
  -- Should FAIL with FK constraint error
  ```

### API Level

- [ ] **Authentication works**
  - [ ] Login with phone number
  - [ ] Login with employee_id
  - [ ] Password verification
  - [ ] Role-based access control

- [ ] **Employee CRUD**
  - [ ] GET employee by ID
  - [ ] CREATE new employee (should create user + employee)
  - [ ] UPDATE employee info
  - [ ] DELETE employee (should cascade to employee table)

- [ ] **Patient CRUD**
  - [ ] GET patient with user info (JOIN)
  - [ ] CREATE patient (with/without user_id)
  - [ ] UPDATE patient
  - [ ] DELETE patient (should be blocked if has claims/tests)

- [ ] **Insurance Claims**
  - [ ] GET claim with patient details (requires JOIN)
  - [ ] CREATE claim (patient_id only, no duplication)
  - [ ] UPDATE claim
  - [ ] Verify cannot delete patient with active claims

- [ ] **Laboratory Tests**
  - [ ] GET test with patient details (requires JOIN)
  - [ ] CREATE test (patient_id only)
  - [ ] UPDATE test results
  - [ ] Verify cannot delete patient with tests

### Frontend Level

- [ ] **Login page works**
- [ ] **Employee management**
  - [ ] List employees
  - [ ] Add employee
  - [ ] Edit employee
  - [ ] Delete employee
- [ ] **Patient management**
  - [ ] List patients
  - [ ] View patient details (sidebar with user info)
  - [ ] Add patient
  - [ ] Edit patient
- [ ] **Accounting features**
  - [ ] Expenses, Funds, Revenue all display correctly
- [ ] **Insurance/Lab features**
  - [ ] Display patient name/code from JOIN (not from column)

---

## 🔙 Rollback Procedure

### If Migration Fails

1. **Stop application servers immediately**

2. **Restore from backup**
   ```bash
   # Drop V2 schema
   psql -h localhost -U postgres -d healthcare_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

   # Restore V1 backup
   psql -h localhost -U postgres -d healthcare_db < backup_v1_YYYYMMDD_HHMMSS.sql
   ```

3. **Verify restoration**
   ```sql
   SELECT COUNT(*) FROM accounts; -- Should match pre-migration count
   SELECT COUNT(*) FROM infor_users; -- Should match pre-migration count
   ```

4. **Restart application with V1 code**

5. **Investigate migration failure**
   - Check PostgreSQL logs
   - Review error messages
   - Fix migration script
   - Test on staging again

---

## 📞 Support

**Questions?** Contact the development team or refer to:
- `database_schema_v2_optimized.sql` - Full schema definition
- `database_diagram.md` - Visual ERD and relationships
- Backend API documentation at `/api-docs`

**Emergency Rollback?** Follow the [Rollback Procedure](#rollback-procedure) above.

---

## ✨ Benefits of V2

1. ✅ **Single Source of Truth**: No more `accounts` vs `infor_users` confusion
2. ✅ **Data Integrity**: Constraints prevent invalid data
3. ✅ **No Duplication**: Patient info via JOIN (always current)
4. ✅ **Clear Deletion Rules**: CASCADE vs SET NULL vs RESTRICT
5. ✅ **Production-Ready**: Industry-standard schema design
6. ✅ **Maintainable**: Consistent naming and structure
7. ✅ **Auditable**: Auto-updated timestamps
8. ✅ **Scalable**: Optimized indexes and FK strategy

---

**Migration Date**: _____________________
**Migrated By**: _____________________
**Verified By**: _____________________
**Production Deployment**: _____________________
