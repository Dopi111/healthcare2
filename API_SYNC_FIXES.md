# API Sync Fixes - Healthcare System

**Date**: 2025-11-24
**Status**: Issues Identified & Ready for Fix

---

## 🔍 Issues Identified

### ❌ Issue 1: Patient ID Undefined in DELETE Operation
**Location**: `fontend/src/pages/AdminPage/System/Patient_List_Details.jsx:157`

**Problem**:
```javascript
await PatientService.deletePatient(patient.id);  // ❌ patient.id is undefined
```

**Root Cause**:
- Backend returns `patient_id` field (from patients table)
- Frontend tries to access `patient.id` which doesn't exist

**Fix**:
```javascript
await PatientService.deletePatient(patient.patient_id);  // ✅ Use patient_id
```

**Also affects**:
- `fontend/src/pages/AdminPage/Doctor/Individual_Patient_Management.jsx:97`

---

### ✅ Issue 2: "/api/salaries" Route (NOT AN ERROR)
**Status**: Working as intended

**Clarification**:
- `SalaryManagement.jsx` uses `/api/employee/list-employee` ✅
- This route exists and returns JSON properly
- There is NO separate `/api/salaries` route needed
- Salary data is derived from employee data

---

### ✅ Issue 3: Function Names (NOT AN ERROR)
**Status**: Correct function names confirmed

**Functions exist:**
- ✅ `RevenueService.getAllRevenue()` (singular) - Line 9 in RevenueService.js
- ✅ `InsuranceService.getAllInsurance()` (singular) - Line 9 in InsuranceService.js

**If errors mention plural forms, they are typos in calling code:**
- ❌ `getAllRevenues()` - Does NOT exist (would be a typo)
- ❌ `getAllInsurances()` - Does NOT exist (would be a typo)

---

### ✅ Issue 4: "/api/appointments" Returns JSON
**Status**: Working correctly

**Confirmation**:
- `appointmentsController.js` properly returns JSON (line 74-78)
- All responses wrapped in `{ success, message, data }` format
- No HTML responses

**Example Response**:
```json
{
  "success": true,
  "message": "Đặt lịch hẹn thành công!",
  "data": { appointment_object }
}
```

---

### ⚠️ Issue 5: POST Request Body Mismatches (Need Investigation)
**Status**: Requires checking specific endpoints

**Common Issues to Check**:

#### A. Test Results POST
**Frontend Service**: `TestResultService.addTestResult()`
**Backend Endpoint**: `/api/test-results-new`
**Backend Controller**: `testResultsController.js`

**Potential Mismatch**: Field names (check if using old column names)

#### B. Patients POST
**Frontend Service**: `PatientService.addPatient()`
**Backend Endpoint**: `/api/patients-new`
**Backend Controller**: `patientsController.js`

**Potential Mismatch**: Missing required fields or wrong field names

#### C. Expenses POST
**Frontend Service**: `ExpenseService.addExpense()`
**Backend Endpoint**: `/api/expenses-new`
**Backend Controller**: `expensesController.js`

**Potential Mismatch**:
- Using `date` instead of `expense_date` ❌
- Using Vietnamese status instead of English ❌

---

## 🛠️ Fixes to Apply

### Fix 1: Update Patient Delete Operations

**File**: `fontend/src/pages/AdminPage/System/Patient_List_Details.jsx`

**Change Line 157**:
```javascript
// Before:
await PatientService.deletePatient(patient.id);

// After:
await PatientService.deletePatient(patient.patient_id);
```

**File**: `fontend/src/pages/AdminPage/Doctor/Individual_Patient_Management.jsx`

**Change Line 97**:
```javascript
// Before:
await PatientService.deletePatient(patient.id);

// After:
await PatientService.deletePatient(patient.patient_id);
```

---

### Fix 2: Verify Backend Patient Response Structure

**File**: `backend/src/controllers/patientsController.js`

