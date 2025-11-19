-- ============================================
-- SAMPLE DATA INSERTION SCRIPT
-- Author: Healthcare Management System
-- Date: 2024-11-18
-- Description: Insert sample data for testing
-- ============================================

-- ============================================
-- 1. INSERT SAMPLE PATIENTS (Bệnh nhân)
-- ============================================

INSERT INTO infor_users (phone_number, card_id, full_name, date_of_birth, gender, permanent_address, current_address, role_user)
VALUES
  ('0901234567', '001234567890', 'Nguyễn Văn An', '1990-05-15', 'Nam', '123 Lê Lợi, Q1, TP.HCM', '123 Lê Lợi, Q1, TP.HCM', 'users'),
  ('0902345678', '001234567891', 'Trần Thị Bích', '1985-08-20', 'Nữ', '456 Nguyễn Huệ, Q1, TP.HCM', '456 Nguyễn Huệ, Q1, TP.HCM', 'users'),
  ('0903456789', '001234567892', 'Lê Văn Cường', '1992-03-10', 'Nam', '789 Hai Bà Trưng, Q3, TP.HCM', '789 Hai Bà Trưng, Q3, TP.HCM', 'users'),
  ('0904567890', '001234567893', 'Phạm Thị Dung', '1995-11-25', 'Nữ', '321 Điện Biên Phủ, Q3, TP.HCM', '321 Điện Biên Phủ, Q3, TP.HCM', 'users'),
  ('0905678901', '001234567894', 'Hoàng Văn Em', '1988-07-18', 'Nam', '654 Lý Thường Kiệt, Q10, TP.HCM', '654 Lý Thường Kiệt, Q10, TP.HCM', 'users'),
  ('0906789012', '001234567895', 'Võ Thị Phương', '1993-02-14', 'Nữ', '987 Trần Hưng Đạo, Q5, TP.HCM', '987 Trần Hưng Đạo, Q5, TP.HCM', 'users'),
  ('0907890123', '001234567896', 'Đặng Văn Giang', '1991-09-30', 'Nam', '147 Nguyễn Thị Minh Khai, Q1, TP.HCM', '147 Nguyễn Thị Minh Khai, Q1, TP.HCM', 'users'),
  ('0908901234', '001234567897', 'Bùi Thị Hương', '1987-12-05', 'Nữ', '258 Võ Văn Tần, Q3, TP.HCM', '258 Võ Văn Tần, Q3, TP.HCM', 'users'),
  ('0909012345', '001234567898', 'Phan Văn Khánh', '1994-04-22', 'Nam', '369 Pasteur, Q3, TP.HCM', '369 Pasteur, Q3, TP.HCM', 'users'),
  ('0910123456', '001234567899', 'Ngô Thị Lan', '1989-06-17', 'Nữ', '741 Cách Mạng Tháng 8, Q10, TP.HCM', '741 Cách Mạng Tháng 8, Q10, TP.HCM', 'users'),
  ('0911234567', '001234567800', 'Mai Văn Minh', '1996-01-08', 'Nam', '852 Nguyễn Đình Chiểu, Q1, TP.HCM', '852 Nguyễn Đình Chiểu, Q1, TP.HCM', 'users'),
  ('0912345678', '001234567801', 'Đỗ Thị Nga', '1986-10-12', 'Nữ', '963 Lê Văn Sỹ, Q3, TP.HCM', '963 Lê Văn Sỹ, Q3, TP.HCM', 'users')
ON CONFLICT (phone_number) DO NOTHING;

-- ============================================
-- 2. INSERT SAMPLE EMPLOYEES (Nhân viên)
-- Password mặc định: "123456" (đã hash với bcrypt)
-- ============================================

