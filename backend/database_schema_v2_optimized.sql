-- ============================================
-- HEALTHCARE DATABASE - SCHEMA V2 (OPTIMIZED)
-- Production-Ready Schema with Data Integrity
-- ============================================
--
-- MAJOR CHANGES FROM V1:
-- 1. ✅ Merged `accounts` + `infor_users` → `users` (single source of truth)
-- 2. ✅ Removed data duplication (patient_code, patient_name from insurance/tests)
-- 3. ✅ Added comprehensive CHECK constraints
-- 4. ✅ Added NOT NULL for critical fields
-- 5. ✅ Standardized naming: infor_ → info_, consistent pluralization
-- 6. ✅ Optimized Foreign Keys (CASCADE vs SET NULL)
-- 7. ✅ Added auto-update triggers for updated_at
-- 8. ✅ Removed legacy table: infor_auth_employee
--
-- Author: Claude AI
-- Date: 2025-11-21
-- Version: 2.0
--
-- ============================================

-- ============================================
-- STEP 1: DROP EXISTING SCHEMA
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '🔧 Starting Database Schema V2 Migration';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '⏳ Dropping old tables...';
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
DROP TABLE IF EXISTS user_medical_history CASCADE;
DROP TABLE IF EXISTS user_relatives CASCADE;
DROP TABLE IF EXISTS user_medical_info CASCADE;
DROP TABLE IF EXISTS infor_auth_employee CASCADE;
DROP TABLE IF EXISTS infor_employee CASCADE;
DROP TABLE IF EXISTS infor_users CASCADE;
DROP TABLE IF EXISTS list_position CASCADE;
DROP TABLE IF EXISTS list_department CASCADE;

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS trg_update_users_timestamp ON users CASCADE;
DROP TRIGGER IF EXISTS trg_update_employees_timestamp ON employees CASCADE;
DROP TRIGGER IF EXISTS trg_update_patients_timestamp ON patients CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

DO $$
BEGIN
    RAISE NOTICE '✅ Old schema dropped';
    RAISE NOTICE '';
END $$;

-- ============================================
-- STEP 2: CREATE TRIGGERS FUNCTION
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '🔧 Creating trigger functions...';
END $$;

-- Trigger function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    RAISE NOTICE '✅ Trigger functions created';
    RAISE NOTICE '';
END $$;

-- ============================================
-- STEP 3: CREATE TABLES (OPTIMIZED SCHEMA V2)
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '🏗️  Creating optimized tables...';
END $$;

-- ============================================
-- REFERENCE TABLES (Lookup/Master Data)
-- ============================================

-- Table: departments
-- Purpose: Master list of hospital departments
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT chk_department_name_length CHECK (char_length(department_name) >= 3)
);

COMMENT ON TABLE departments IS 'Master list of hospital departments';
COMMENT ON COLUMN departments.is_active IS 'Soft delete flag - inactive departments are hidden but preserved for historical data';

-- Table: positions
-- Purpose: Master list of employee positions/titles
CREATE TABLE positions (
    position_id SERIAL PRIMARY KEY,
    position_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT chk_position_name_length CHECK (char_length(position_name) >= 2)
);

COMMENT ON TABLE positions IS 'Master list of employee positions/titles';

-- ============================================
-- CORE USER TABLES
-- ============================================

