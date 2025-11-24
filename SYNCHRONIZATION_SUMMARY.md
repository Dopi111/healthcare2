# Healthcare System V2 Synchronization Summary

**Date**: 2025-11-24
**Status**: In Progress
**Database Schema**: v2_optimized

---

## 📋 Overview

This document summarizes the synchronization effort to align the backend API and frontend with the optimized database schema v2.

---

## ✅ Completed Work

### 1. Database Schema V2
- **File**: `backend/database_schema_v2_optimized.sql`
- **Status**: ✅ Complete and ready to deploy
- **Key Changes**:
  - Merged `accounts` + `infor_users` → `users` table
  - Removed data duplication from insurance/lab tables
  - Added comprehensive CHECK constraints
  - Optimized foreign keys (CASCADE, SET NULL, RESTRICT)
  - Auto-update triggers for timestamps

### 2. Data Migration Script
- **File**: `backend/scripts/migrate-to-v2.js`
- **Status**: ✅ Complete
- **Features**:
  - Migrates data from old schema to v2
  - Transaction-based (rollback on error)
  - Comprehensive statistics reporting
  - Usage: `node scripts/migrate-to-v2.js`

### 3. Backend Controllers (3/10 completed)

#### ✅ employeeControllers.js
- Already updated for v2 schema
- Uses `users` table correctly
- Proper `user_id` and role handling
- No changes needed

#### ✅ userAuthRoutes.js & userProfileRoutes.js
- Updated for v2 schema
- Fixed medical info fields to match v2 (removed height, weight, medications, notes)
- Added correct fields: emergency_contact_name, emergency_contact_phone, emergency_contact_relation, insurance_number, insurance_provider
- Proper use of `users` and `user_medical_infos` tables

#### ✅ patientsController.js
- **Changes Applied**:
  - Replaced `infor_users` → `users`
  - Replaced `infor_users_id` → `user_id`
  - Updated all JOIN queries
  - Fixed default status value: `'Đang điều trị'` → `'active'`
- **Functions Updated**: 8/8
  - getAllPatients
  - getPatientById
  - getPatientByCode
  - createPatient
  - updatePatient
  - deletePatient
  - searchPatients
  - getPatientsByStatus
  - getPatientsByDoctor

---

## 🔄 In Progress / Pending Work

### Backend Controllers (7 remaining)

#### ⏳ laboratoryTestsController.js
**Required Changes**:
- Remove `patient_code` and `patient_name` fields from INSERT/UPDATE operations
- Add JOIN with `patients` table to retrieve patient info
- Update queries:
  ```sql
  -- OLD
  INSERT INTO laboratory_tests (..., patient_code, patient_name, ...)

  -- NEW
  INSERT INTO laboratory_tests (..., patient_id, ...)
  -- Get patient info via JOIN:
  SELECT lt.*, p.patient_code, u.full_name as patient_name
  FROM laboratory_tests lt
  JOIN patients p ON lt.patient_id = p.patient_id
  LEFT JOIN users u ON p.user_id = u.user_id
  ```

#### ⏳ testResultsController.js
**Required Changes**:
- Remove `patient_code` and `patient_name` fields
- Add JOIN with `patients` table
- Same pattern as laboratoryTestsController

#### ⏳ insuranceController.js
**Required Changes**:
- Remove `patient_code` and `patient_name` fields
- Add JOIN with `patients` table
- Ensure amount validation: `total_amount = insurance_covered + patient_pay`
- Update status enum values

#### ⏳ expensesController.js
**Required Changes**:
- Update column name: `date` → `expense_date`
- Update status enum values: match v2 schema (`pending`, `approved`, `rejected`, `paid`)

#### ⏳ fundsController.js
**Required Changes**:
- Update column name: `date` → `transaction_date`
- Update column name: `type` → `transaction_type`
- Update type enum values: `income` or `expense`

#### ⏳ revenueController.js
**Required Changes**:
- Update column name: `date` → `revenue_date`
- Add `month_year` field handling (YYYY-MM format)
- Update queries to use new column names

#### ⏳ appointmentsController.js
**Required Changes**:
- Update JOIN from `infor_users` → `users`
- Update `infor_users_id` → `user_id`
- Verify status enum values match v2

### Backend Routes (13 files)
All route files need review and updates:
1. employeesRouters.js
2. accountRoutes.js (consider removing - merged into users)
3. departmentRoutes.js
4. positionRoutes.js
5. patientsRoutes.js
6. userAuthRoutes.js ✅
7. userProfileRoutes.js ✅
8. appointmentsRoutes.js
9. labResultsRoutes.js
10. patientsNewRoutes.js
11. expensesNewRoutes.js
12. fundsNewRoutes.js
13. insuranceNewRoutes.js
14. revenueNewRoutes.js
15. laboratoryTestsRoutes.js
16. testResultsNewRoutes.js

### Backend Server
**File**: `backend/src/server.js`
**Required Changes**:
- Update admin account creation to use `users` table
- Verify all route registrations
- Consider removing `/api/account` route

### Frontend Services (10 files)

#### AccountService.js
**Action**: Merge into EmployeeService or remove
- All employee authentication now in `users` table

#### PatientService.js
**Required Changes**:
- Update API calls to expect JOINed data
- Remove `patient_name`, `patient_code` from form submissions
- Use `user_id` for registered patients

#### LaboratoryService.js
**Required Changes**:
- Remove `patient_code`, `patient_name` from API payloads
- Expect patient info from backend JOIN
- Update status enum values