INSERT INTO infor_users (employee_id, phone_number, card_id, password, full_name, date_of_birth, gender, permanent_address, current_address, role_user)
VALUES
  -- Bác sĩ
  ('0201050607', '0911111111', '002345678901', '$2a$10$YourHashedPasswordHere1', 'BS. Nguyễn Văn Anh', '1985-03-15', 'Nam', '100 Lê Duẩn, Q1, TP.HCM', '100 Lê Duẩn, Q1, TP.HCM', 'employee'),
  ('0201050608', '0922222222', '002345678902', '$2a$10$YourHashedPasswordHere2', 'BS. Trần Thị Bảo', '1987-06-20', 'Nữ', '200 Pasteur, Q1, TP.HCM', '200 Pasteur, Q1, TP.HCM', 'employee'),
  ('0201050609', '0933333333', '002345678903', 'BS. Lê Văn Cường', '1982-09-10', 'Nam', '300 Cách Mạng Tháng 8, Q3, TP.HCM', '300 Cách Mạng Tháng 8, Q3, TP.HCM', 'employee'),

  -- Y tá
  ('0201050610', '0944444444', '002345678904', '$2a$10$YourHashedPasswordHere4', 'YT. Phạm Thị Duyên', '1992-12-25', 'Nữ', '400 Cộng Hòa, Q10, TP.HCM', '400 Cộng Hòa, Q10, TP.HCM', 'employee'),
  ('0201050611', '0955555555', '002345678905', '$2a$10$YourHashedPasswordHere5', 'YT. Hoàng Văn Em', '1990-04-18', 'Nam', '500 Hoàng Sa, Q1, TP.HCM', '500 Hoàng Sa, Q1, TP.HCM', 'employee'),
  ('0201050612', '0966666666', '002345678906', '$2a$10$YourHashedPasswordHere6', 'YT. Võ Thị Phương', '1994-07-22', 'Nữ', '600 Trường Sa, Q3, TP.HCM', '600 Trường Sa, Q3, TP.HCM', 'employee'),

  -- Lễ tân
  ('0201050613', '0977777777', '002345678907', '$2a$10$YourHashedPasswordHere7', 'Đặng Thị Giang', '1995-02-14', 'Nữ', '700 Điện Biên Phủ, Q1, TP.HCM', '700 Điện Biên Phủ, Q1, TP.HCM', 'employee'),
  ('0201050614', '0988888888', '002345678908', '$2a$10$YourHashedPasswordHere8', 'Bùi Văn Hùng', '1993-08-30', 'Nam', '800 Nguyễn Văn Linh, Q7, TP.HCM', '800 Nguyễn Văn Linh, Q7, TP.HCM', 'employee'),

  -- Kế toán
  ('0201050615', '0999999999', '002345678909', '$2a$10$YourHashedPasswordHere9', 'Phan Thị Hoa', '1988-11-05', 'Nữ', '900 Lý Thường Kiệt, Q10, TP.HCM', '900 Lý Thường Kiệt, Q10, TP.HCM', 'employee'),

  -- Kỹ thuật viên
  ('0201050616', '0900000000', '002345678910', '$2a$10$YourHashedPasswordHere10', 'Ngô Văn Khải', '1989-05-20', 'Nam', '1000 Trần Hưng Đạo, Q5, TP.HCM', '1000 Trần Hưng Đạo, Q5, TP.HCM', 'employee')
ON CONFLICT (phone_number) DO NOTHING;

-- ============================================
-- 3. INSERT EMPLOYEE DETAILS (Chi tiết nhân viên)
-- ============================================

-- Get IDs and insert employee details
INSERT INTO infor_employee (infor_users_id, position_id, department_id, business, started_date, salary, coefficient, status_employee)
SELECT
  u.infor_users_id,
  (SELECT position_id FROM list_position WHERE position_name = 'Bác sĩ'),
  (SELECT department_id FROM list_department WHERE department_name = 'Khoa Nội'),
  'Khám và điều trị bệnh lý nội khoa',
  '2020-01-15',
  25000000,
  2.5,
  'active'
FROM infor_users u
WHERE u.employee_id = '0201050607'
ON CONFLICT DO NOTHING;

INSERT INTO infor_employee (infor_users_id, position_id, department_id, business, started_date, salary, coefficient, status_employee)
SELECT
  u.infor_users_id,
  (SELECT position_id FROM list_position WHERE position_name = 'Bác sĩ'),
  (SELECT department_id FROM list_department WHERE department_name = 'Khoa Ngoại'),
  'Phẫu thuật và điều trị ngoại khoa',
  '2019-06-20',
  28000000,
  2.8,
  'active'
FROM infor_users u
WHERE u.employee_id = '0201050608'
ON CONFLICT DO NOTHING;

INSERT INTO infor_employee (infor_users_id, position_id, department_id, business, started_date, salary, coefficient, status_employee)
SELECT
  u.infor_users_id,
  (SELECT position_id FROM list_position WHERE position_name = 'Bác sĩ trưởng khoa'),
  (SELECT department_id FROM list_department WHERE department_name = 'Khoa Nhi'),
  'Quản lý và điều trị khoa nhi',
  '2018-03-10',
  35000000,
  3.5,
  'active'
FROM infor_users u
WHERE u.employee_id = '0201050609'
ON CONFLICT DO NOTHING;

INSERT INTO infor_employee (infor_users_id, position_id, department_id, business, started_date, salary, coefficient, status_employee)
SELECT
  u.infor_users_id,
  (SELECT position_id FROM list_position WHERE position_name = 'Y tá'),
  (SELECT department_id FROM list_department WHERE department_name = 'Khoa Nội'),
  'Chăm sóc và điều dưỡng bệnh nhân',
  '2021-01-12',
  12000000,
  1.2,
  'active'
