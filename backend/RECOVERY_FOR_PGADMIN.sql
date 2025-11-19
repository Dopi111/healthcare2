-- ============================================
-- HEALTHCARE DATABASE - QUICK RECOVERY
-- Chạy file này trong pgAdmin 4 để khôi phục database
-- ============================================

-- Hướng dẫn sử dụng trong pgAdmin 4:
-- 1. Mở pgAdmin 4
-- 2. Kết nối tới PostgreSQL server
-- 3. Chọn database "healthcare_db" (hoặc tạo mới nếu chưa có)
-- 4. Tools → Query Tool (hoặc nhấn F5)
-- 5. Copy toàn bộ nội dung file này
-- 6. Paste vào Query Tool
-- 7. Nhấn F5 hoặc nút Execute (▶)
-- 8. Đợi 5-10 giây
-- 9. XONG! Database đã được khôi phục

-- ============================================
-- BƯỚC 1: XÓA TẤT CẢ BẢNG CŨ (NẾU CÓ)
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '🔧 Bắt đầu khôi phục database...';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '⏳ Đang xóa các bảng cũ (nếu có)...';
END $$;

DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS laboratory_tests CASCADE;
DROP TABLE IF EXISTS revenue CASCADE;
DROP TABLE IF EXISTS insurance_claims CASCADE;
DROP TABLE IF EXISTS funds CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS lab_results CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS user_medical_info CASCADE;
DROP TABLE IF EXISTS infor_auth_employee CASCADE;
DROP TABLE IF EXISTS infor_employee CASCADE;
DROP TABLE IF EXISTS infor_users CASCADE;
DROP TABLE IF EXISTS list_position CASCADE;
DROP TABLE IF EXISTS list_department CASCADE;

DO $$
BEGIN
    RAISE NOTICE '✅ Đã xóa các bảng cũ';
    RAISE NOTICE '';
END $$;

-- ============================================
-- BƯỚC 2: TẠO CÁC BẢNG MỚI
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '🏗️  Đang tạo 16 bảng mới...';
END $$;

-- Table 1: Danh sách khoa
CREATE TABLE list_department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Danh sách chức vụ
CREATE TABLE list_position (
    position_id SERIAL PRIMARY KEY,
    position_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: Thông tin users & employees
CREATE TABLE infor_users (
    infor_users_id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    card_id VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255),
    full_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10) DEFAULT 'Nam',
    email VARCHAR(100) UNIQUE,
    position VARCHAR(100),
    department VARCHAR(100),
    specialty VARCHAR(100),
    permanent_address TEXT,
    current_address TEXT,
    role_user VARCHAR(20) DEFAULT 'users',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: Chi tiết nhân viên
