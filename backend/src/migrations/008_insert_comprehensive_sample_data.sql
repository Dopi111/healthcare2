-- ============================================
-- MIGRATION 008: Insert Comprehensive Sample Data
-- Author: Healthcare Management System
-- Date: 2025-11-19
-- Description: Insert sample data for all tables (replacing localStorage data)
-- ============================================

-- ============================================
-- 1. INSERT SAMPLE PATIENTS DATA
-- ============================================

INSERT INTO patients (infor_users_id, patient_code, doctor_in_charge, visit_date, diagnosis, status, medical_history, allergies, notes)
SELECT
  u.infor_users_id,
  'BN001',
  'BS. Nguyễn Văn Anh',
  '2024-11-10',
  'Viêm họng cấp',
  'Đang điều trị',
  'Không có bệnh nền',
  'Không',
  'Bệnh nhân cần tái khám sau 1 tuần'
FROM infor_users u
WHERE u.phone_number = '0901234567'
ON CONFLICT (patient_code) DO NOTHING;

INSERT INTO patients (infor_users_id, patient_code, doctor_in_charge, visit_date, diagnosis, status, medical_history, allergies, notes)
SELECT
  u.infor_users_id,
  'BN002',
  'BS. Trần Thị Bảo',
  '2024-11-12',
  'Cao huyết áp',
  'Tái khám',
  'Đái tháo đường type 2',
  'Penicillin',
  'Theo dõi huyết áp định kỳ'
FROM infor_users u
WHERE u.phone_number = '0902345678'
ON CONFLICT (patient_code) DO NOTHING;

INSERT INTO patients (infor_users_id, patient_code, doctor_in_charge, visit_date, diagnosis, status, medical_history, allergies, notes)
SELECT
  u.infor_users_id,
  'BN003',
  'BS. Lê Văn Cường',
  '2024-11-14',
  'Viêm dạ dày',
  'Hoàn thành',
  'Không',
  'Không',
  'Đã điều trị xong'
FROM infor_users u
WHERE u.phone_number = '0903456789'
ON CONFLICT (patient_code) DO NOTHING;

INSERT INTO patients (infor_users_id, patient_code, doctor_in_charge, visit_date, diagnosis, status, medical_history, allergies, notes)
SELECT
  u.infor_users_id,
  'BN004',
  'BS. Nguyễn Văn Anh',
  '2024-11-15',
  'Cảm cúm',
  'Đang điều trị',
  'Không',
  'Không',
  'Uống thuốc theo đơn'
FROM infor_users u
WHERE u.phone_number = '0904567890'
ON CONFLICT (patient_code) DO NOTHING;

INSERT INTO patients (infor_users_id, patient_code, doctor_in_charge, visit_date, diagnosis, status, medical_history, allergies, notes)
SELECT
  u.infor_users_id,
  'BN005',
  'BS. Trần Thị Bảo',
  '2024-11-16',
  'Viêm phổi',
  'Đang điều trị',
  'Hút thuốc lá',
  'Aspirin',
  'Nhập viện điều trị'
FROM infor_users u
WHERE u.phone_number = '0905678901'
ON CONFLICT (patient_code) DO NOTHING;

-- ============================================
-- 2. INSERT SAMPLE EXPENSES DATA
-- ============================================