-- Table: users
-- Purpose: Central user table for ALL users (employees AND patients)
-- DESIGN DECISION: Merged `accounts` and `infor_users` to eliminate duplication
-- and ensure single source of truth for authentication
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,

    -- Authentication (required for all users)
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    card_id VARCHAR(12) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    -- Basic Information (required)
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) DEFAULT 'Nam' NOT NULL,
    email VARCHAR(100) UNIQUE,

    -- Employee-specific fields (nullable for patients)
    employee_id VARCHAR(10) UNIQUE,
    position VARCHAR(100),
    department VARCHAR(100),
    specialty VARCHAR(100),

    -- Contact Information
    permanent_address TEXT,
    current_address TEXT,

    -- Role & Status
    role VARCHAR(20) DEFAULT 'patient' NOT NULL,
    status VARCHAR(20) DEFAULT 'active' NOT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_user_phone_format CHECK (phone_number ~ '^0[0-9]{9}$'),
    CONSTRAINT chk_user_card_id_format CHECK (card_id ~ '^[0-9]{12}$'),
    CONSTRAINT chk_user_employee_id_format CHECK (employee_id IS NULL OR employee_id ~ '^[0-9]{10}$'),
    CONSTRAINT chk_user_gender CHECK (gender IN ('Nam', 'Nữ', 'Khác')),
    CONSTRAINT chk_user_role CHECK (role IN ('patient', 'employee', 'administrator', 'doctor', 'nurse', 'receptionist', 'accountant', 'technician')),
    CONSTRAINT chk_user_status CHECK (status IN ('active', 'inactive', 'suspended', 'locked')),
    CONSTRAINT chk_user_email_format CHECK (email IS NULL OR email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
    CONSTRAINT chk_user_full_name_length CHECK (char_length(full_name) >= 3),
    CONSTRAINT chk_user_employee_fields CHECK (
        (role IN ('employee', 'administrator', 'doctor', 'nurse', 'receptionist', 'accountant', 'technician') AND employee_id IS NOT NULL)
        OR (role = 'patient' AND employee_id IS NULL)
    )
);

COMMENT ON TABLE users IS 'Central user table for ALL system users (employees and patients). Merged from accounts + infor_users to eliminate duplication.';
COMMENT ON COLUMN users.user_id IS 'Primary key - replaces infor_users_id';
COMMENT ON COLUMN users.employee_id IS 'Only for employees - must be exactly 10 digits';
COMMENT ON COLUMN users.phone_number IS 'Must be Vietnamese phone format: 10 digits starting with 0';
COMMENT ON COLUMN users.card_id IS 'National ID card - must be exactly 12 digits';
COMMENT ON COLUMN users.role IS 'User role - determines access permissions';

