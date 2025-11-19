-- ============================================
-- MIGRATION 009: Create Accounts Table for Employee Authentication
-- Author: Healthcare Management System
-- Date: 2025-11-19
-- Description: Create accounts table to replace localStorage-based authentication
-- ============================================

-- ============================================
-- ACCOUNTS TABLE (Tài khoản nhân viên)
-- ============================================
CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  employeeId VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  position VARCHAR(100),
  role VARCHAR(50) NOT NULL CHECK (role IN ('administrator', 'doctor', 'nurse', 'receptionist', 'accountant')),
  phone VARCHAR(20),
  email VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CREATE INDEXES for Performance
-- ============================================
CREATE INDEX idx_accounts_employeeId ON accounts(employeeId);
CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_role ON accounts(role);
CREATE INDEX idx_accounts_status ON accounts(status);

-- ============================================
-- CREATE TRIGGER for updated_at
-- ============================================
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT DEFAULT ACCOUNTS (matching localStorage defaults)
-- ============================================
INSERT INTO accounts (employeeId, password, name, department, position, role, phone, email, status)
VALUES
  ('admin', 'admin123', 'Admin', 'Quản trị', 'Quản trị viên', 'administrator', '0123456789', 'admin@healthcare.com', 'active'),
  ('doctor01', 'doctor123', 'Bác sĩ Nguyễn Văn A', 'Bác sĩ chuyên khoa', 'Bác sĩ', 'doctor', '0987654321', 'doctor01@healthcare.com', 'active'),
  ('nurse01', 'nurse123', 'Y tá Trần Thị B', 'Điều dưỡng', 'Y tá', 'nurse', '0912345678', 'nurse01@healthcare.com', 'active'),
  ('reception01', 'reception123', 'Lễ tân Lê Văn C', 'Tiếp tân', 'Lễ tân', 'receptionist', '0901234567', 'reception01@healthcare.com', 'active'),
  ('accountant01', 'accountant123', 'Kế toán Phạm Thị D', 'Kế toán', 'Kế toán trưởng', 'accountant', '0923456789', 'accountant01@healthcare.com', 'active')
ON CONFLICT (employeeId) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE accounts IS 'Bảng tài khoản nhân viên để xác thực và quản lý quyền';
COMMENT ON COLUMN accounts.id IS 'ID tự động tăng';
COMMENT ON COLUMN accounts.employeeId IS 'Mã nhân viên (unique)';
COMMENT ON COLUMN accounts.password IS 'Mật khẩu (nên hash trong production)';
COMMENT ON COLUMN accounts.role IS 'Vai trò: administrator, doctor, nurse, receptionist, accountant';
COMMENT ON COLUMN accounts.status IS 'Trạng thái tài khoản: active hoặc inactive';
