-- ============================================
-- HEALTHCARE DATABASE INITIALIZATION SCRIPT
-- Author: Healthcare Management System
-- Date: 2024-11-18
-- Description: Complete database schema for healthcare management system
-- ============================================

-- ============================================
-- 1. CREATE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. DROP EXISTING TABLES (if any)
-- ============================================
DROP TABLE IF EXISTS infor_employee CASCADE;
DROP TABLE IF EXISTS infor_auth_employee CASCADE;
DROP TABLE IF EXISTS infor_users CASCADE;
DROP TABLE IF EXISTS list_position CASCADE;
DROP TABLE IF EXISTS list_department CASCADE;

-- ============================================
-- 3. CREATE CORE TABLES
-- ============================================

-- 3.1. Table: list_department (Danh sách phòng ban)
CREATE TABLE list_department (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.2. Table: list_position (Danh sách chức vụ)
CREATE TABLE list_position (
  position_id SERIAL PRIMARY KEY,
  position_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.3. Table: infor_users (Thông tin người dùng - Bệnh nhân và Nhân viên)
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT check_employee_id_format CHECK (employee_id IS NULL OR employee_id ~ '^\d{10}$'),
  CONSTRAINT check_phone_format CHECK (phone_number ~ '^\d{10}$'),
  CONSTRAINT check_card_id_format CHECK (card_id ~ '^\d{12}$')
);

-- 3.4. Table: infor_employee (Chi tiết thông tin nhân viên)
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

  -- Foreign Keys
  CONSTRAINT fk_employee_users FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE CASCADE,
  CONSTRAINT fk_employee_position FOREIGN KEY (position_id) REFERENCES list_position(position_id) ON DELETE SET NULL,
  CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES list_department(department_id) ON DELETE SET NULL
);

-- 3.5. Table: infor_auth_employee (Xác thực nhân viên - Legacy/Alternative auth)
CREATE TABLE infor_auth_employee (
  infor_auth_employee_id SERIAL PRIMARY KEY,
  employee_id VARCHAR(10) UNIQUE NOT NULL,
  password_employee VARCHAR(255) NOT NULL,
  position VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT check_auth_employee_id_format CHECK (employee_id ~ '^\d{10}$')
);

-- ============================================
-- 4. CREATE INDEXES for Performance
-- ============================================

-- Indexes for infor_users
CREATE INDEX idx_users_role ON infor_users(role_user);
CREATE INDEX idx_users_phone ON infor_users(phone_number);
CREATE INDEX idx_users_card ON infor_users(card_id);
CREATE INDEX idx_users_employee_id ON infor_users(employee_id) WHERE employee_id IS NOT NULL;
CREATE INDEX idx_users_created_at ON infor_users(created_at DESC);

-- Indexes for infor_employee
CREATE INDEX idx_employee_users_id ON infor_employee(infor_users_id);
CREATE INDEX idx_employee_position ON infor_employee(position_id);
CREATE INDEX idx_employee_department ON infor_employee(department_id);
CREATE INDEX idx_employee_status ON infor_employee(status_employee);

-- Indexes for lookups
CREATE INDEX idx_position_name ON list_position(position_name);
CREATE INDEX idx_department_name ON list_department(department_name);

-- ============================================
-- 5. CREATE TRIGGERS for updated_at
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON infor_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_updated_at
  BEFORE UPDATE ON infor_employee
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_position_updated_at
  BEFORE UPDATE ON list_position
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_department_updated_at
  BEFORE UPDATE ON list_department
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auth_employee_updated_at
  BEFORE UPDATE ON infor_auth_employee
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. INSERT DEFAULT DATA (Departments & Positions)
-- ============================================

-- Insert default departments
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

-- Insert default positions
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

-- ============================================
-- 7. VERIFICATION
-- ============================================

DO $$
DECLARE
  table_count INTEGER;
  department_count INTEGER;
  position_count INTEGER;
BEGIN
  -- Count tables
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    AND table_name IN ('infor_users', 'infor_employee', 'list_department', 'list_position', 'infor_auth_employee');

  -- Count departments
  SELECT COUNT(*) INTO department_count FROM list_department;

  -- Count positions
  SELECT COUNT(*) INTO position_count FROM list_position;

  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ DATABASE INITIALIZATION COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables created: %', table_count;
  RAISE NOTICE 'Departments: %', department_count;
  RAISE NOTICE 'Positions: %', position_count;
  RAISE NOTICE '========================================';
END $$;

-- ============================================
-- END OF SCHEMA INITIALIZATION
-- ============================================