CREATE INDEX idx_users_employee_id ON users(employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Trigger: Auto-update updated_at
CREATE TRIGGER trg_update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table: employees
-- Purpose: Extended employee information (salary, position, department details)
-- DESIGN DECISION: Keep separate for employee-specific fields that don't apply to patients
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    position_id INT REFERENCES positions(position_id) ON DELETE SET NULL,
    department_id INT REFERENCES departments(department_id) ON DELETE SET NULL,

    -- Employment Details
    business_description TEXT,
    start_date DATE,
    end_date DATE,

    -- Compensation
    salary NUMERIC(15,2),
    coefficient NUMERIC(5,2),

    -- Documents & Status
    attached_documents TEXT,
    employment_status VARCHAR(50) DEFAULT 'active' NOT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_employee_salary CHECK (salary IS NULL OR salary >= 0),
    CONSTRAINT chk_employee_coefficient CHECK (coefficient IS NULL OR (coefficient >= 0 AND coefficient <= 10)),
    CONSTRAINT chk_employee_status CHECK (employment_status IN ('active', 'on_leave', 'resigned', 'terminated', 'retired')),
    CONSTRAINT chk_employee_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

COMMENT ON TABLE employees IS 'Extended employee information - linked to users table via user_id';
COMMENT ON COLUMN employees.user_id IS 'Foreign key to users table - CASCADE delete when user is deleted';
COMMENT ON COLUMN employees.position_id IS 'Foreign key to positions - SET NULL if position is deleted (preserves historical data)';
COMMENT ON COLUMN employees.department_id IS 'Foreign key to departments - SET NULL if department is deleted';

CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_position_id ON employees(position_id);
CREATE INDEX idx_employees_department_id ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(employment_status);

CREATE TRIGGER trg_update_employees_timestamp
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MEDICAL INFORMATION TABLES
-- ============================================

-- Table: user_medical_infos
-- Purpose: Medical information for patients
CREATE TABLE user_medical_infos (
    medical_info_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,

    -- Medical Data
    blood_type VARCHAR(10),
    allergies TEXT,
    chronic_diseases TEXT,

    -- Emergency Contact
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    emergency_contact_relation VARCHAR(50),

    -- Insurance
    insurance_number VARCHAR(50),
    insurance_provider VARCHAR(100),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_medical_blood_type CHECK (blood_type IS NULL OR blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    CONSTRAINT chk_medical_emergency_phone CHECK (emergency_contact_phone IS NULL OR emergency_contact_phone ~ '^0[0-9]{9}$')
);

COMMENT ON TABLE user_medical_infos IS 'Medical information for patients';

CREATE INDEX idx_medical_infos_user_id ON user_medical_infos(user_id);

CREATE TRIGGER trg_update_medical_infos_timestamp
    BEFORE UPDATE ON user_medical_infos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table: user_relatives
-- Purpose: Family members and emergency contacts
CREATE TABLE user_relatives (
    relative_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Relative Information
    full_name VARCHAR(100) NOT NULL,
    relation VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    is_emergency_contact BOOLEAN DEFAULT FALSE NOT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_relative_phone_format CHECK (phone_number IS NULL OR phone_number ~ '^0[0-9]{9}$'),
    CONSTRAINT chk_relative_email_format CHECK (email IS NULL OR email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
    CONSTRAINT chk_relative_name_length CHECK (char_length(full_name) >= 2),
    CONSTRAINT chk_relative_relation CHECK (relation IN ('Cha', 'Mẹ', 'Vợ', 'Chồng', 'Con trai', 'Con gái', 'Anh', 'Chị', 'Em', 'Ông', 'Bà', 'Khác'))
);

COMMENT ON TABLE user_relatives IS 'Family members and emergency contacts for patients';

CREATE INDEX idx_relatives_user_id ON user_relatives(user_id);
CREATE INDEX idx_relatives_emergency ON user_relatives(is_emergency_contact) WHERE is_emergency_contact = TRUE;

CREATE TRIGGER trg_update_relatives_timestamp
    BEFORE UPDATE ON user_relatives
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table: user_medical_histories
-- Purpose: Historical medical visits and treatments
CREATE TABLE user_medical_histories (
    history_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Visit Information
    visit_date DATE NOT NULL,
    clinic_name VARCHAR(200),
    doctor_name VARCHAR(100),

    -- Medical Details
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_history_visit_date CHECK (visit_date <= CURRENT_DATE)
);

COMMENT ON TABLE user_medical_histories IS 'Historical medical visits and treatments';

CREATE INDEX idx_medical_histories_user_id ON user_medical_histories(user_id);
CREATE INDEX idx_medical_histories_visit_date ON user_medical_histories(visit_date DESC);

CREATE TRIGGER trg_update_medical_histories_timestamp
    BEFORE UPDATE ON user_medical_histories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PATIENT & APPOINTMENT TABLES
-- ============================================

-- Table: patients
-- Purpose: Patient records for hospital admissions/treatments
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,

    -- Patient Identification
    patient_code VARCHAR(50) NOT NULL UNIQUE,

    -- Visit Details
    doctor_in_charge VARCHAR(100),
    visit_date DATE,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,

    -- Status & Follow-up
    status VARCHAR(50) DEFAULT 'active' NOT NULL,
    follow_up_date DATE,

    -- Medical History
    medical_history TEXT,
    allergies TEXT,
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_patient_status CHECK (status IN ('active', 'discharged', 'transferred', 'deceased', 'cancelled')),
    CONSTRAINT chk_patient_follow_up CHECK (follow_up_date IS NULL OR follow_up_date >= visit_date)
);

COMMENT ON TABLE patients IS 'Patient records - user_id can be NULL for unregistered walk-in patients';
COMMENT ON COLUMN patients.user_id IS 'Foreign key to users - SET NULL to preserve patient record if user account deleted';

CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_code ON patients(patient_code);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_visit_date ON patients(visit_date DESC);

CREATE TRIGGER trg_update_patients_timestamp
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table: appointments
-- Purpose: Appointment scheduling
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,

    -- Patient Information (for walk-ins without user account)
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(15) NOT NULL,

    -- Appointment Details
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    doctor_name VARCHAR(100),
    department VARCHAR(100),
    reason TEXT,

    -- Status
    status VARCHAR(50) DEFAULT 'scheduled' NOT NULL,
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_appointment_status CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    CONSTRAINT chk_appointment_phone CHECK (patient_phone ~ '^0[0-9]{9}$'),
    CONSTRAINT chk_appointment_future CHECK (appointment_date >= CURRENT_DATE - INTERVAL '7 days')
);

COMMENT ON TABLE appointments IS 'Appointment scheduling - supports both registered users and walk-ins';

CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date DESC, appointment_time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_phone ON appointments(patient_phone);

CREATE TRIGGER trg_update_appointments_timestamp
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table: lab_results
-- Purpose: Laboratory test results for users
CREATE TABLE lab_results (
    lab_result_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,

    -- Test Information
    test_type VARCHAR(100) NOT NULL,
    test_date DATE NOT NULL,

    -- Results
    result_value TEXT,
    unit VARCHAR(50),
    reference_range VARCHAR(100),

    -- Status & Review
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    doctor_name VARCHAR(100),
    notes TEXT,

    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_lab_result_status CHECK (status IN ('pending', 'completed', 'reviewed', 'abnormal', 'cancelled'))
);

COMMENT ON TABLE lab_results IS 'Laboratory test results for users';

CREATE INDEX idx_lab_results_user_id ON lab_results(user_id);
CREATE INDEX idx_lab_results_test_date ON lab_results(test_date DESC);
CREATE INDEX idx_lab_results_status ON lab_results(status);

-- ============================================
-- FINANCIAL TABLES
-- ============================================

-- Table: expenses
-- Purpose: Hospital operational expenses
CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,

    -- Expense Identification
    expense_code VARCHAR(50) NOT NULL UNIQUE,
    expense_date DATE NOT NULL,

    -- Categorization
    category VARCHAR(100) NOT NULL,
    department VARCHAR(100),

    -- Amount
    amount NUMERIC(15,2) NOT NULL,
    description TEXT,

    -- Approval
    approved_by VARCHAR(100),
    approval_date DATE,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_expense_amount CHECK (amount > 0),
    CONSTRAINT chk_expense_status CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    CONSTRAINT chk_expense_approval CHECK (
        (status = 'approved' AND approved_by IS NOT NULL AND approval_date IS NOT NULL)
        OR (status IN ('pending', 'rejected') AND (approved_by IS NULL OR approved_by IS NOT NULL))
        OR (status = 'paid' AND approved_by IS NOT NULL)
    )
);