INSERT INTO expenses (expense_code, date, category, department, amount, description, approved_by, status) VALUES
('CP001', '2024-11-01', 'Lương', 'Toàn bộ', 50000000, 'Lương tháng 11', 'Giám đốc Nguyễn Văn A', 'Đã chi'),
('CP002', '2024-11-03', 'Thuốc men', 'Khoa Dược', 12000000, 'Mua thuốc và vật tư y tế', 'Trưởng khoa Dược', 'Đã chi'),
('CP003', '2024-11-05', 'Thiết bị', 'Khoa Xét nghiệm', 30000000, 'Mua máy xét nghiệm mới', 'Giám đốc Nguyễn Văn A', 'Đã chi'),
('CP004', '2024-11-07', 'Điện nước', 'Phòng Hành chính', 5000000, 'Tiền điện nước tháng 11', 'Trưởng phòng HC', 'Đã chi'),
('CP005', '2024-11-10', 'Bảo trì', 'Khoa Kỹ thuật', 8000000, 'Bảo trì thiết bị y tế', 'Trưởng khoa Kỹ thuật', 'Chờ duyệt'),
('CP006', '2024-11-12', 'Vệ sinh', 'Phòng Hành chính', 3000000, 'Dịch vụ vệ sinh tháng 11', 'Trưởng phòng HC', 'Đã chi'),
('CP007', '2024-11-14', 'Văn phòng phẩm', 'Phòng Hành chính', 2000000, 'Mua văn phòng phẩm', 'Trưởng phòng HC', 'Đã chi'),
('CP008', '2024-11-15', 'Đào tạo', 'Khoa Nội', 5000000, 'Khóa đào tạo chuyên môn', 'Trưởng khoa Nội', 'Chờ duyệt'),
('CP009', '2024-11-16', 'Sửa chữa', 'Khoa Kỹ thuật', 4000000, 'Sửa chữa hệ thống điều hòa', 'Trưởng khoa Kỹ thuật', 'Đã chi'),
('CP010', '2024-11-17', 'An ninh', 'Phòng Hành chính', 6000000, 'Dịch vụ bảo vệ tháng 11', 'Trưởng phòng HC', 'Đã chi')
ON CONFLICT (expense_code) DO NOTHING;

-- ============================================
-- 3. INSERT SAMPLE FUNDS DATA
-- ============================================

INSERT INTO funds (transaction_code, date, type, category, amount, description, created_by) VALUES
('TXN001', '2024-11-01', 'Thu', 'Khám bệnh', 15000000, 'Thu phí khám bệnh tháng 11', 'KT. Phan Thị Hoa'),
('TXN002', '2024-11-02', 'Thu', 'Xét nghiệm', 8500000, 'Thu phí xét nghiệm', 'KT. Phan Thị Hoa'),
('TXN003', '2024-11-03', 'Chi', 'Thuốc men', 12000000, 'Mua thuốc và vật tư y tế', 'KT. Phan Thị Hoa'),
('TXN004', '2024-11-05', 'Chi', 'Lương', 50000000, 'Lương tháng 11', 'KT. Phan Thị Hoa'),
('TXN005', '2024-11-07', 'Thu', 'Phẫu thuật', 25000000, 'Thu phí phẫu thuật', 'KT. Phan Thị Hoa'),
('TXN006', '2024-11-08', 'Chi', 'Thiết bị', 30000000, 'Mua thiết bị y tế mới', 'KT. Phan Thị Hoa'),
('TXN007', '2024-11-10', 'Thu', 'Nội trú', 18000000, 'Thu viện phí nội trú', 'KT. Phan Thị Hoa'),
('TXN008', '2024-11-12', 'Chi', 'Điện nước', 5000000, 'Tiền điện nước tháng 11', 'KT. Phan Thị Hoa'),
('TXN009', '2024-11-13', 'Thu', 'Khám bệnh', 12000000, 'Thu phí khám bệnh', 'KT. Phan Thị Hoa'),
('TXN010', '2024-11-14', 'Chi', 'Bảo trì', 8000000, 'Bảo trì thiết bị y tế', 'KT. Phan Thị Hoa'),
('TXN011', '2024-11-15', 'Thu', 'Siêu âm', 6000000, 'Thu phí siêu âm', 'KT. Phan Thị Hoa'),
('TXN012', '2024-11-16', 'Thu', 'Xét nghiệm', 9000000, 'Thu phí xét nghiệm', 'KT. Phan Thị Hoa'),
('TXN013', '2024-11-17', 'Chi', 'Vệ sinh', 3000000, 'Dịch vụ vệ sinh', 'KT. Phan Thị Hoa'),
('TXN014', '2024-11-18', 'Thu', 'Chụp X-quang', 4500000, 'Thu phí chụp X-quang', 'KT. Phan Thị Hoa'),
('TXN015', '2024-11-19', 'Thu', 'Nội trú', 22000000, 'Thu viện phí nội trú', 'KT. Phan Thị Hoa')
ON CONFLICT (transaction_code) DO NOTHING;

-- ============================================
-- 4. INSERT SAMPLE INSURANCE DATA
-- ============================================

INSERT INTO insurance_claims (claim_code, patient_id, patient_code, patient_name, insurance_card, insurance_type, visit_date, total_amount, insurance_covered, patient_pay, status, approved_by, approved_date, notes)
SELECT
  'BH001',
  p.patient_id,
  'BN001',
  'Nguyễn Văn An',
  'DN1234567890',
  'BHYT',
  '2024-11-10',
  5000000,
  4000000,
  1000000,
  'Đã duyệt',
  'KT. Phan Thị Hoa',
  '2024-11-11',
  'Đã thanh toán'
