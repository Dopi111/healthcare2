-- ============================================
-- MIGRATION 007: Create Remaining Tables for localStorage Replacement
-- Author: Healthcare Management System
-- Date: 2025-11-19
-- Description: Create tables for Patients, Expenses, Funds, Insurance, Revenue, Laboratory, and Test Results
-- ============================================

-- ============================================
-- 1. PATIENTS TABLE (Bệnh nhân - thông tin chi tiết)
-- ============================================
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

-- ============================================
-- 2. EXPENSES TABLE (Chi phí hoạt động)
-- ============================================
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

-- ============================================
-- 3. FUNDS TABLE (Quỹ tài chính - Giao dịch thu/chi)
-- ============================================
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

-- ============================================
-- 4. INSURANCE TABLE (Thanh toán bảo hiểm)
-- ============================================
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

-- ============================================
-- 5. REVENUE TABLE (Doanh thu)
-- ============================================
CREATE TABLE IF NOT EXISTS revenue (
  revenue_id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  patient_count INTEGER DEFAULT 0 CHECK (patient_count >= 0),
  revenue_amount DECIMAL(15, 2) NOT NULL CHECK (revenue_amount >= 0),
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. LABORATORY_TESTS TABLE (Xét nghiệm tại phòng lab)
-- ============================================
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
  results JSONB, -- Store test results as JSON
  completed_date DATE,
  completed_time TIME,
  verified_by VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_lab_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE SET NULL
);

-- ============================================
-- 7. TEST_RESULTS TABLE (Phiếu kết quả xét nghiệm)
-- ============================================
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
  results JSONB, -- Store test results as JSON
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_test_result_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE SET NULL
);

-- ============================================
-- 8. CREATE INDEXES for Performance
-- ============================================

-- Patients indexes
CREATE INDEX IF NOT EXISTS idx_patients_code ON patients(patient_code);
CREATE INDEX IF NOT EXISTS idx_patients_user ON patients(infor_users_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_visit_date ON patients(visit_date DESC);

-- Expenses indexes
CREATE INDEX IF NOT EXISTS idx_expenses_code ON expenses(expense_code);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);

-- Funds indexes
CREATE INDEX IF NOT EXISTS idx_funds_code ON funds(transaction_code);
CREATE INDEX IF NOT EXISTS idx_funds_date ON funds(date DESC);
CREATE INDEX IF NOT EXISTS idx_funds_type ON funds(type);
CREATE INDEX IF NOT EXISTS idx_funds_category ON funds(category);

-- Insurance indexes
CREATE INDEX IF NOT EXISTS idx_insurance_code ON insurance_claims(claim_code);
CREATE INDEX IF NOT EXISTS idx_insurance_patient ON insurance_claims(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_status ON insurance_claims(status);
CREATE INDEX IF NOT EXISTS idx_insurance_visit_date ON insurance_claims(visit_date DESC);

-- Revenue indexes
CREATE INDEX IF NOT EXISTS idx_revenue_date ON revenue(date DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_month ON revenue(month);
CREATE INDEX IF NOT EXISTS idx_revenue_category ON revenue(category);

-- Laboratory tests indexes
CREATE INDEX IF NOT EXISTS idx_lab_tests_code ON laboratory_tests(test_code);
CREATE INDEX IF NOT EXISTS idx_lab_tests_patient ON laboratory_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_sample ON laboratory_tests(sample_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_status ON laboratory_tests(status);
CREATE INDEX IF NOT EXISTS idx_lab_tests_received ON laboratory_tests(received_date DESC);

-- Test results indexes
CREATE INDEX IF NOT EXISTS idx_test_results_code ON test_results(test_code);
CREATE INDEX IF NOT EXISTS idx_test_results_patient ON test_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_test_results_status ON test_results(status);
CREATE INDEX IF NOT EXISTS idx_test_results_date ON test_results(order_date DESC);

-- ============================================
-- 9. CREATE TRIGGERS for updated_at
-- ============================================

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funds_updated_at
  BEFORE UPDATE ON funds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_updated_at
  BEFORE UPDATE ON insurance_claims
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_updated_at
  BEFORE UPDATE ON revenue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_tests_updated_at
  BEFORE UPDATE ON laboratory_tests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_results_updated_at
  BEFORE UPDATE ON test_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. VERIFICATION
-- ============================================

DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_name IN ('patients', 'expenses', 'funds', 'insurance_claims', 'revenue', 'laboratory_tests', 'test_results');

  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ MIGRATION 007 COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'New tables created: %', table_count;
  RAISE NOTICE '========================================';
END $$;

-- ============================================
-- END OF MIGRATION 007
-- ============================================