**Ensure getAllPatients returns** (already correct):
```javascript
{
  success: true,
  count: number,
  data: [
    {
      patient_id: number,      // ✅ PRIMARY KEY
      patient_code: string,
      user_id: number,
      diagnosis: string,
      full_name: string,       // FROM JOIN
      phone_number: string,    // FROM JOIN
      // ... other fields
    }
  ]
}
```

**Note**: `patient_id` is the correct field name from database schema v2

---

### Fix 3: Check POST Request Bodies

**Need to verify these files send correct data:**

1. **Test Results Forms**: Check if they send v2 schema fields
2. **Patient Forms**: Check if they send all required fields
3. **Expense Forms**: Verify using `expense_date` not `date`

---

## 📋 Backend Route Audit Results

### ✅ All Routes Registered Correctly:

| Route | Endpoint | Status |
|-------|----------|--------|
| Employee | `/api/employee` | ✅ JSON |
| Department | `/api/department` | ✅ JSON |
| Position | `/api/position` | ✅ JSON |
| Account | `/api/account` | ✅ JSON |
| Patients (old) | `/api/patients` | ✅ JSON |
| User Auth | `/api/user-auth` | ✅ JSON |
| User Profile | `/api/user-profile` | ✅ JSON |
| Appointments | `/api/appointments` | ✅ JSON |
| Lab Results | `/api/lab-results` | ✅ JSON |
| Patients (new) | `/api/patients-new` | ✅ JSON |
| Expenses | `/api/expenses-new` | ✅ JSON |
| Funds | `/api/funds-new` | ✅ JSON |
| Insurance | `/api/insurance-new` | ✅ JSON |
| Revenue | `/api/revenue-new` | ✅ JSON |
| Laboratory Tests | `/api/laboratory-tests` | ✅ JSON |
| Test Results | `/api/test-results-new` | ✅ JSON |

**Missing Routes**: NONE
**All controllers return JSON properly** ✅

---

## 🔧 Additional Recommendations

### 1. Add ID Aliases in Backend Responses (Optional)

To prevent future confusion, backend could include both:
```javascript
{
  patient_id: 123,
  id: 123  // Alias for convenience
}
```

**However, this is NOT recommended** as it creates data redundancy. Better to fix frontend references.

### 2. Create Type Definitions (Future Enhancement)

Create TypeScript interfaces or JSDoc types:
```javascript
/**
 * @typedef {Object} Patient
 * @property {number} patient_id - Primary key
 * @property {string} patient_code - Unique patient code
 * @property {number} user_id - Reference to users table
 * @property {string} diagnosis - Patient diagnosis
 * @property {string} full_name - From users table JOIN
 * @property {string} phone_number - From users table JOIN
 */
```

### 3. Add Frontend Validation

Before sending POST requests, validate:
- All required fields present
- Correct field names (match backend expectations)
- Correct data types
- Enum values in English (not Vietnamese)

---

## ✅ Testing Checklist

After applying fixes:

### Patient Operations
- [ ] Test patient list loads correctly
- [ ] Test patient delete with patient_id
- [ ] Test patient edit/update
- [ ] Verify console has no "undefined" errors

### POST Operations
- [ ] Test creating new test result
- [ ] Test creating new patient
- [ ] Test creating new expense
- [ ] Verify 400 errors are resolved

### Other Routes
- [ ] Test appointments load correctly
- [ ] Test salary management (uses employee data)
- [ ] Test revenue and insurance operations
- [ ] Verify all API calls return JSON

---

## 📝 Summary

**Critical Fixes Needed**: 1
- ❌ Patient delete using wrong ID field

**No Action Needed**: 3
- ✅ Salary management (already working)
- ✅ Function names (already correct)
- ✅ Appointments JSON (already correct)

**Needs Investigation**: 1
- ⚠️ POST request body mismatches (check specific forms)

**Overall Assessment**: Minor fixes required, most functionality already working ✅

---

**Created**: 2025-11-24
**Priority**: Medium (1 critical fix for patient delete)
**Estimated Time**: 15-30 minutes

🤖 Generated with [Claude Code](https://claude.com/claude-code)