COMMENT ON TABLE expenses IS 'Hospital operational expenses';

CREATE INDEX idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_category ON expenses(category);

CREATE TRIGGER trg_update_expenses_timestamp
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table: funds
-- Purpose: Fund transactions (income and expenses)
CREATE TABLE funds (
    fund_id SERIAL PRIMARY KEY,

    -- Transaction Identification
    transaction_code VARCHAR(50) NOT NULL UNIQUE,
    transaction_date DATE NOT NULL,

    -- Transaction Type
    transaction_type VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL,

    -- Amount
    amount NUMERIC(15,2) NOT NULL,
    description TEXT,

    -- Tracking
    created_by VARCHAR(100),

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_fund_type CHECK (transaction_type IN ('income', 'expense')),
    CONSTRAINT chk_fund_amount CHECK (amount > 0)
);

COMMENT ON TABLE funds IS 'Fund transactions - both income and expenses';

CREATE INDEX idx_funds_date ON funds(transaction_date DESC);
CREATE INDEX idx_funds_type ON funds(transaction_type);
CREATE INDEX idx_funds_category ON funds(category);

CREATE TRIGGER trg_update_funds_timestamp
    BEFORE UPDATE ON funds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table: revenue
-- Purpose: Revenue tracking by category and month
CREATE TABLE revenue (
    revenue_id SERIAL PRIMARY KEY,

    -- Revenue Period
    revenue_date DATE NOT NULL,
    month_year VARCHAR(7) NOT NULL,

    -- Categorization
    category VARCHAR(100) NOT NULL,

    -- Metrics
    patient_count INT DEFAULT 0 NOT NULL,
    revenue_amount NUMERIC(15,2) NOT NULL,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_revenue_amount CHECK (revenue_amount >= 0),
    CONSTRAINT chk_revenue_patient_count CHECK (patient_count >= 0),
    CONSTRAINT chk_revenue_month_format CHECK (month_year ~ '^[0-9]{4}-[0-9]{2}$')
);

