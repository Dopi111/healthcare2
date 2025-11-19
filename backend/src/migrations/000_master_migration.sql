-- ============================================
-- MASTER MIGRATION SCRIPT - RUN ALL MIGRATIONS IN ORDER
-- Author: Healthcare Management System
-- Date: 2025-11-19
-- Description: Execute all migrations in the correct sequence
-- ============================================

-- This script will:
-- 1. Create all core tables (users, employees, departments, positions)
-- 2. Create additional tables (patients, expenses, funds, insurance, revenue, labs)
-- 3. Create accounts table for authentication
-- 4. Insert sample data

-- ============================================
-- IMPORTANT: Run this in a fresh database or backup first!
-- ============================================

\echo '============================================'
\echo 'STARTING MASTER MIGRATION'
\echo '============================================'

-- ============================================
-- STEP 1: Initialize Core Schema (001)
-- ============================================
\echo ''
\echo 'Step 1: Creating core tables...'

-- CREATE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DROP EXISTING TABLES (if any)
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS laboratory_tests CASCADE;
DROP TABLE IF EXISTS revenue CASCADE;
DROP TABLE IF EXISTS insurance_claims CASCADE;
DROP TABLE IF EXISTS funds CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS user_medical_info CASCADE;
DROP TABLE IF EXISTS lab_results CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS infor_employee CASCADE;
DROP TABLE IF EXISTS infor_auth_employee CASCADE;
DROP TABLE IF EXISTS infor_users CASCADE;
DROP TABLE IF EXISTS list_position CASCADE;
DROP TABLE IF EXISTS list_department CASCADE;

-- CREATE CORE TABLES