FROM patients p
WHERE p.patient_code = 'BN001'
ON CONFLICT (claim_code) DO NOTHING;

INSERT INTO insurance_claims (claim_code, patient_id, patient_code, patient_name, insurance_card, insurance_type, visit_date, total_amount, insurance_covered, patient_pay, status, approved_by, approved_date, notes)
SELECT
  'BH002',
  p.patient_id,
  'BN002',
  'Trần Thị Bích',
  'DN9876543210',
  'BHYT',
  '2024-11-12',
  3500000,
  2800000,
  700000,
  'Chờ duyệt',
  NULL,
  NULL,
  ''
FROM patients p
WHERE p.patient_code = 'BN002'
ON CONFLICT (claim_code) DO NOTHING;

INSERT INTO insurance_claims (claim_code, patient_id, patient_code, patient_name, insurance_card, insurance_type, visit_date, total_amount, insurance_covered, patient_pay, status, approved_by, approved_date, notes)
SELECT
  'BH003',
  p.patient_id,
  'BN003',
  'Lê Văn Cường',
  'DN1122334455',
  'BHTN',
  '2024-11-13',
  8000000,
  6000000,
  2000000,
  'Đã duyệt',
  'KT. Phan Thị Hoa',
  '2024-11-14',
  ''
FROM patients p
WHERE p.patient_code = 'BN003'
ON CONFLICT (claim_code) DO NOTHING;

INSERT INTO insurance_claims (claim_code, patient_id, patient_code, patient_name, insurance_card, insurance_type, visit_date, total_amount, insurance_covered, patient_pay, status, approved_by, approved_date, notes)
SELECT
  'BH004',
  p.patient_id,
  'BN004',
  'Phạm Thị Dung',
  'DN5566778899',
  'BHYT',
  '2024-11-14',
  12000000,
  9600000,
  2400000,
  'Từ chối',
  'KT. Phan Thị Hoa',
  '2024-11-15',
  'Không đủ điều kiện'
FROM patients p
WHERE p.patient_code = 'BN004'
ON CONFLICT (claim_code) DO NOTHING;

-- ============================================
-- 5. INSERT SAMPLE REVENUE DATA
-- ============================================

INSERT INTO revenue (date, category, patient_count, revenue_amount, month) VALUES
('2024-11-01', 'Khám bệnh', 45, 22500000, '2024-11'),
('2024-11-01', 'Xét nghiệm', 30, 15000000, '2024-11'),
('2024-11-01', 'Nội trú', 10, 35000000, '2024-11'),
('2024-11-01', 'Phẫu thuật', 5, 50000000, '2024-11'),
('2024-11-01', 'Siêu âm', 20, 10000000, '2024-11'),
('2024-11-01', 'X-quang', 25, 12500000, '2024-11'),
('2024-10-01', 'Khám bệnh', 42, 21000000, '2024-10'),
('2024-10-01', 'Xét nghiệm', 28, 14000000, '2024-10'),
('2024-10-01', 'Nội trú', 8, 28000000, '2024-10'),
('2024-10-01', 'Phẫu thuật', 6, 60000000, '2024-10'),
('2024-10-01', 'Siêu âm', 18, 9000000, '2024-10'),
('2024-10-01', 'X-quang', 22, 11000000, '2024-10'),
('2024-09-01', 'Khám bệnh', 40, 20000000, '2024-09'),
('2024-09-01', 'Xét nghiệm', 26, 13000000, '2024-09'),
('2024-09-01', 'Nội trú', 7, 24500000, '2024-09'),
('2024-09-01', 'Phẫu thuật', 4, 40000000, '2024-09')
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. INSERT SAMPLE LABORATORY TESTS DATA
-- ============================================

