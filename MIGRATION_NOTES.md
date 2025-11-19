# Migration Notes

## Required Migration: 006_add_employee_fields.sql

Before using the new employee and user management features, you need to run migration `006_add_employee_fields.sql` to add the required database fields.

### What does this migration do?

This migration adds the following columns to the `infor_users` table:
- `email` - Email address for employees and users
- `position` - Job position/title (e.g., Bác sĩ, Y tá, KTV)
- `department` - Department name (e.g., Khoa nội, Khoa ngoại)
- `specialty` - Medical specialty (e.g., Tim mạch, Tiêu hóa)

### How to run the migration

#### Option 1: Using psql (recommended)
```bash
cd backend
psql -U postgres -d healthcare -f src/migrations/006_add_employee_fields.sql
```

#### Option 2: Using Node.js migration script
```bash
cd backend
node scripts/run-migration.js 006_add_employee_fields.sql
```

#### Option 3: Manual SQL execution
Connect to your PostgreSQL database and execute the SQL in `backend/src/migrations/006_add_employee_fields.sql`

### After running the migration

Once the migration is complete, the following features will work:
- ✅ Employee Management - Create, edit, delete employees with full data
- ✅ User Management - Delete users
- ✅ Full employee profile management including email, position, department, specialty

### New API Endpoints

**Employee Management:**
- `POST /api/employee/create` - Create employee with full data
- `PUT /api/employee/update-full/:employee_id` - Update employee with full data
- `DELETE /api/employee/delete/:employee_id` - Delete employee
- `DELETE /api/employee/delete-user/:user_id` - Delete user

**Updated Endpoints:**
- `GET /api/employee/list-employee` - Now includes email, position, department, specialty fields

---

**Migration created on:** 2025-11-19
