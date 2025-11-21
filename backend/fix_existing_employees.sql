-- Fix for existing employees that are missing infor_employee records
-- This script creates infor_employee records for all users with role_user='employee'
-- who don't have a corresponding infor_employee entry

INSERT INTO infor_employee (infor_users_id, position_id, department_id, status_employee)
SELECT
    u.infor_users_id,
    -- Try to find position_id from position name stored in infor_users
    (SELECT p.position_id FROM list_position p WHERE p.position_name = u.position LIMIT 1),
    -- Try to find department_id from department name stored in infor_users
    (SELECT d.department_id FROM list_department d WHERE d.department_name = u.department LIMIT 1),
    'active' as status_employee
FROM infor_users u
WHERE u.role_user = 'employee'
  AND NOT EXISTS (
    SELECT 1 FROM infor_employee e
    WHERE e.infor_users_id = u.infor_users_id
  );

-- Show results
SELECT
    u.employee_id,
    u.full_name,
    e.infor_employee_id,
    p.position_name,
    d.department_name,
    e.status_employee
FROM infor_users u
LEFT JOIN infor_employee e ON u.infor_users_id = e.infor_users_id
LEFT JOIN list_position p ON e.position_id = p.position_id
LEFT JOIN list_department d ON e.department_id = d.department_id
WHERE u.role_user = 'employee'
ORDER BY u.employee_id;