CREATE TABLE infor_employee (
    infor_employee_id SERIAL PRIMARY KEY,
    infor_users_id INT REFERENCES infor_users(infor_users_id) ON DELETE CASCADE,
    position_id INT REFERENCES list_position(position_id),
    department_id INT REFERENCES list_department(department_id),
    business TEXT,
    started_date DATE,
    salary NUMERIC(15,2),
    coefficient NUMERIC(5,2),
    attached TEXT,
    status_employee VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 5: Auth nhân viên (legacy)
CREATE TABLE infor_auth_employee (
    infor_auth_employee_id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    password_employee VARCHAR(255) NOT NULL,
    position VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 6: Thông tin y tế user
CREATE TABLE user_medical_info (
    medical_info_id SERIAL PRIMARY KEY,
    infor_users_id INT REFERENCES infor_users(infor_users_id) ON DELETE CASCADE,
    blood_type VARCHAR(10),
    allergies TEXT,
    chronic_diseases TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(15),
    insurance_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 7: Lịch hẹn
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    infor_users_id INT REFERENCES infor_users(infor_users_id),
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(15) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    doctor_name VARCHAR(100),
    department VARCHAR(100),
    reason TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 8: Kết quả xét nghiệm (user)
CREATE TABLE lab_results (
    lab_result_id SERIAL PRIMARY KEY,
    infor_users_id INT REFERENCES infor_users(infor_users_id),
    test_type VARCHAR(100) NOT NULL,
    test_date DATE NOT NULL,
    result_value TEXT,
    unit VARCHAR(50),
    reference_range VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    doctor_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 9: Hồ sơ bệnh nhân ⭐
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    infor_users_id INT REFERENCES infor_users(infor_users_id),
    patient_code VARCHAR(50) UNIQUE NOT NULL,
    doctor_in_charge VARCHAR(100),
    visit_date DATE,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    status VARCHAR(50) DEFAULT 'active',
    follow_up_date DATE,
    medical_history TEXT,
    allergies TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 10: Chi phí ⭐
CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    expense_code VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    amount NUMERIC(15,2) NOT NULL,
    description TEXT,
    approved_by VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Chờ duyệt',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 11: Quỹ tài chính ⭐
CREATE TABLE funds (
    fund_id SERIAL PRIMARY KEY,
    transaction_code VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Thu', 'Chi')),
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    description TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 12: Bảo hiểm ⭐
CREATE TABLE insurance_claims (
    insurance_id SERIAL PRIMARY KEY,
    claim_code VARCHAR(50) UNIQUE NOT NULL,
    patient_id INT REFERENCES patients(patient_id),
    patient_code VARCHAR(50),
    patient_name VARCHAR(100) NOT NULL,
    insurance_card VARCHAR(50),
    insurance_type VARCHAR(100),
    visit_date DATE NOT NULL,
    total_amount NUMERIC(15,2) NOT NULL,
    insurance_covered NUMERIC(15,2) DEFAULT 0,
    patient_pay NUMERIC(15,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Chờ duyệt',
    approved_by VARCHAR(100),
    approved_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 13: Doanh thu ⭐
CREATE TABLE revenue (
    revenue_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    patient_count INT DEFAULT 0,
    revenue_amount NUMERIC(15,2) NOT NULL,
    month VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 14: Xét nghiệm ⭐
CREATE TABLE laboratory_tests (
    lab_test_id SERIAL PRIMARY KEY,
    test_code VARCHAR(50) UNIQUE NOT NULL,
    patient_id INT REFERENCES patients(patient_id),
    patient_code VARCHAR(50),
    patient_name VARCHAR(100) NOT NULL,
    test_type VARCHAR(100) NOT NULL,
    sample_id VARCHAR(50) UNIQUE,
    sample_type VARCHAR(100),
    received_date DATE NOT NULL,
    received_time TIME,
    technician VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Chờ xử lý',
    priority VARCHAR(50) DEFAULT 'Bình thường',
    results JSONB DEFAULT '{}',
    completed_date DATE,
    completed_time TIME,
    verified_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 15: Kết quả test ⭐
CREATE TABLE test_results (
    test_result_id SERIAL PRIMARY KEY,
    test_code VARCHAR(50) NOT NULL,
    patient_id INT REFERENCES patients(patient_id),
    patient_code VARCHAR(50),
    patient_name VARCHAR(100) NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    test_type VARCHAR(100),
    order_date DATE NOT NULL,
    sample_collected_date DATE,
    result_date DATE,
    result_value TEXT,
    unit VARCHAR(50),
    reference_range VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Đang xử lý',
    technician VARCHAR(100),
    doctor VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 16: Accounts
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    role VARCHAR(50) DEFAULT 'staff',
    phone VARCHAR(15),
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
    RAISE NOTICE '✅ Đã tạo 16 bảng thành công';
    RAISE NOTICE '';
END $$;

-- ============================================
-- BƯỚC 3: INSERT DỮ LIỆU MẪU
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '📊 Đang thêm dữ liệu mẫu...';
END $$;

-- Insert 10 khoa
INSERT INTO list_department (department_name) VALUES
('Phòng Hành chính'),
('Khoa Nội'),
('Khoa Ngoại'),
('Khoa Nhi'),
('Khoa Sản'),
('Khoa Răng Hàm Mặt'),
('Khoa Tai Mũi Họng'),
('Khoa Mắt'),
('Khoa Da Liễu'),
('Khoa Chẩn đoán hình ảnh');

-- Insert 10 chức vụ
INSERT INTO list_position (position_name) VALUES
('Giám đốc'),
('Phó giám đốc'),
('Trưởng khoa'),
('Phó khoa'),
('Bác sĩ'),
('Y tá'),
('Dược sĩ'),
('Kỹ thuật viên'),
('Kế toán'),
('Lễ tân');

-- Insert 5 accounts mặc định (passwords đã hash với bcrypt)
-- Password mặc định: admin123, doctor123, nurse123, reception123, accountant123
INSERT INTO accounts (employee_id, password, name, department, position, role, phone, email) VALUES
('admin', '$2b$10$.e0Ee48ieiUXPIci6nh7TuQtUBY0xxeznREJw0BKR55/Ajo0wr3jK', 'Administrator', 'Phòng Hành chính', 'Giám đốc', 'administrator', '0000000001', 'admin@healthcare.com'),
('doctor01', '$2b$10$0O.kXIoxPVhJfgwr.Lmeceh10LCa0j/P013UNrtdTh4K329mmGhUK', 'Bác sĩ Nguyễn Văn A', 'Khoa Nội', 'Bác sĩ', 'doctor', '0000000002', 'doctor01@healthcare.com'),
('nurse01', '$2b$10$/n7pXV3MYC/rBPs0VSrRJO.ZiZ/igg1OViFA0WhjyyGRQfzsN102O', 'Y tá Trần Thị B', 'Khoa Nội', 'Y tá', 'nurse', '0000000003', 'nurse01@healthcare.com'),
('reception01', '$2b$10$HO7fr1svajBaKyfYvBeyiO1MYpd1wuB9Equjw8n2ZGcfFk87QQs26', 'Lễ tân Lê Văn C', 'Phòng Hành chính', 'Lễ tân', 'receptionist', '0000000004', 'reception01@healthcare.com'),
('accountant01', '$2b$10$C/0g1a7iB9/G5moIi5QCc.KLdcuDPZcMkctqEakHOQTKbtwrJu2wa', 'Kế toán Phạm Thị D', 'Phòng Hành chính', 'Kế toán', 'accountant', '0000000005', 'accountant01@healthcare.com');

DO $$
BEGIN
    RAISE NOTICE '✅ Đã thêm dữ liệu mẫu';
    RAISE NOTICE '';
END $$;

-- ============================================
-- BƯỚC 4: TẠO INDEXES
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '🔍 Đang tạo indexes...';
END $$;

-- Core indexes
CREATE INDEX idx_infor_users_employee_id ON infor_users(employee_id);
CREATE INDEX idx_infor_users_phone ON infor_users(phone_number);
CREATE INDEX idx_infor_users_role ON infor_users(role_user);
CREATE INDEX idx_patients_code ON patients(patient_code);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_appointments_date ON appointments(appointment_date DESC);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_laboratory_tests_code ON laboratory_tests(test_code);
CREATE INDEX idx_laboratory_tests_status ON laboratory_tests(status);
CREATE INDEX idx_expenses_date ON expenses(date DESC);
CREATE INDEX idx_funds_date ON funds(date DESC);
CREATE INDEX idx_insurance_claim_code ON insurance_claims(claim_code);
CREATE INDEX idx_revenue_month ON revenue(month);

DO $$
BEGIN
    RAISE NOTICE '✅ Đã tạo indexes';
    RAISE NOTICE '';
END $$;

-- ============================================
-- BƯỚC 5: VERIFY & BÁO CÁO KẾT QUẢ
-- ============================================

DO $$
DECLARE
    table_count INT;
    dept_count INT;
    pos_count INT;
    acc_count INT;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ KHÔI PHỤC DATABASE HOÀN TẤT!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';

    -- Đếm số bảng
    SELECT COUNT(*) INTO table_count
    FROM pg_tables
    WHERE schemaname = 'public';

    -- Đếm dữ liệu mẫu
    SELECT COUNT(*) INTO dept_count FROM list_department;
    SELECT COUNT(*) INTO pos_count FROM list_position;
    SELECT COUNT(*) INTO acc_count FROM accounts;

    RAISE NOTICE '📊 Thống kê:';
    RAISE NOTICE '  - Tổng số bảng: %', table_count;
    RAISE NOTICE '  - Khoa: % bản ghi', dept_count;
    RAISE NOTICE '  - Chức vụ: % bản ghi', pos_count;
    RAISE NOTICE '  - Accounts: % bản ghi', acc_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Tài khoản đăng nhập mặc định:';
    RAISE NOTICE '  👤 Username: admin';
    RAISE NOTICE '  🔑 Password: admin123';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Bước tiếp theo:';
    RAISE NOTICE '  1. Restart backend server: npm run dev';
    RAISE NOTICE '  2. Refresh browser (F5)';
    RAISE NOTICE '  3. Login với admin/admin123';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;

-- Show all tables
SELECT
    tablename as "📋 Tên Bảng",
    CASE
        WHEN tablename IN ('patients', 'test_results', 'laboratory_tests', 'expenses', 'funds', 'insurance_claims', 'revenue')
        THEN '⭐ Quan trọng'
        ELSE '✅ Core'
    END as "Loại"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
