-- Migration: Create all healthcare management tables
-- Author: Claude
-- Date: 2024-11-16

-- ============================================
-- 1. Laboratory Tests Table (Xét nghiệm)
-- ============================================
CREATE TABLE IF NOT EXISTS laboratory_tests (
    id SERIAL PRIMARY KEY,
    test_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    test_type VARCHAR(255) NOT NULL,
    sample_id VARCHAR(50) NOT NULL,
    sample_type VARCHAR(100) NOT NULL,
    received_date DATE NOT NULL,
    received_time TIME NOT NULL,
    technician VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Chờ xử lý',
    priority VARCHAR(50) DEFAULT 'Bình thường',
    results JSONB DEFAULT '{}',
    notes TEXT,
    verified_by VARCHAR(255),
    verified_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. Fund Transactions Table (Giao dịch quỹ)
-- ============================================
CREATE TABLE IF NOT EXISTS fund_transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('Thu', 'Chi')),
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. Medical Revenue Table (Doanh thu khám chữa bệnh)
-- ============================================
CREATE TABLE IF NOT EXISTS medical_revenue (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    patient_count INTEGER NOT NULL DEFAULT 0,
    revenue DECIMAL(15, 2) NOT NULL DEFAULT 0,
    month VARCHAR(7) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. Insurance Claims Table (Thanh toán bảo hiểm)
-- ============================================
CREATE TABLE IF NOT EXISTS insurance_claims (
    id SERIAL PRIMARY KEY,
    claim_id VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    insurance_card VARCHAR(50) NOT NULL,
    insurance_type VARCHAR(50) NOT NULL,
    visit_date DATE NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    insurance_covered DECIMAL(15, 2) NOT NULL DEFAULT 0,
    patient_pay DECIMAL(15, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Chờ duyệt',
    approved_by VARCHAR(255),
    approved_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. Operating Expenses Table (Chi phí hoạt động)
-- ============================================
CREATE TABLE IF NOT EXISTS operating_expenses (
    id SERIAL PRIMARY KEY,
    expense_id VARCHAR(50) UNIQUE NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    department VARCHAR(255),
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    approved_by VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Chờ duyệt',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. Patients Table (Bệnh nhân)
-- ============================================
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    id_card VARCHAR(20),
    doctor_in_charge VARCHAR(255),
    visit_date DATE,
    diagnosis TEXT,
    status VARCHAR(50) DEFAULT 'Đang điều trị',
    medical_history TEXT,
    allergies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. Work Schedules Table (Lịch làm việc)
-- ============================================
CREATE TABLE IF NOT EXISTS work_schedules (
    id SERIAL PRIMARY KEY,
    schedule_id VARCHAR(50) UNIQUE NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    employee_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    shift VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'Chưa xác nhận',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, date, shift)
);

-- ============================================
-- 8. Accounts Table (Tài khoản)
-- ============================================
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    position VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Create Indexes for Better Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_laboratory_patient_id ON laboratory_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_laboratory_status ON laboratory_tests(status);
CREATE INDEX IF NOT EXISTS idx_laboratory_received_date ON laboratory_tests(received_date);

CREATE INDEX IF NOT EXISTS idx_fund_date ON fund_transactions(date);
CREATE INDEX IF NOT EXISTS idx_fund_type ON fund_transactions(type);
CREATE INDEX IF NOT EXISTS idx_fund_category ON fund_transactions(category);

CREATE INDEX IF NOT EXISTS idx_revenue_month ON medical_revenue(month);
CREATE INDEX IF NOT EXISTS idx_revenue_category ON medical_revenue(category);

CREATE INDEX IF NOT EXISTS idx_insurance_patient_id ON insurance_claims(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_status ON insurance_claims(status);
CREATE INDEX IF NOT EXISTS idx_insurance_visit_date ON insurance_claims(visit_date);

CREATE INDEX IF NOT EXISTS idx_expense_date ON operating_expenses(date);
CREATE INDEX IF NOT EXISTS idx_expense_category ON operating_expenses(category);
CREATE INDEX IF NOT EXISTS idx_expense_status ON operating_expenses(status);

CREATE INDEX IF NOT EXISTS idx_patient_patient_id ON patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_status ON patients(status);

CREATE INDEX IF NOT EXISTS idx_schedule_employee_id ON work_schedules(employee_id);
CREATE INDEX IF NOT EXISTS idx_schedule_date ON work_schedules(date);
CREATE INDEX IF NOT EXISTS idx_schedule_status ON work_schedules(status);

CREATE INDEX IF NOT EXISTS idx_account_employee_id ON accounts(employee_id);
CREATE INDEX IF NOT EXISTS idx_account_email ON accounts(email);
CREATE INDEX IF NOT EXISTS idx_account_status ON accounts(status);

-- ============================================
-- Insert Sample Data
-- ============================================

-- Laboratory Tests Sample Data
INSERT INTO laboratory_tests (test_id, patient_id, patient_name, test_type, sample_id, sample_type, received_date, received_time, technician, status, priority, results) VALUES
('LAB001', 'BN001', 'Nguyễn Văn A', 'Xét nghiệm máu tổng quát', 'MAU001', 'Máu tĩnh mạch', '2024-11-14', '08:30', 'KTV Trần Văn E', 'Hoàn thành', 'Bình thường', '{"WBC (Bạch cầu)": {"value": "7.2", "unit": "x10³/µL", "range": "4.0-11.0", "normal": true}, "RBC (Hồng cầu)": {"value": "4.8", "unit": "x10⁶/µL", "range": "4.5-5.5", "normal": true}}'),
('LAB002', 'BN002', 'Trần Thị B', 'Xét nghiệm sinh hóa', 'MAU002', 'Máu tĩnh mạch', '2024-11-14', '09:15', 'KTV Lê Thị G', 'Đang xét nghiệm', 'Cấp tốc', '{}')
ON CONFLICT (test_id) DO NOTHING;

-- Fund Transactions Sample Data
INSERT INTO fund_transactions (transaction_id, date, type, category, amount, description, created_by) VALUES
('TXN001', '2024-11-01', 'Thu', 'Khám bệnh', 15000000, 'Thu phí khám bệnh tháng 11', 'Kế toán Nguyễn Văn A'),
('TXN002', '2024-11-02', 'Thu', 'Xét nghiệm', 8500000, 'Thu phí xét nghiệm', 'Kế toán Nguyễn Văn A'),
('TXN003', '2024-11-03', 'Chi', 'Thuốc men', 12000000, 'Mua thuốc và vật tư y tế', 'Kế toán Trần Thị B'),
('TXN004', '2024-11-05', 'Chi', 'Lương', 50000000, 'Lương tháng 11', 'Kế toán Trần Thị B')
ON CONFLICT (transaction_id) DO NOTHING;

-- Medical Revenue Sample Data
INSERT INTO medical_revenue (date, category, patient_count, revenue, month) VALUES
('2024-11-01', 'Khám bệnh', 45, 22500000, '2024-11'),
('2024-11-01', 'Xét nghiệm', 30, 15000000, '2024-11'),
('2024-11-01', 'Nội trú', 10, 35000000, '2024-11'),
('2024-11-01', 'Phẫu thuật', 5, 50000000, '2024-11');

-- Insurance Claims Sample Data
INSERT INTO insurance_claims (claim_id, patient_id, patient_name, insurance_card, insurance_type, visit_date, total_amount, insurance_covered, patient_pay, status, approved_by, approved_date) VALUES
('BH001', 'BN001', 'Nguyễn Văn A', 'DN1234567890', 'BHYT', '2024-11-10', 5000000, 4000000, 1000000, 'Đã duyệt', 'Kế toán Trần Thị B', '2024-11-11'),
('BH002', 'BN002', 'Trần Thị B', 'DN9876543210', 'BHYT', '2024-11-12', 3500000, 2800000, 700000, 'Chờ duyệt', NULL, NULL)
ON CONFLICT (claim_id) DO NOTHING;

-- Operating Expenses Sample Data
INSERT INTO operating_expenses (expense_id, date, category, department, amount, description, approved_by, status) VALUES
('CP001', '2024-11-01', 'Lương', 'Toàn bộ', 50000000, 'Lương tháng 11', 'Giám đốc Nguyễn Văn A', 'Đã chi'),
('CP002', '2024-11-03', 'Thuốc men', 'Dược', 12000000, 'Mua thuốc và vật tư y tế', 'Trưởng khoa Dược', 'Đã chi')
ON CONFLICT (expense_id) DO NOTHING;

-- Patients Sample Data
INSERT INTO patients (patient_id, full_name, date_of_birth, gender, phone, address, id_card, doctor_in_charge, visit_date, diagnosis, status, medical_history, allergies) VALUES
('BN001', 'Nguyễn Văn An', '1990-05-15', 'Nam', '0912345678', '123 Nguyễn Huệ, Q1, TP.HCM', '079090001234', 'Bác sĩ Nguyễn Văn A', '2024-11-10', 'Viêm họng cấp', 'Đang điều trị', 'Không có bệnh nền', 'Không'),
('BN002', 'Trần Thị Bình', '1985-08-20', 'Nữ', '0987654321', '456 Lê Lợi, Q3, TP.HCM', '079085002345', 'Bác sĩ Nguyễn Văn A', '2024-11-12', 'Cao huyết áp', 'Tái khám', 'Đái tháo đường type 2', 'Penicillin'),
('BN003', 'Lê Văn Cường', '1995-03-10', 'Nam', '0901234567', '789 Hai Bà Trưng, Q1, TP.HCM', '079095003456', 'Bác sĩ Nguyễn Văn A', '2024-11-14', 'Viêm dạ dày', 'Hoàn thành', 'Không', 'Không')
ON CONFLICT (patient_id) DO NOTHING;

-- Work Schedules Sample Data
INSERT INTO work_schedules (schedule_id, employee_id, employee_name, department, date, shift, start_time, end_time, status, notes) VALUES
('LLV001', 'NV001', 'Bác sĩ Nguyễn Văn A', 'Khoa Nội', '2024-11-15', 'Ca sáng', '07:00', '12:00', 'Đã xác nhận', 'Trực phòng khám tổng quát'),
('LLV002', 'NV001', 'Bác sĩ Nguyễn Văn A', 'Khoa Nội', '2024-11-16', 'Ca chiều', '13:00', '18:00', 'Đã xác nhận', 'Khám bệnh theo lịch hẹn'),
('LLV003', 'NV002', 'Y tá Trần Thị B', 'Khoa Hồi sức', '2024-11-15', 'Ca tối', '18:00', '00:00', 'Đã xác nhận', 'Trực ban đêm')
ON CONFLICT (schedule_id) DO NOTHING;

-- Accounts Sample Data
INSERT INTO accounts (employee_id, password, name, department, position, role, phone, email, status) VALUES
('admin', '$2a$10$rQZ8xqJ9xqJ9xqJ9xqJ9xeK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'Admin', 'Quản trị', 'Quản trị viên', 'administrator', '0123456789', 'admin@healthcare.com', 'active'),
('doctor01', '$2a$10$rQZ8xqJ9xqJ9xqJ9xqJ9xeK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'Bác sĩ Nguyễn Văn A', 'Bác sĩ chuyên khoa', 'Bác sĩ', 'doctor', '0987654321', 'doctor01@healthcare.com', 'active'),
('nurse01', '$2a$10$rQZ8xqJ9xqJ9xqJ9xqJ9xeK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'Y tá Trần Thị B', 'Điều dưỡng', 'Y tá', 'nurse', '0912345678', 'nurse01@healthcare.com', 'active')
ON CONFLICT (employee_id) DO NOTHING;

-- ============================================
-- Create Update Timestamp Trigger Function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- Apply Trigger to All Tables
-- ============================================
DROP TRIGGER IF EXISTS update_laboratory_tests_updated_at ON laboratory_tests;
CREATE TRIGGER update_laboratory_tests_updated_at BEFORE UPDATE ON laboratory_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_fund_transactions_updated_at ON fund_transactions;
CREATE TRIGGER update_fund_transactions_updated_at BEFORE UPDATE ON fund_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_medical_revenue_updated_at ON medical_revenue;
CREATE TRIGGER update_medical_revenue_updated_at BEFORE UPDATE ON medical_revenue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_insurance_claims_updated_at ON insurance_claims;
CREATE TRIGGER update_insurance_claims_updated_at BEFORE UPDATE ON insurance_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_operating_expenses_updated_at ON operating_expenses;
CREATE TRIGGER update_operating_expenses_updated_at BEFORE UPDATE ON operating_expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_work_schedules_updated_at ON work_schedules;
CREATE TRIGGER update_work_schedules_updated_at BEFORE UPDATE ON work_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