INSERT INTO laboratory_tests (test_code, patient_id, patient_code, patient_name, test_type, sample_id, sample_type, received_date, received_time, technician, status, priority, results, completed_date, completed_time, verified_by, notes)
SELECT
  'LAB001',
  p.patient_id,
  'BN001',
  'Nguyễn Văn An',
  'Xét nghiệm máu tổng quát',
  'MAU001',
  'Máu tĩnh mạch',
  '2024-11-14',
  '08:30',
  'KTV. Ngô Văn Khải',
  'Hoàn thành',
  'Bình thường',
  '{"WBC (Bạch cầu)": {"value": "7.2", "unit": "x10³/µL", "range": "4.0-11.0", "normal": true}, "RBC (Hồng cầu)": {"value": "4.8", "unit": "x10⁶/µL", "range": "4.5-5.5", "normal": true}, "HGB (Hemoglobin)": {"value": "14.5", "unit": "g/dL", "range": "13.5-17.5", "normal": true}, "PLT (Tiểu cầu)": {"value": "250", "unit": "x10³/µL", "range": "150-400", "normal": true}}'::jsonb,
  '2024-11-14',
  '10:30',
  'BS. Nguyễn Văn Anh',
  'Tất cả chỉ số trong giới hạn bình thường'
FROM patients p
WHERE p.patient_code = 'BN001'
ON CONFLICT (test_code) DO NOTHING;

INSERT INTO laboratory_tests (test_code, patient_id, patient_code, patient_name, test_type, sample_id, sample_type, received_date, received_time, technician, status, priority, results, notes)
SELECT
  'LAB002',
  p.patient_id,
  'BN002',
  'Trần Thị Bích',
  'Xét nghiệm sinh hóa',
  'MAU002',
  'Máu tĩnh mạch',
  '2024-11-14',
  '09:15',
  'KTV. Ngô Văn Khải',
  'Đang xét nghiệm',
  'Cấp tốc',
  '{"Glucose": {"value": "126", "unit": "mg/dL", "range": "70-100", "normal": false}, "Creatinine": {"value": "1.1", "unit": "mg/dL", "range": "0.7-1.3", "normal": true}, "ALT": {"value": "28", "unit": "U/L", "range": "0-40", "normal": true}, "AST": {"value": "32", "unit": "U/L", "range": "0-40", "normal": true}}'::jsonb,
  'Đang tiến hành xét nghiệm'
FROM patients p
WHERE p.patient_code = 'BN002'
ON CONFLICT (test_code) DO NOTHING;

INSERT INTO laboratory_tests (test_code, patient_id, patient_code, patient_name, test_type, sample_id, sample_type, received_date, received_time, technician, status, priority, results, notes)
SELECT
  'LAB003',
  p.patient_id,
  'BN003',
  'Lê Văn Cường',
  'Xét nghiệm nước tiểu',
  'MAU003',
  'Nước tiểu',
  '2024-11-15',
  '07:45',
  'KTV. Ngô Văn Khải',
  'Chờ xử lý',
  'Bình thường',
  '{}'::jsonb,
  'Mẫu đã nhận, chờ xử lý'
FROM patients p
WHERE p.patient_code = 'BN003'
ON CONFLICT (test_code) DO NOTHING;

INSERT INTO laboratory_tests (test_code, patient_id, patient_code, patient_name, test_type, sample_id, sample_type, received_date, received_time, technician, status, priority, results, notes)
SELECT
  'LAB004',
  p.patient_id,
  'BN004',
  'Phạm Thị Dung',
  'Xét nghiệm vi sinh',
  'MAU004',
  'Đờm',
  '2024-11-15',
  '08:00',
  'KTV. Ngô Văn Khải',
  'Đang xét nghiệm',
  'Cấp tốc',
  '{"Vi khuẩn": {"value": "Dương tính", "unit": "", "range": "Âm tính", "normal": false}, "Nấm": {"value": "Âm tính", "unit": "", "range": "Âm tính", "normal": true}}'::jsonb,
  'Đang nuôi cấy vi khuẩn'
FROM patients p
WHERE p.patient_code = 'BN004'
ON CONFLICT (test_code) DO NOTHING;

INSERT INTO laboratory_tests (test_code, patient_id, patient_code, patient_name, test_type, sample_id, sample_type, received_date, received_time, technician, status, priority, results, completed_date, completed_time, verified_by, notes)
SELECT
  'LAB005',
  p.patient_id,
  'BN001',
  'Nguyễn Văn An',
  'Xét nghiệm đông máu',
  'MAU005',
  'Máu tĩnh mạch',
  '2024-11-15',
  '09:30',
  'KTV. Ngô Văn Khải',
  'Hoàn thành',
  'Bình thường',
  '{"PT (Prothrombin Time)": {"value": "12.5", "unit": "giây", "range": "11-13.5", "normal": true}, "INR": {"value": "1.0", "unit": "", "range": "0.8-1.2", "normal": true}, "APTT": {"value": "32", "unit": "giây", "range": "25-35", "normal": true}}'::jsonb,
  '2024-11-15',
  '11:00',
  'BS. Trần Thị Bảo',
  'Chức năng đông máu bình thường'