COMMENT ON TABLE revenue IS 'Revenue tracking by category and month';

CREATE INDEX idx_revenue_month ON revenue(month_year DESC);
CREATE INDEX idx_revenue_date ON revenue(revenue_date DESC);
CREATE INDEX idx_revenue_category ON revenue(category);

CREATE TRIGGER trg_update_revenue_timestamp
    BEFORE UPDATE ON revenue
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSURANCE & CLAIMS TABLES
-- ============================================

-- Table: insurance_claims
-- Purpose: Insurance claim processing
-- DESIGN DECISION: Removed patient_code and patient_name duplication - get via JOIN with patients table
CREATE TABLE insurance_claims (
    claim_id SERIAL PRIMARY KEY,

    -- Claim Identification
    claim_code VARCHAR(50) NOT NULL UNIQUE,
    patient_id INT NOT NULL REFERENCES patients(patient_id) ON DELETE RESTRICT,

    -- Insurance Details
    insurance_card VARCHAR(50),
    insurance_type VARCHAR(100),

    -- Visit & Amount
    visit_date DATE NOT NULL,
    total_amount NUMERIC(15,2) NOT NULL,
    insurance_covered NUMERIC(15,2) DEFAULT 0 NOT NULL,
    patient_pay NUMERIC(15,2) DEFAULT 0 NOT NULL,

    -- Approval
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    approved_by VARCHAR(100),
    approval_date DATE,

    -- Notes
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_claim_amounts CHECK (
        total_amount > 0 AND
        insurance_covered >= 0 AND
        patient_pay >= 0 AND
        total_amount = insurance_covered + patient_pay
    ),
    CONSTRAINT chk_claim_status CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    CONSTRAINT chk_claim_approval CHECK (
        (status = 'approved' AND approved_by IS NOT NULL AND approval_date IS NOT NULL)
        OR (status IN ('pending', 'rejected') AND (approved_by IS NULL OR approved_by IS NOT NULL))
        OR (status = 'paid' AND approved_by IS NOT NULL)
    )
);

COMMENT ON TABLE insurance_claims IS 'Insurance claim processing - patient info retrieved via JOIN (no duplication)';
COMMENT ON COLUMN insurance_claims.patient_id IS 'RESTRICT delete - cannot delete patient with active claims';

CREATE INDEX idx_claims_patient_id ON insurance_claims(patient_id);
CREATE INDEX idx_claims_code ON insurance_claims(claim_code);
CREATE INDEX idx_claims_status ON insurance_claims(status);
CREATE INDEX idx_claims_visit_date ON insurance_claims(visit_date DESC);

CREATE TRIGGER trg_update_insurance_claims_timestamp
    BEFORE UPDATE ON insurance_claims
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- LABORATORY TABLES
-- ============================================

