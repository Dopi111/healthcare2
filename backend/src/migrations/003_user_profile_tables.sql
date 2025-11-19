-- ============================================
-- USER PROFILE TABLES MIGRATION
-- Author: Healthcare Management System
-- Date: 2025-11-19
-- Description: Tables for user profile information
-- ============================================

-- ============================================
-- 1. EXTEND infor_users TABLE
-- ============================================
-- Add email column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'infor_users' AND column_name = 'email'
    ) THEN
        ALTER TABLE infor_users ADD COLUMN email VARCHAR(255);
    END IF;
END $$;

-- ============================================
-- 2. USER MEDICAL INFORMATION TABLE
-- ============================================
DROP TABLE IF EXISTS user_medical_info CASCADE;

CREATE TABLE user_medical_info (
  medical_info_id SERIAL PRIMARY KEY,
  infor_users_id INTEGER NOT NULL,
  blood_type VARCHAR(5) CHECK (blood_type IN ('A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  height DECIMAL(5, 2), -- cm
  weight DECIMAL(5, 2), -- kg
  allergies TEXT,
  chronic_diseases TEXT,
  medications TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Foreign Keys
  CONSTRAINT fk_medical_info_user FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE CASCADE
);

-- ============================================
-- 3. USER RELATIVES TABLE
-- ============================================
DROP TABLE IF EXISTS user_relatives CASCADE;

CREATE TABLE user_relatives (
  relative_id SERIAL PRIMARY KEY,
  infor_users_id INTEGER NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  relation VARCHAR(50) NOT NULL, -- Cha, Mẹ, Vợ, Chồng, Con, Anh, Chị, Em
  phone_number VARCHAR(10),
  email VARCHAR(255),
  address TEXT,
  is_emergency_contact BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Foreign Keys
  CONSTRAINT fk_relatives_user FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE CASCADE,

  -- Constraints
  CONSTRAINT check_relative_phone_format CHECK (phone_number IS NULL OR phone_number ~ '^\d{10}$')
);

-- ============================================
-- 4. USER MEDICAL HISTORY TABLE
-- ============================================
DROP TABLE IF EXISTS user_medical_history CASCADE;

CREATE TABLE user_medical_history (
  history_id SERIAL PRIMARY KEY,
  infor_users_id INTEGER NOT NULL,
  visit_date DATE NOT NULL,
  clinic_name VARCHAR(255),
  doctor_name VARCHAR(100),
  department VARCHAR(100),
  diagnosis TEXT,
  treatment TEXT,
  prescription TEXT,
  notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Foreign Keys
  CONSTRAINT fk_medical_history_user FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE CASCADE
);

-- ============================================
-- 5. CREATE INDEXES for Performance
-- ============================================

-- Indexes for user_medical_info
CREATE INDEX idx_medical_info_user ON user_medical_info(infor_users_id);
CREATE INDEX idx_medical_info_blood_type ON user_medical_info(blood_type) WHERE blood_type IS NOT NULL;

-- Indexes for user_relatives
CREATE INDEX idx_relatives_user ON user_relatives(infor_users_id);
CREATE INDEX idx_relatives_emergency ON user_relatives(infor_users_id, is_emergency_contact) WHERE is_emergency_contact = TRUE;

-- Indexes for user_medical_history
CREATE INDEX idx_medical_history_user ON user_medical_history(infor_users_id);
CREATE INDEX idx_medical_history_date ON user_medical_history(visit_date DESC);
CREATE INDEX idx_medical_history_user_date ON user_medical_history(infor_users_id, visit_date DESC);

-- ============================================
-- 6. CREATE TRIGGERS for updated_at
-- ============================================

CREATE TRIGGER update_medical_info_updated_at
  BEFORE UPDATE ON user_medical_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relatives_updated_at
  BEFORE UPDATE ON user_relatives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_history_updated_at
  BEFORE UPDATE ON user_medical_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. INSERT SAMPLE DATA for Testing
-- ============================================

-- Sample user (assuming infor_users_id = 1 exists or will be created)
-- Insert medical info for demo user
INSERT INTO user_medical_info (infor_users_id, blood_type, height, weight, allergies, chronic_diseases, medications, notes)
VALUES
  (1, 'A+', 170.5, 68.0, 'Không có', 'Không có', 'Không có', 'Sức khỏe tốt')
ON CONFLICT DO NOTHING;

-- Sample relatives
INSERT INTO user_relatives (infor_users_id, full_name, relation, phone_number, is_emergency_contact)
VALUES
  (1, 'Trần Văn Hòa', 'Cha', '0909123456', TRUE),
  (1, 'Nguyễn Thị Hoa', 'Mẹ', '0909988776', TRUE)
ON CONFLICT DO NOTHING;

-- Sample medical history
INSERT INTO user_medical_history (infor_users_id, visit_date, clinic_name, diagnosis, treatment)
VALUES
  (1, '2024-03-12', 'Phòng khám Quận 1', 'Cảm cúm', 'Nghỉ ngơi, uống nhiều nước'),
  (1, '2024-06-01', 'Phòng khám Trung Tâm', 'Khám định kỳ', 'Tình trạng sức khỏe tốt')
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. VERIFICATION
-- ============================================

DO $$
DECLARE
  medical_info_count INTEGER;
  relatives_count INTEGER;
  history_count INTEGER;
BEGIN
  -- Count records
  SELECT COUNT(*) INTO medical_info_count FROM user_medical_info;
  SELECT COUNT(*) INTO relatives_count FROM user_relatives;
  SELECT COUNT(*) INTO history_count FROM user_medical_history;

  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ USER PROFILE TABLES CREATED';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Medical Info Records: %', medical_info_count;
  RAISE NOTICE 'Relatives Records: %', relatives_count;
  RAISE NOTICE 'Medical History Records: %', history_count;
  RAISE NOTICE '========================================';
END $$;

-- ============================================
-- END OF USER PROFILE MIGRATION
-- ============================================
