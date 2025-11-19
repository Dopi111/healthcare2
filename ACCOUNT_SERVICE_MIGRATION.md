# Account Service Migration from localStorage to PostgreSQL

## Overview
This document describes the migration of the Account Service from localStorage-based authentication to PostgreSQL database.

## Changes Made

### 1. Database Migration
**File**: `backend/src/migrations/009_create_accounts_table.sql`

Created new `accounts` table with the following schema:
- `id` (SERIAL PRIMARY KEY)
- `employeeId` (VARCHAR UNIQUE) - Employee ID for login
- `password` (VARCHAR) - Password (plain text for now, should be hashed in production)
- `name` (VARCHAR) - Full name
- `department` (VARCHAR) - Department name
- `position` (VARCHAR) - Job position
- `role` (VARCHAR) - User role (administrator, doctor, nurse, receptionist, accountant)
- `phone` (VARCHAR) - Phone number
- `email` (VARCHAR UNIQUE) - Email address
- `status` (VARCHAR) - Account status (active/inactive)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Default accounts** inserted:
1. Admin: `admin` / `admin123`
2. Doctor: `doctor01` / `doctor123`
3. Nurse: `nurse01` / `nurse123`
4. Receptionist: `reception01` / `reception123`
5. Accountant: `accountant01` / `accountant123`

### 2. Frontend Service Migration
**File**: `fontend/src/services/AccountService.js`

**Before**:
- Used localStorage to store/retrieve account data
- Synchronous methods
- All operations were local

**After**:
- Uses API calls to PostgreSQL backend
- Asynchronous methods (async/await)
- All operations go through REST API

**Key API Endpoints**:
- `GET /api/account` - Get all accounts
- `GET /api/account/:id` - Get account by ID
- `POST /api/account` - Create new account
- `PUT /api/account/:id` - Update account
- `DELETE /api/account/:id` - Delete account
- `POST /api/account/login` - Authenticate user

### 3. Updated Components

#### Login Page
**File**: `fontend/src/pages/AdminPage/auth/Login_E.jsx`

Changes:
- Updated `handleLogin` to use async/await
- Updated `useEffect` to load demo accounts asynchronously
- Added error handling for API failures
- Maintained backward compatibility with field names (employeeid vs employeeId)

#### Accounts Management
**File**: `fontend/src/pages/AdminPage/Adminstator/Accounts_Management.jsx`

Changes:
- Updated `loadAccounts()` to async
- Updated `handleDelete()` to async
- Updated `handleSubmit()` to async
- Updated `handleExport()` to async
- Disabled `handleResetDefault()` (not compatible with PostgreSQL)
- Added field name compatibility (employeeid vs employeeId)

### 4. Backend Routes
**File**: `backend/src/routes/accountRoutes.js` (already exists)

Available endpoints:
- CRUD operations for accounts
- Login authentication
- Password validation

## Migration Steps

### Step 1: Run Database Migration
```bash
cd backend
psql -U postgres -d healthcare_db -f src/migrations/009_create_accounts_table.sql
```

Or through your database client:
```sql
-- Copy and execute the content of 009_create_accounts_table.sql
```

### Step 2: Verify Database
```sql
-- Check if table was created
SELECT * FROM accounts;

-- Should show 5 default accounts
```

### Step 3: Update Environment Variables
Make sure your `.env` file in backend has:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### Step 4: Restart Backend Server
```bash
cd backend
npm run dev
```

### Step 5: Test Frontend
```bash
cd fontend
npm run dev
```

### Step 6: Verify Login
1. Open `http://localhost:5173/Admin/auth/login`
2. Try logging in with: `admin` / `admin123`
3. Verify successful login and redirect to dashboard

## API Testing

Test the endpoints using curl or Postman:

### Get All Accounts
```bash
curl http://localhost:5001/api/account
```

### Login
```bash
curl -X POST http://localhost:5001/api/account/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"admin","password":"admin123"}'
```

### Create Account
```bash
curl -X POST http://localhost:5001/api/account \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId":"test01",
    "password":"test123",
    "name":"Test User",
    "role":"doctor",
    "department":"Test Department",
    "position":"Test Position",
    "status":"active"
  }'
```

## Breaking Changes

### 1. Synchronous to Asynchronous
**Before**:
```javascript
const accounts = AccountService.getAllAccounts();
```

**After**:
```javascript
const accounts = await AccountService.getAllAccounts();
```

### 2. Field Names
PostgreSQL returns lowercase field names by default:
- `employeeId` → `employeeid`
- All code updated to handle both naming conventions

### 3. Reset to Default
The `resetToDefault()` function is disabled when using PostgreSQL. To reset:
```sql
TRUNCATE accounts RESTART IDENTITY CASCADE;
-- Then re-run the INSERT statements from migration file
```

## Security Considerations

### Current Implementation (Development)
- Passwords stored in **plain text**
- No JWT token generation
- Basic authentication only

### TODO for Production
1. **Hash passwords** using bcrypt:
   ```javascript
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Generate JWT tokens** on login:
   ```javascript
   const token = jwt.sign({ employeeId, role }, SECRET_KEY, { expiresIn: '24h' });
   ```

3. **Add authentication middleware** to protect routes

4. **Implement password reset** functionality

5. **Add password complexity** validation

## Rollback Plan

If you need to rollback to localStorage:

1. Revert `AccountService.js`:
   ```bash
   git checkout fontend/src/services/old_localStorage_backup/AccountService.js
   ```

2. Update imports in components

3. Drop accounts table:
   ```sql
   DROP TABLE IF EXISTS accounts CASCADE;
   ```

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] Default accounts are created
- [ ] Login with admin works
- [ ] Login with doctor01 works
- [ ] Can create new account
- [ ] Can update existing account
- [ ] Can delete account (except admin)
- [ ] Can export accounts to JSON
- [ ] Search/filter works in Accounts Management
- [ ] Field names are compatible (employeeid/employeeId)

## Notes

1. **Database naming**: PostgreSQL converts unquoted identifiers to lowercase. Our code handles both cases.

2. **Password security**: In production, passwords MUST be hashed. Current implementation is for development only.

3. **API URL**: Make sure `VITE_API_URL` in `fontend/.env` points to the correct backend.

4. **Backward compatibility**: Code maintains compatibility with both localStorage and API naming conventions during transition.

## Support

If you encounter issues:
1. Check backend logs: `backend/logs/`
2. Check browser console for frontend errors
3. Verify database connection
4. Ensure all migrations are run in order
5. Check API is accessible at `http://localhost:5001/api/account`
