-- Migration: Insert sample data for employees and patients
-- Author: Claude
-- Date: 2024-11-18

-- ============================================
-- Insert sample data cho BỆNH NHÂN (users)
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
  ('0908901234', '001234567897', 'Bùi Thị Hương', '1987-12-05', 'Nữ', '258 Võ Văn Tần, Q3, TP.HCM', '258 Võ Văn Tần, Q3, TP.HCM', 'users')
ON CONFLICT (phone_number) DO NOTHING;

-- ============================================
-- Insert sample data cho NHÂN VIÊN (employees)
-- ============================================

INSERT INTO infor_users (employee_id, phone_number, card_id, full_name, date_of_birth, gender, permanent_address, current_address, role_user)
VALUES
  ('0201050607', '0911111111', '002345678901', 'Bác sĩ Nguyễn Văn A', '1985-03-15', 'Nam', '100 Lê Duẩn, Q1, TP.HCM', '100 Lê Duẩn, Q1, TP.HCM', 'employee'),
  ('0201050608', '0922222222', '002345678902', 'Bác sĩ Trần Thị B', '1987-06-20', 'Nữ', '200 Pasteur, Q1, TP.HCM', '200 Pasteur, Q1, TP.HCM', 'employee'),
  ('0201050609', '0933333333', '002345678903', 'Y tá Lê Văn C', '1990-09-10', 'Nam', '300 Cách Mạng Tháng 8, Q3, TP.HCM', '300 Cách Mạng Tháng 8, Q3, TP.HCM', 'employee'),
  ('0201050610', '0944444444', '002345678904', 'Y tá Phạm Thị D', '1992-12-25', 'Nữ', '400 Cộng Hòa, Q10, TP.HCM', '400 Cộng Hòa, Q10, TP.HCM', 'employee'),
  ('0201050611', '0955555555', '002345678905', 'Kế toán Hoàng Văn E', '1988-04-18', 'Nam', '500 Hoàng Sa, Q1, TP.HCM', '500 Hoàng Sa, Q1, TP.HCM', 'employee'),
  ('0201050612', '0966666666', '002345678906', 'Lễ tân Võ Thị F', '1994-07-22', 'Nữ', '600 Trường Sa, Q3, TP.HCM', '600 Trường Sa, Q3, TP.HCM', 'employee')
ON CONFLICT (phone_number) DO NOTHING;

-- ============================================
-- Verify inserted data
-- ============================================

-- Check patients
DO $$
DECLARE
  patient_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO patient_count FROM infor_users WHERE role_user = 'users';
  RAISE NOTICE '✅ Inserted % patients (bệnh nhân)', patient_count;
END $$;

-- Check employees
DO $$
DECLARE
  employee_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO employee_count FROM infor_users WHERE role_user = 'employee';
  RAISE NOTICE '✅ Inserted % employees (nhân viên)', employee_count;
END $$;

-- ============================================
-- Notes:
-- - Password sẽ được tạo khi nhân viên register qua API
-- - Bệnh nhân không cần password (chỉ nhân viên mới đăng nhập)
-- - Có thể thêm nhiều data hơn bằng cách copy pattern trên
-- ============================================