-- Table: laboratory_tests
-- Purpose: Laboratory test orders and processing
-- DESIGN DECISION: Removed patient_code and patient_name duplication
CREATE TABLE laboratory_tests (
    lab_test_id SERIAL PRIMARY KEY,

    -- Test Identification
    test_code VARCHAR(50) NOT NULL UNIQUE,
    patient_id INT NOT NULL REFERENCES patients(patient_id) ON DELETE RESTRICT,

    -- Test Details
    test_type VARCHAR(100) NOT NULL,
    sample_id VARCHAR(50) UNIQUE,
    sample_type VARCHAR(100),

    -- Timing
    received_date DATE NOT NULL,
    received_time TIME,
    completed_date DATE,
    completed_time TIME,

    -- Processing
    technician VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    priority VARCHAR(50) DEFAULT 'normal' NOT NULL,

    -- Results (stored as JSON)
    results JSONB DEFAULT '{}' NOT NULL,

    -- Verification
    verified_by VARCHAR(100),
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_lab_test_status CHECK (status IN ('pending', 'in_progress', 'completed', 'verified', 'cancelled')),
    CONSTRAINT chk_lab_test_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    CONSTRAINT chk_lab_test_completion CHECK (
        (status IN ('completed', 'verified') AND completed_date IS NOT NULL)
        OR (status IN ('pending', 'in_progress', 'cancelled'))
    ),
    CONSTRAINT chk_lab_test_dates CHECK (completed_date IS NULL OR completed_date >= received_date)
);

COMMENT ON TABLE laboratory_tests IS 'Laboratory test orders - patient info via JOIN (no duplication)';
COMMENT ON COLUMN laboratory_tests.patient_id IS 'RESTRICT delete - cannot delete patient with active tests';

CREATE INDEX idx_lab_tests_patient_id ON laboratory_tests(patient_id);
CREATE INDEX idx_lab_tests_code ON laboratory_tests(test_code);
CREATE INDEX idx_lab_tests_status ON laboratory_tests(status);
CREATE INDEX idx_lab_tests_received_date ON laboratory_tests(received_date DESC);
CREATE INDEX idx_lab_tests_priority ON laboratory_tests(priority) WHERE priority IN ('high', 'urgent');

CREATE TRIGGER trg_update_laboratory_tests_timestamp
    BEFORE UPDATE ON laboratory_tests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table: test_results
-- Purpose: Individual test result records
-- DESIGN DECISION: Removed patient_code and patient_name duplication
CREATE TABLE test_results (
    test_result_id SERIAL PRIMARY KEY,

    -- Test Identification
    test_code VARCHAR(50) NOT NULL,
    patient_id INT NOT NULL REFERENCES patients(patient_id) ON DELETE RESTRICT,

    -- Test Details
    test_name VARCHAR(100) NOT NULL,
    test_type VARCHAR(100),

    -- Timing
    order_date DATE NOT NULL,
    sample_collected_date DATE,
    result_date DATE,

    -- Results
    result_value TEXT,
    unit VARCHAR(50),
    reference_range VARCHAR(100),

    -- Status & Personnel
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    technician VARCHAR(100),
    doctor VARCHAR(100),

    -- Notes
    notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Constraints
    CONSTRAINT chk_test_result_status CHECK (status IN ('pending', 'in_progress', 'completed', 'reviewed', 'cancelled')),
    CONSTRAINT chk_test_result_dates CHECK (
        (sample_collected_date IS NULL OR sample_collected_date >= order_date) AND
        (result_date IS NULL OR result_date >= order_date)
    )
);

COMMENT ON TABLE test_results IS 'Individual test results - patient info via JOIN (no duplication)';
COMMENT ON COLUMN test_results.patient_id IS 'RESTRICT delete - cannot delete patient with test results';

CREATE INDEX idx_test_results_patient_id ON test_results(patient_id);
CREATE INDEX idx_test_results_test_code ON test_results(test_code);
CREATE INDEX idx_test_results_status ON test_results(status);
CREATE INDEX idx_test_results_order_date ON test_results(order_date DESC);

CREATE TRIGGER trg_update_test_results_timestamp
    BEFORE UPDATE ON test_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DO $$
BEGIN
    RAISE NOTICE '✅ All tables created successfully';
    RAISE NOTICE '';
END $$;

-- ============================================
-- STEP 4: INSERT SAMPLE DATA
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '📊 Inserting sample data...';
END $$;