FROM patients p
WHERE p.patient_code = 'BN001'
ON CONFLICT (test_code) DO NOTHING;

-- ============================================
-- 7. INSERT SAMPLE TEST RESULTS DATA
-- ============================================

INSERT INTO test_results (test_code, patient_id, patient_code, patient_name, test_type, doctor_order, order_date, sample_date, result_date, status, priority, results, notes)
SELECT
  'PXN001',
  p.patient_id,
  'BN001',
  'Nguyễn Văn An',
  'Xét nghiệm máu tổng quát',
  'BS. Nguyễn Văn Anh',
  '2024-11-10',
  '2024-11-10',
  '2024-11-11',
  'Hoàn thành',
  'Bình thường',
  '{"Hồng cầu": "4.8 triệu/µL", "Bạch cầu": "7.2 nghìn/µL", "Tiểu cầu": "250 nghìn/µL", "Hemoglobin": "14.5 g/dL"}'::jsonb,
  'Các chỉ số trong giới hạn bình thường'
FROM patients p
WHERE p.patient_code = 'BN001'
ON CONFLICT (test_code) DO NOTHING;

INSERT INTO test_results (test_code, patient_id, patient_code, patient_name, test_type, doctor_order, order_date, sample_date, result_date, status, priority, results, notes)
SELECT
  'PXN002',
  p.patient_id,
  'BN002',
  'Trần Thị Bích',
  'Xét nghiệm đường huyết',
  'BS. Trần Thị Bảo',
  '2024-11-12',
  '2024-11-12',
  '2024-11-12',
  'Hoàn thành',
  'Cấp tốc',
  '{"Glucose lúc đói": "126 mg/dL", "HbA1c": "7.2%"}'::jsonb,
  'Glucose cao, cần theo dõi'
FROM patients p
WHERE p.patient_code = 'BN002'
ON CONFLICT (test_code) DO NOTHING;

INSERT INTO test_results (test_code, patient_id, patient_code, patient_name, test_type, doctor_order, order_date, sample_date, status, priority, results, notes)
SELECT
  'PXN003',
  p.patient_id,
  'BN003',
  'Lê Văn Cường',
  'Xét nghiệm gan',
  'BS. Lê Văn Cường',
  '2024-11-14',
  '2024-11-14',
  'Đang xử lý',
  'Bình thường',
  '{}'::jsonb,
  'Chờ kết quả'
FROM patients p
WHERE p.patient_code = 'BN003'
ON CONFLICT (test_code) DO NOTHING;

-- ============================================
-- 8. VERIFICATION & SUMMARY
-- ============================================

DO $$
DECLARE
  patient_count INTEGER;
  expense_count INTEGER;
  fund_count INTEGER;
  insurance_count INTEGER;
  revenue_count INTEGER;
  lab_test_count INTEGER;
  test_result_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO patient_count FROM patients;
  SELECT COUNT(*) INTO expense_count FROM expenses;
  SELECT COUNT(*) INTO fund_count FROM funds;
  SELECT COUNT(*) INTO insurance_count FROM insurance_claims;
  SELECT COUNT(*) INTO revenue_count FROM revenue;
  SELECT COUNT(*) INTO lab_test_count FROM laboratory_tests;
  SELECT COUNT(*) INTO test_result_count FROM test_results;

  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ MIGRATION 008 COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🏥 Patients: %', patient_count;
  RAISE NOTICE '💰 Expenses: %', expense_count;
  RAISE NOTICE '💵 Funds: %', fund_count;
  RAISE NOTICE '🏥 Insurance Claims: %', insurance_count;
  RAISE NOTICE '📊 Revenue Records: %', revenue_count;
  RAISE NOTICE '🔬 Laboratory Tests: %', lab_test_count;
  RAISE NOTICE '📋 Test Results: %', test_result_count;
  RAISE NOTICE '========================================';
  RAISE NOTICE '✨ All sample data inserted successfully!';
  RAISE NOTICE '========================================';
END $$;

-- ============================================
-- END OF MIGRATION 008
-- ============================================