#### TestResultService.js
**Required Changes**:
- Remove `patient_code`, `patient_name`
- Update date field names

#### InsuranceService.js
**Required Changes**:
- Remove `patient_code`, `patient_name`
- Add amount validation client-side

#### ExpenseService.js
**Required Changes**:
- Update `date` → `expense_date`
- Update status enum values

#### FundService.js
**Required Changes**:
- Update `date` → `transaction_date`
- Update `type` → `transaction_type`

#### RevenueService.js
**Required Changes**:
- Update `date` → `revenue_date`
- Add `month_year` field

### Frontend Forms (~15 files)

#### Patient Forms
- Them_BN_v2.jsx: Update field names, remove duplicates
- DS_BN_v2.jsx: Update to handle JOINed patient data

#### Employee Forms
- Login_E.jsx, Register_E.jsx: Update to use unified `users` table
- Update employee_id validation (10 digits)

#### Lab Forms
- Lab test forms: Remove patient_code/patient_name input, use patient selector

#### Financial Forms
- Update date field names
- Update enum values

---

## 📊 Key Schema Changes Reference

| Old Schema | New Schema V2 | Impact |
|------------|---------------|--------|
| `accounts` | Merged into `users` | Remove `/api/account` endpoints |
| `infor_users` | Merged into `users` | Update all user queries |
| `infor_users_id` | `user_id` | Update all foreign keys |
| `role_user` | `role` | Update role queries |
| `list_department` | `departments` | Update references |
| `list_position` | `positions` | Update references |
| `infor_employee` | `employees` | Update employee queries |
| Insurance: `patient_code`, `patient_name` | Removed (use JOIN) | Add JOIN queries |
| Lab tests: `patient_code`, `patient_name` | Removed (use JOIN) | Add JOIN queries |
| `expenses.date` | `expenses.expense_date` | Update column names |
| `funds.date` | `funds.transaction_date` | Update column names |
| `funds.type` | `funds.transaction_type` | Update column names |
| `revenue.date` | `revenue.revenue_date` | Update column names |
| `user_medical_info` | `user_medical_infos` | Update table name |

---

## 🚀 Deployment Steps

### Step 1: Database Migration
```bash
# 1. Backup current database
pg_dump -U postgres healthcare_db > backup_$(date +%Y%m%d).sql

# 2. Run schema v2 in pgAdmin 4
# - Open database_schema_v2_optimized.sql
# - Execute in Query Tool

# 3. Run data migration
cd backend
node scripts/migrate-to-v2.js

# 4. Verify migration
# Check tables, counts, and sample data
```

### Step 2: Backend Deployment
```bash
# 1. Complete remaining controller updates
# 2. Update all route files
# 3. Update server.js
# 4. Test API endpoints
npm run dev

# 5. Test each endpoint with Postman/Thunder Client
```

### Step 3: Frontend Deployment
```bash
# 1. Update all service files
# 2. Update form components
# 3. Test all features
cd fontend
npm run dev

# 4. Test user flows:
#    - Employee login
#    - Patient registration/login
#    - Patient management
#    - Lab test management
#    - Financial operations
```

---

## ✅ Testing Checklist

### Backend API
- [ ] Employee login works
- [ ] Patient login works
- [ ] Patient registration creates correct records
- [ ] Patient list returns JOINed data
- [ ] Lab tests show patient info via JOIN
- [ ] Insurance claims show patient info via JOIN
- [ ] Financial reports use correct date fields
- [ ] All CRUD operations work
- [ ] Foreign key constraints work (CASCADE, SET NULL, RESTRICT)

### Frontend
- [ ] Employee login form works
- [ ] Patient registration form works
- [ ] Patient list displays correctly
- [ ] Add patient form validates correctly
- [ ] Lab test forms work without patient_code/patient_name
- [ ] Financial forms use new date field names
- [ ] All validations match v2 constraints

---

## 📝 Breaking Changes

### For API Consumers
1. **Authentication**: Unified in `users` table
   - Old: `/api/account/login` (employees)
   - New: `/api/employee/login` (still works, uses `users` table)

2. **Patient Data**: Now requires JOIN
   - Old: `patient_code`, `patient_name` in lab/insurance tables
   - New: Must JOIN with `patients` and `users` tables

3. **Date Fields**: Renamed for clarity
   - `expenses.date` → `expenses.expense_date`
   - `funds.date` → `funds.transaction_date`
   - `revenue.date` → `revenue.revenue_date`

4. **Enum Values**: Updated to English
   - Patient status: `'Đang điều trị'` → `'active'`
   - Expense status: `'Chờ duyệt'` → `'pending'`

---

## 🔧 Rollback Plan

If issues occur:
```bash
# 1. Restore database from backup
psql -U postgres healthcare_db < backup_YYYYMMDD.sql

# 2. Revert code changes
git checkout <previous-commit>

# 3. Restart services
npm run dev
```

---

## 📞 Support

For issues or questions:
- Check this document first
- Review database schema comments
- Check migration script output
- Test with sample data first

---

## 📈 Progress Summary

**Overall Progress**: ~30% Complete

- ✅ Database Schema: 100%
- ✅ Migration Script: 100%
- 🔄 Backend Controllers: 30% (3/10)
- ⏳ Backend Routes: 12% (2/16)
- ⏳ Frontend Services: 0% (0/10)
- ⏳ Frontend Forms: 0% (0/15)

**Estimated Remaining Work**: 6-8 hours

---

**Last Updated**: 2025-11-24
**Next Steps**: Complete remaining backend controllers