-- Insert Departments
INSERT INTO departments (department_name, description) VALUES
('Phòng Hành chính', 'Administrative department'),
('Khoa Nội', 'Internal medicine'),
('Khoa Ngoại', 'Surgery'),
('Khoa Nhi', 'Pediatrics'),
('Khoa Tai Mũi Họng', 'ENT');

-- Insert Positions
INSERT INTO positions (position_name, description) VALUES
('Giám đốc', 'Director'),
('Bác sĩ', 'Doctor'),
('Y tá', 'Nurse'),
('Kế toán', 'Accountant'),
('Lễ tân', 'Receptionist');

-- Insert Users (Employees)
INSERT INTO users (phone_number, card_id, password, full_name, date_of_birth, gender, email, employee_id, position, department, role, status) VALUES
('0000000001', '000000000001', '$2b$10$.e0Ee48ieiUXPIci6nh7TuQtUBY0xxeznREJw0BKR55/Ajo0wr3jK', 'Administrator', '1980-01-01', 'Nam', 'admin@healthcare.com', '0000000001', 'Giám đốc', 'Phòng Hành chính', 'administrator', 'active'),
('0000000002', '000000000002', '$2b$10$0O.kXIoxPVhJfgwr.Lmeceh10LCa0j/P013UNrtdTh4K329mmGhUK', 'Bác sĩ Nguyễn Văn A', '1985-05-15', 'Nam', 'doctor01@healthcare.com', '0000000002', 'Bác sĩ', 'Khoa Nội', 'doctor', 'active'),
('0000000003', '000000000003', '$2b$10$/n7pXV3MYC/rBPs0VSrRJO.ZiZ/igg1OViFA0WhjyyGRQfzsN102O', 'Y tá Trần Thị B', '1990-08-20', 'Nữ', 'nurse01@healthcare.com', '0000000003', 'Y tá', 'Khoa Nội', 'nurse', 'active'),
('0000000004', '000000000004', '$2b$10$HO7fr1svajBaKyfYvBeyiO1MYpd1wuB9Equjw8n2ZGcfFk87QQs26', 'Lễ tân Lê Văn C', '1992-03-10', 'Nam', 'reception01@healthcare.com', '0000000004', 'Lễ tân', 'Phòng Hành chính', 'receptionist', 'active'),
('0000000005', '000000000005', '$2b$10$C/0g1a7iB9/G5moIi5QCc.KLdcuDPZcMkctqEakHOQTKbtwrJu2wa', 'Kế toán Phạm Thị D', '1988-11-25', 'Nữ', 'accountant01@healthcare.com', '0000000005', 'Kế toán', 'Phòng Hành chính', 'accountant', 'active');

-- Insert Employees (extended info)
INSERT INTO employees (user_id, position_id, department_id, business_description, start_date, salary, coefficient, employment_status) VALUES
(1, 1, 1, 'Quản lý điều hành', '2020-01-01', 30000000, 4.0, 'active'),
(2, 2, 2, 'Khám và điều trị bệnh nhân', '2021-03-15', 25000000, 3.5, 'active'),
(3, 3, 2, 'Chăm sóc bệnh nhân', '2021-06-01', 15000000, 2.5, 'active'),
(4, 5, 1, 'Tiếp nhận bệnh nhân', '2021-09-01', 12000000, 2.0, 'active'),
(5, 4, 1, 'Quản lý tài chính', '2021-01-15', 18000000, 2.8, 'active');

-- Insert Sample Patients (registered users)
INSERT INTO users (phone_number, card_id, password, full_name, date_of_birth, gender, email, role, status) VALUES
('0912345678', '001234567890', '$2b$10$placeholder', 'Nguyễn Thị Mai', '1995-03-20', 'Nữ', 'mai.nguyen@email.com', 'patient', 'active'),
('0923456789', '001234567891', '$2b$10$placeholder', 'Trần Văn Hùng', '1988-07-15', 'Nam', 'hung.tran@email.com', 'patient', 'active'),
('0934567890', '001234567892', '$2b$10$placeholder', 'Lê Thị Lan', '2000-12-01', 'Nữ', 'lan.le@email.com', 'patient', 'active'),
('0945678901', '001234567893', '$2b$10$placeholder', 'Phạm Văn Nam', '1992-05-25', 'Nam', 'nam.pham@email.com', 'patient', 'active'),
('0956789012', '001234567894', '$2b$10$placeholder', 'Hoàng Thị Hoa', '1985-09-10', 'Nữ', 'hoa.hoang@email.com', 'patient', 'active');

