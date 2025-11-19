-- ================================
-- LAB RESULTS TABLE MIGRATION
-- ================================
-- Description: Tạo bảng quản lý kết quả xét nghiệm
-- Created: 2025-11-19
-- ================================

-- Drop table if exists
DROP TABLE IF EXISTS lab_results CASCADE;

-- Create lab_results table
CREATE TABLE lab_results (
    lab_result_id SERIAL PRIMARY KEY,

    -- Patient information
    infor_users_id INTEGER REFERENCES infor_users(infor_users_id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20),
    patient_card_id VARCHAR(12),

    -- Appointment reference (optional)
    appointment_id INTEGER REFERENCES appointments(appointment_id) ON DELETE SET NULL,

    -- Test information
    test_type VARCHAR(255) NOT NULL,
    test_category VARCHAR(100),
    test_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sample_type VARCHAR(100),

    -- Results
    result_values JSONB,
    result_summary TEXT,
    result_status VARCHAR(50) DEFAULT 'normal' CHECK (result_status IN ('normal', 'abnormal', 'critical', 'pending')),

    -- Reference values
    reference_range VARCHAR(255),
    unit VARCHAR(50),

    -- Doctor information
    doctor_id INTEGER REFERENCES infor_users(infor_users_id) ON DELETE SET NULL,
    doctor_name VARCHAR(255),
    doctor_notes TEXT,

    -- Lab technician information
    technician_id INTEGER REFERENCES infor_users(infor_users_id) ON DELETE SET NULL,
    technician_name VARCHAR(255),

    -- File attachments
    attachment_url TEXT,

    -- Status tracking
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'in_progress', 'completed', 'verified')),
    verified_at TIMESTAMP,
    verified_by INTEGER REFERENCES infor_users(infor_users_id) ON DELETE SET NULL,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_lab_results_user_id ON lab_results(infor_users_id);
CREATE INDEX idx_lab_results_appointment_id ON lab_results(appointment_id);
CREATE INDEX idx_lab_results_test_date ON lab_results(test_date DESC);
CREATE INDEX idx_lab_results_status ON lab_results(status);
CREATE INDEX idx_lab_results_result_status ON lab_results(result_status);
CREATE INDEX idx_lab_results_doctor_id ON lab_results(doctor_id);
CREATE INDEX idx_lab_results_technician_id ON lab_results(technician_id);
CREATE INDEX idx_lab_results_test_type ON lab_results(test_type);
CREATE INDEX idx_lab_results_created_at ON lab_results(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_lab_results_updated_at
    BEFORE UPDATE ON lab_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE lab_results IS 'Bảng quản lý kết quả xét nghiệm';
COMMENT ON COLUMN lab_results.result_values IS 'Kết quả chi tiết dạng JSON';
COMMENT ON COLUMN lab_results.result_status IS 'Trạng thái kết quả: normal, abnormal, critical, pending';
COMMENT ON COLUMN lab_results.status IS 'Trạng thái xử lý: pending, in_progress, completed, verified';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ LAB RESULTS TABLE CREATED';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Table: lab_results';
    RAISE NOTICE 'Indexes: 9 indexes created';
    RAISE NOTICE 'Trigger: update_lab_results_updated_at';
    RAISE NOTICE '========================================';
END $$;
