-- ============================================
-- DATABASE VERIFICATION SCRIPT
-- Author: Healthcare Management System
-- Date: 2025-11-19
-- Description: Verify all tables and data exist correctly
-- ============================================

\echo '============================================'
\echo 'DATABASE VERIFICATION'
\echo '============================================'
\echo ''

-- Check all tables exist
\echo 'Checking tables...'
\echo ''

SELECT
  'Table: ' || table_name as table_info,
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tables.table_name)
    THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM (VALUES
  ('list_department'),
  ('list_position'),
  ('infor_users'),
  ('infor_employee'),
  ('infor_auth_employee'),
  ('user_medical_info'),
  ('appointments'),
  ('lab_results'),
  ('patients'),
  ('expenses'),
  ('funds'),
  ('insurance_claims'),
  ('revenue'),
  ('laboratory_tests'),
  ('test_results'),
  ('accounts')
) AS tables(table_name);

\echo ''
\echo '--------------------------------------------'
\echo 'Checking data counts...'
\echo ''

-- Check data counts
SELECT 'Departments: ' || COUNT(*) FROM list_department;
SELECT 'Positions: ' || COUNT(*) FROM list_position;
SELECT 'Users: ' || COUNT(*) FROM infor_users;
SELECT 'Employees: ' || COUNT(*) FROM infor_employee;
SELECT 'Accounts: ' || COUNT(*) FROM accounts;
SELECT 'Patients: ' || COUNT(*) FROM patients;

\echo ''
\echo '--------------------------------------------'
\echo 'Checking accounts table structure...'
\echo ''

\d accounts

\echo ''
\echo '--------------------------------------------'
\echo 'Listing default accounts...'
\echo ''

SELECT
  id,
  employee_id,
  name,
  role,
  status
FROM accounts
ORDER BY id;

\echo ''
\echo '--------------------------------------------'
\echo 'Testing login query...'
\echo ''

SELECT
  'Login test for admin: ' ||
  CASE
    WHEN EXISTS (SELECT 1 FROM accounts WHERE employee_id = 'admin' AND password = 'admin123')
    THEN '✅ SUCCESS'
    ELSE '❌ FAILED'
  END as test_result;

\echo ''
\echo '============================================'
\echo 'VERIFICATION COMPLETE'
\echo '============================================'
