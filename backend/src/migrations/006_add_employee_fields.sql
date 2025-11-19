-- Add email, position, department, specialty fields to infor_users table
-- for easier employee management

ALTER TABLE infor_users
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS position VARCHAR(100),
ADD COLUMN IF NOT EXISTS department VARCHAR(100),
ADD COLUMN IF NOT EXISTS specialty VARCHAR(100);

-- Add index for email for faster lookups
CREATE INDEX IF NOT EXISTS idx_infor_users_email ON infor_users(email);

-- Add comment explaining these fields
COMMENT ON COLUMN infor_users.email IS 'Email address for employees and users';
COMMENT ON COLUMN infor_users.position IS 'Job position/title (e.g., Bác sĩ, Y tá, KTV)';
COMMENT ON COLUMN infor_users.department IS 'Department name (e.g., Khoa nội, Khoa ngoại)';
COMMENT ON COLUMN infor_users.specialty IS 'Medical specialty (e.g., Tim mạch, Tiêu hóa)';
