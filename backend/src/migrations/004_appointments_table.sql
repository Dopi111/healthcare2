-- ================================
-- APPOINTMENTS TABLE MIGRATION
-- ================================
-- Description: Tạo bảng lịch hẹn cho user và guest
-- Created: 2025-11-19
-- ================================

-- Drop table if exists
DROP TABLE IF EXISTS appointments CASCADE;

-- Create appointments table
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,

    -- User information (nullable for guests)
    infor_users_id INTEGER REFERENCES infor_users(infor_users_id) ON DELETE SET NULL,

    -- Guest information (required if not logged in)
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),

    -- Appointment details
    specialty VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255),
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    notes TEXT,

    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    confirmed_by INTEGER REFERENCES infor_users(infor_users_id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_appointments_user_id ON appointments(infor_users_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_phone ON appointments(phone_number);
CREATE INDEX idx_appointments_created_at ON appointments(created_at DESC);

-- Add comments
COMMENT ON TABLE appointments IS 'Bảng quản lý lịch hẹn khám bệnh';
COMMENT ON COLUMN appointments.infor_users_id IS 'ID của user (NULL nếu là guest)';
COMMENT ON COLUMN appointments.status IS 'Trạng thái: pending (chờ xác nhận), confirmed (đã xác nhận), cancelled (đã hủy), completed (đã hoàn thành)';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ APPOINTMENTS TABLE CREATED';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Table: appointments';
    RAISE NOTICE 'Indexes: 5 indexes created';
    RAISE NOTICE '========================================';
END $$;