-- Table: list_department
CREATE TABLE list_department (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: list_position
CREATE TABLE list_position (
  position_id SERIAL PRIMARY KEY,
  position_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: infor_users
CREATE TABLE infor_users (
  infor_users_id SERIAL PRIMARY KEY,
  employee_id VARCHAR(10) UNIQUE,
  phone_number VARCHAR(10) UNIQUE NOT NULL,
  card_id VARCHAR(12) UNIQUE NOT NULL,
  password VARCHAR(255),
  full_name VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ', 'Khác')),
  permanent_address VARCHAR(255),
  current_address VARCHAR(255),
  role_user VARCHAR(20) NOT NULL CHECK (role_user IN ('users', 'employee')),
  email VARCHAR(255),
  position VARCHAR(100),
  department VARCHAR(100),
  specialty VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_employee_id_format CHECK (employee_id IS NULL OR employee_id ~ '^\d{10}$'),
  CONSTRAINT check_phone_format CHECK (phone_number ~ '^\d{10}$'),
  CONSTRAINT check_card_id_format CHECK (card_id ~ '^\d{12}$')
);

-- Table: infor_employee
CREATE TABLE infor_employee (
  infor_employee_id SERIAL PRIMARY KEY,
  infor_users_id INTEGER NOT NULL,
  position_id INTEGER,
  department_id INTEGER,
  business TEXT,
  started_date DATE,
  salary DECIMAL(15, 2),
  coefficient DECIMAL(5, 2),
  attached TEXT,
  status_employee VARCHAR(20) DEFAULT 'active' CHECK (status_employee IN ('active', 'inactive', 'on_leave')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_employee_users FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE CASCADE,
  CONSTRAINT fk_employee_position FOREIGN KEY (position_id) REFERENCES list_position(position_id) ON DELETE SET NULL,
  CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES list_department(department_id) ON DELETE SET NULL
);

-- Table: infor_auth_employee
CREATE TABLE infor_auth_employee (
  infor_auth_employee_id SERIAL PRIMARY KEY,
  employee_id VARCHAR(10) UNIQUE NOT NULL,
  password_employee VARCHAR(255) NOT NULL,
  position VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_auth_employee_id_format CHECK (employee_id ~ '^\d{10}$')
);

\echo 'Core tables created successfully.'

-- ============================================
-- STEP 2: Create Indexes
-- ============================================
\echo ''
\echo 'Step 2: Creating indexes...'

CREATE INDEX idx_users_role ON infor_users(role_user);
CREATE INDEX idx_users_phone ON infor_users(phone_number);
CREATE INDEX idx_users_card ON infor_users(card_id);
CREATE INDEX idx_users_employee_id ON infor_users(employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX idx_users_created_at ON infor_users(created_at DESC);
CREATE INDEX idx_users_email ON infor_users(email);

CREATE INDEX idx_employee_users_id ON infor_employee(infor_users_id);
CREATE INDEX idx_employee_position ON infor_employee(position_id);
CREATE INDEX idx_employee_department ON infor_employee(department_id);
CREATE INDEX idx_employee_status ON infor_employee(status_employee);

CREATE INDEX idx_position_name ON list_position(position_name);
CREATE INDEX idx_department_name ON list_department(department_name);

\echo 'Indexes created successfully.'

-- ============================================
-- STEP 3: Create Triggers
-- ============================================
\echo ''
\echo 'Step 3: Creating triggers...'

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON infor_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_updated_at BEFORE UPDATE ON infor_employee FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_position_updated_at BEFORE UPDATE ON list_position FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_department_updated_at BEFORE UPDATE ON list_department FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_auth_employee_updated_at BEFORE UPDATE ON infor_auth_employee FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

\echo 'Triggers created successfully.'

-- ============================================
-- STEP 4: Insert Default Departments & Positions
-- ============================================
\echo ''
\echo 'Step 4: Inserting default departments and positions...'

INSERT INTO list_department (department_name, description) VALUES
  ('Khoa Nội', 'Khám và điều trị các bệnh lý nội khoa'),
  ('Khoa Ngoại', 'Phẫu thuật và điều trị ngoại khoa'),
  ('Khoa Nhi', 'Chuyên khoa nhi đồng'),
  ('Khoa Sản', 'Sản phụ khoa'),
  ('Khoa Cấp cứu', 'Tiếp nhận và xử lý các ca cấp cứu'),
  ('Khoa Xét nghiệm', 'Xét nghiệm y học'),
  ('Khoa Hình ảnh', 'Chẩn đoán hình ảnh (X-quang, CT, MRI)'),
  ('Phòng Hành chính', 'Quản lý hành chính và nhân sự'),
  ('Phòng Kế toán', 'Quản lý tài chính'),
  ('Tiếp tân', 'Tiếp nhận bệnh nhân và hướng dẫn')
ON CONFLICT (department_name) DO NOTHING;

INSERT INTO list_position (position_name, description) VALUES
  ('Bác sĩ', 'Bác sĩ khám và điều trị'),
  ('Bác sĩ trưởng khoa', 'Trưởng khoa chuyên môn'),
  ('Y tá', 'Điều dưỡng viên'),
  ('Y tá trưởng', 'Trưởng nhóm điều dưỡng'),
  ('Kỹ thuật viên', 'Kỹ thuật viên xét nghiệm/hình ảnh'),
  ('Dược sĩ', 'Quản lý và cấp phát thuốc'),
  ('Lễ tân', 'Tiếp tân bệnh viện'),
  ('Kế toán', 'Nhân viên kế toán'),
  ('Quản trị viên', 'Quản trị hệ thống'),
  ('Giám đốc', 'Giám đốc bệnh viện')
ON CONFLICT (position_name) DO NOTHING;

\echo 'Default data inserted successfully.'

-- ============================================
-- STEP 5: Create User Profile Tables (003)
-- ============================================
\echo ''
\echo 'Step 5: Creating user profile tables...'

CREATE TABLE IF NOT EXISTS user_medical_info (
  medical_info_id SERIAL PRIMARY KEY,
  infor_users_id INTEGER NOT NULL,
  blood_type VARCHAR(5),
  allergies TEXT,
  chronic_diseases TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(15),
  insurance_number VARCHAR(50),
  insurance_provider VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_medical_info_users FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE CASCADE
);

CREATE TRIGGER update_user_medical_info_updated_at BEFORE UPDATE ON user_medical_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

\echo 'User profile tables created successfully.'

-- ============================================
-- STEP 6: Create Appointments Table (004)
-- ============================================
\echo ''
\echo 'Step 6: Creating appointments table...'

CREATE TABLE IF NOT EXISTS appointments (
  appointment_id SERIAL PRIMARY KEY,
  infor_users_id INTEGER,
  patient_name VARCHAR(100) NOT NULL,
  patient_phone VARCHAR(15) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  doctor_name VARCHAR(100),
  department VARCHAR(100),
  reason TEXT,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_appointment_users FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE SET NULL
);

CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

\echo 'Appointments table created successfully.'

-- ============================================
-- STEP 7: Create Lab Results Table (005)
-- ============================================
\echo ''
\echo 'Step 7: Creating lab results table...'

CREATE TABLE IF NOT EXISTS lab_results (
  lab_result_id SERIAL PRIMARY KEY,
  infor_users_id INTEGER,
  test_name VARCHAR(200) NOT NULL,
  test_date DATE NOT NULL,
  result_value VARCHAR(100),
  reference_range VARCHAR(100),
  unit VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'reviewed')),
  doctor_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_lab_result_users FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE SET NULL
);

CREATE INDEX idx_lab_results_date ON lab_results(test_date);
CREATE TRIGGER update_lab_results_updated_at BEFORE UPDATE ON lab_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

\echo 'Lab results table created successfully.'

-- ============================================
-- STEP 8: Create Remaining Tables (007)
-- ============================================
\echo ''
\echo 'Step 8: Creating patients, expenses, funds, insurance, revenue, and test tables...'

-- PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
  patient_id SERIAL PRIMARY KEY,
  infor_users_id INTEGER,
  patient_code VARCHAR(20) UNIQUE NOT NULL,
  doctor_in_charge VARCHAR(100),
  visit_date DATE,
  diagnosis TEXT,
  status VARCHAR(50) DEFAULT 'Đang điều trị' CHECK (status IN ('Đang điều trị', 'Tái khám', 'Hoàn thành', 'Hủy')),
  medical_history TEXT,
  allergies TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_patient_users FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE CASCADE
);

-- EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
  expense_id SERIAL PRIMARY KEY,
  expense_code VARCHAR(20) UNIQUE NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  amount DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
  description TEXT,
  approved_by VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Chờ duyệt' CHECK (status IN ('Chờ duyệt', 'Đã chi', 'Từ chối')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FUNDS TABLE
CREATE TABLE IF NOT EXISTS funds (
  fund_id SERIAL PRIMARY KEY,
  transaction_code VARCHAR(20) UNIQUE NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('Thu', 'Chi')),
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount >= 0),
  description TEXT,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSURANCE TABLE