FROM infor_users u
WHERE u.employee_id = '0201050610'
ON CONFLICT DO NOTHING;

INSERT INTO infor_employee (infor_users_id, position_id, department_id, business, started_date, salary, coefficient, status_employee)
SELECT
  u.infor_users_id,
  (SELECT position_id FROM list_position WHERE position_name = 'Y tá'),
  (SELECT department_id FROM list_department WHERE department_name = 'Khoa Cấp cứu'),
  'Y tá cấp cứu',
  '2020-09-18',
  13000000,
  1.3,
  'active'
FROM infor_users u
WHERE u.employee_id = '0201050611'
ON CONFLICT DO NOTHING;

INSERT INTO infor_employee (infor_users_id, position_id, department_id, business, started_date, salary, coefficient, status_employee)
SELECT
  u.infor_users_id,
  (SELECT position_id FROM list_position WHERE position_name = 'Y tá trưởng'),
  (SELECT department_id FROM list_department WHERE department_name = 'Khoa Ngoại'),
  'Quản lý nhóm điều dưỡng',
  '2019-07-22',
  15000000,
  1.5,
  'active'
FROM infor_users u
WHERE u.employee_id = '0201050612'
ON CONFLICT DO NOTHING;

INSERT INTO infor_employee (infor_users_id, position_id, department_id, business, started_date, salary, coefficient, status_employee)
SELECT
  u.infor_users_id,
  (SELECT position_id FROM list_position WHERE position_name = 'Lễ tân'),
  (SELECT department_id FROM list_department WHERE department_name = 'Tiếp tân'),
  'Tiếp nhận và hỗ trợ bệnh nhân',
  '2022-02-14',
  9000000,
  0.9,
  'active'
FROM infor_users u
WHERE u.employee_id = '0201050613'
ON CONFLICT DO NOTHING;

INSERT INTO infor_employee (infor_users_id, position_id, department_id, business, started_date, salary, coefficient, status_employee)
SELECT
  u.infor_users_id,
  (SELECT position_id FROM list_position WHERE position_name = 'Lễ tân'),
  (SELECT department_id FROM list_department WHERE department_name = 'Tiếp tân'),
  'Tiếp nhận và hỗ trợ bệnh nhân',
  '2021-08-30',
  9000000,
  0.9,
  'active'
FROM infor_users u
WHERE u.employee_id = '0201050614'
ON CONFLICT DO NOTHING;

INSERT INTO infor_employee (infor_users_id, position_id, department_id, business, started_date, salary, coefficient, status_employee)
SELECT
  u.infor_users_id,
  (SELECT position_id FROM list_position WHERE position_name = 'Kế toán'),
  (SELECT department_id FROM list_department WHERE department_name = 'Phòng Kế toán'),
  'Quản lý tài chính bệnh viện',
  '2020-11-05',
  14000000,
  1.4,
  'active'
FROM infor_users u
WHERE u.employee_id = '0201050615'
ON CONFLICT DO NOTHING;

INSERT INTO infor_employee (infor_users_id, position_id, department_id, business, started_date, salary, coefficient, status_employee)
SELECT
  u.infor_users_id,
  (SELECT position_id FROM list_position WHERE position_name = 'Kỹ thuật viên'),
  (SELECT department_id FROM list_department WHERE department_name = 'Khoa Xét nghiệm'),
  'Xét nghiệm y học',
  '2021-05-20',
  11000000,
  1.1,
  'active'
FROM infor_users u
WHERE u.employee_id = '0201050616'
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. VERIFICATION & SUMMARY
-- ============================================

DO $$
DECLARE
  patient_count INTEGER;
  employee_count INTEGER;
  employee_detail_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO patient_count FROM infor_users WHERE role_user = 'users';
  SELECT COUNT(*) INTO employee_count FROM infor_users WHERE role_user = 'employee';
  SELECT COUNT(*) INTO employee_detail_count FROM infor_employee;

  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SAMPLE DATA INSERTION COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '📋 Patients (Bệnh nhân): %', patient_count;
  RAISE NOTICE '👨‍⚕️ Employees (Nhân viên): %', employee_count;
  RAISE NOTICE '📊 Employee Details: %', employee_detail_count;
  RAISE NOTICE '========================================';
  RAISE NOTICE '🔑 Default password for all employees: 123456';
  RAISE NOTICE '   (Password needs to be properly hashed in production)';
  RAISE NOTICE '========================================';
END $$;

-- ============================================
-- NOTES:
-- ============================================
-- 1. Passwords are placeholders - use registerEmployee API to create accounts with properly hashed passwords
-- 2. You can add more sample data by copying the INSERT patterns above
-- 3. All phone numbers are 10 digits, card_id are 12 digits
-- 4. All employees have 10-digit employee_id
-- ============================================