-- Insert Patient Records
INSERT INTO patients (user_id, patient_code, doctor_in_charge, visit_date, diagnosis, treatment, status) VALUES
(6, 'P2024001', 'Bác sĩ Nguyễn Văn A', '2024-11-15', 'Cảm cúm', 'Thuốc hạ sốt, nghỉ ngơi', 'discharged'),
(7, 'P2024002', 'Bác sĩ Nguyễn Văn A', '2024-11-18', 'Đau đầu', 'Giảm đau, theo dõi', 'active'),
(8, 'P2024003', 'Bác sĩ Nguyễn Văn A', '2024-11-20', 'Dị ứng', 'Thuốc chống dị ứng', 'active'),
(9, 'P2024004', 'Bác sĩ Nguyễn Văn A', '2024-11-19', 'Tiểu đường', 'Insulin, chế độ ăn', 'active'),
(10, 'P2024005', 'Bác sĩ Nguyễn Văn A', '2024-11-21', 'Cao huyết áp', 'Thuốc hạ áp', 'active');

DO $$
BEGIN
    RAISE NOTICE '✅ Sample data inserted';
    RAISE NOTICE '';
END $$;

-- ============================================
-- STEP 5: FINAL VERIFICATION
-- ============================================

DO $$
DECLARE
    table_count INT;
    user_count INT;
    employee_count INT;
    patient_count INT;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ SCHEMA V2 MIGRATION COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';

    SELECT COUNT(*) INTO table_count FROM pg_tables WHERE schemaname = 'public';
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO employee_count FROM employees;
    SELECT COUNT(*) INTO patient_count FROM patients;

    RAISE NOTICE '📊 Statistics:';
    RAISE NOTICE '  - Total tables: %', table_count;
    RAISE NOTICE '  - Users: %', user_count;
    RAISE NOTICE '  - Employees: %', employee_count;
    RAISE NOTICE '  - Patients: %', patient_count;
    RAISE NOTICE '';
    RAISE NOTICE '✨ Key Improvements:';
    RAISE NOTICE '  ✅ Merged accounts + infor_users → users';
    RAISE NOTICE '  ✅ Removed data duplication in insurance/lab tables';
    RAISE NOTICE '  ✅ Added comprehensive CHECK constraints';
    RAISE NOTICE '  ✅ Added NOT NULL for critical fields';
    RAISE NOTICE '  ✅ Standardized naming conventions';
    RAISE NOTICE '  ✅ Optimized Foreign Keys (CASCADE vs SET NULL vs RESTRICT)';
    RAISE NOTICE '  ✅ Auto-update triggers for updated_at';
    RAISE NOTICE '  ✅ Production-ready schema';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Default Login:';
    RAISE NOTICE '  Phone: 0000000001';
    RAISE NOTICE '  Password: admin123';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Next Steps:';
    RAISE NOTICE '  1. Review migration_guide.md for breaking changes';
    RAISE NOTICE '  2. Update API endpoints to use new table/column names';
    RAISE NOTICE '  3. Test all CRUD operations';
    RAISE NOTICE '  4. Update frontend services';
    RAISE NOTICE '========================================';
END $$;

-- Show all tables
SELECT
    tablename as "📋 Table Name",
    CASE
        WHEN tablename IN ('users', 'patients', 'insurance_claims', 'laboratory_tests', 'test_results')
        THEN '⭐ Core'
        WHEN tablename IN ('expenses', 'funds', 'revenue')
        THEN '💰 Financial'
        ELSE '📦 Supporting'
    END as "Category"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