CREATE TABLE IF NOT EXISTS insurance_claims (
  insurance_id SERIAL PRIMARY KEY,
  claim_code VARCHAR(20) UNIQUE NOT NULL,
  patient_id INTEGER,
  patient_code VARCHAR(20),
  patient_name VARCHAR(100) NOT NULL,
  insurance_card VARCHAR(20),
  insurance_type VARCHAR(50) CHECK (insurance_type IN ('BHYT', 'BHTN', 'Khác')),
  visit_date DATE NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL CHECK (total_amount >= 0),
  insurance_covered DECIMAL(15, 2) DEFAULT 0 CHECK (insurance_covered >= 0),
  patient_pay DECIMAL(15, 2) DEFAULT 0 CHECK (patient_pay >= 0),
  status VARCHAR(50) DEFAULT 'Chờ duyệt' CHECK (status IN ('Chờ duyệt', 'Đã duyệt', 'Từ chối')),
  approved_by VARCHAR(100),
  approved_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_insurance_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE SET NULL
);

-- REVENUE TABLE
CREATE TABLE IF NOT EXISTS revenue (
  revenue_id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  patient_count INTEGER DEFAULT 0 CHECK (patient_count >= 0),
  revenue_amount DECIMAL(15, 2) NOT NULL CHECK (revenue_amount >= 0),
  month VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LABORATORY_TESTS TABLE
CREATE TABLE IF NOT EXISTS laboratory_tests (
  lab_test_id SERIAL PRIMARY KEY,
  test_code VARCHAR(20) UNIQUE NOT NULL,
  patient_id INTEGER,
  patient_code VARCHAR(20),
  patient_name VARCHAR(100) NOT NULL,
  test_type VARCHAR(200) NOT NULL,
  sample_id VARCHAR(20) UNIQUE,
  sample_type VARCHAR(100),
  received_date DATE NOT NULL,
  received_time TIME,
  technician VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Chờ xử lý' CHECK (status IN ('Chờ xử lý', 'Đang xét nghiệm', 'Hoàn thành', 'Hủy')),
  priority VARCHAR(50) DEFAULT 'Bình thường' CHECK (priority IN ('Bình thường', 'Cấp tốc', 'Khẩn cấp')),
  results JSONB,
  completed_date DATE,
  completed_time TIME,
  verified_by VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_lab_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE SET NULL
);

-- TEST_RESULTS TABLE
CREATE TABLE IF NOT EXISTS test_results (
  test_result_id SERIAL PRIMARY KEY,
  test_code VARCHAR(20) UNIQUE NOT NULL,
  patient_id INTEGER,
  patient_code VARCHAR(20),
  patient_name VARCHAR(100) NOT NULL,
  test_type VARCHAR(200) NOT NULL,
  doctor_order VARCHAR(100),
  order_date DATE NOT NULL,
  sample_date DATE,
  result_date DATE,
  status VARCHAR(50) DEFAULT 'Đang xử lý' CHECK (status IN ('Đang xử lý', 'Hoàn thành', 'Hủy')),
  priority VARCHAR(50) DEFAULT 'Bình thường' CHECK (priority IN ('Bình thường', 'Cấp tốc', 'Khẩn cấp')),
  results JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_test_result_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE SET NULL
);

-- Create triggers
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funds_updated_at BEFORE UPDATE ON funds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_updated_at BEFORE UPDATE ON insurance_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_revenue_updated_at BEFORE UPDATE ON revenue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_laboratory_tests_updated_at BEFORE UPDATE ON laboratory_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_results_updated_at BEFORE UPDATE ON test_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

\echo 'Remaining tables created successfully.'

-- ============================================
-- STEP 9: Create Accounts Table (009 - FIXED)
-- ============================================
\echo ''
\echo 'Step 9: Creating accounts table for authentication...'

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  position VARCHAR(100),
  role VARCHAR(50) NOT NULL CHECK (role IN ('administrator', 'doctor', 'nurse', 'receptionist', 'accountant', 'technician')),
  phone VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_employee_id ON accounts(employee_id);
CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_role ON accounts(role);
CREATE INDEX idx_accounts_status ON accounts(status);

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default accounts
INSERT INTO accounts (employee_id, password, name, department, position, role, phone, email, status) VALUES
  ('admin', 'admin123', 'Admin', 'Quản trị', 'Quản trị viên', 'administrator', '0123456789', 'admin@healthcare.com', 'active'),
  ('doctor01', 'doctor123', 'Bác sĩ Nguyễn Văn A', 'Bác sĩ chuyên khoa', 'Bác sĩ', 'doctor', '0987654321', 'doctor01@healthcare.com', 'active'),
  ('nurse01', 'nurse123', 'Y tá Trần Thị B', 'Điều dưỡng', 'Y tá', 'nurse', '0912345678', 'nurse01@healthcare.com', 'active'),
  ('reception01', 'reception123', 'Lễ tân Lê Văn C', 'Tiếp tân', 'Lễ tân', 'receptionist', '0901234567', 'reception01@healthcare.com', 'active'),
  ('accountant01', 'accountant123', 'Kế toán Phạm Thị D', 'Kế toán', 'Kế toán trưởng', 'accountant', '0923456789', 'accountant01@healthcare.com', 'active')
ON CONFLICT (employee_id) DO NOTHING;

\echo 'Accounts table created successfully.'

-- ============================================
-- FINAL VERIFICATION
-- ============================================
\echo ''
\echo '============================================'
\echo 'MASTER MIGRATION COMPLETED SUCCESSFULLY'
\echo '============================================'
\echo ''
\echo 'Verifying database state...'
\echo ''

SELECT
  'Departments: ' || COUNT(*) as count
FROM list_department;

SELECT
  'Positions: ' || COUNT(*) as count
FROM list_position;

SELECT
  'Accounts: ' || COUNT(*) as count
FROM accounts;

\echo ''
\echo 'To verify all tables, run:'
\echo '  \dt'
\echo ''
\echo 'To verify accounts, run:'
\echo '  SELECT id, employee_id, name, role FROM accounts;'
\echo ''
\echo '============================================'
\echo 'MIGRATION COMPLETE - Database is ready!'
\echo '============================================'
