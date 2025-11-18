-- ------/////TẠO BẢNG THÔNG TIN NGƯỜI DÙNG (KHÁCH HÀNG VÀ NHÂN VIÊN)/////--------
-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   username VARCHAR(50) UNIQUE NOT NULL,
--   password VARCHAR(255) NOT NULL
-- );
--   ALTER TABLE users ADD CoLUMN email VARCHAR(100) UNIQUE;
--   ALTER TABLE users ADD CoLUMN phone_number VARCHAR(10) UNIQUE;
--   ALTER TABLE users ADD CoLUMN card_id VARCHAR(12) UNIQUE; --Không được trùng lặp (UNIQUE)
--   ALTER TABLE users ADD CoLUMN full_name VARCHAR(100);
--   ALTER TABLE users ADD CoLUMN date_of_birth DATE;
--   ALTER TABLE users ADD CoLUMN permanent_address VARCHAR(255); --Địa chỉ thường trú
--   ALTER TABLE users ADD CoLUMN current_address VARCHAR(255); --Địa chỉ hiện tại
-- -//ĐỔI TÊN BẢNG THÀNH THÔNG TIN NGƯỜI DÙNG
-- ALTER TABLE users RENAME TO information_user;



-- ------/////TẠO BẢNG XÁC THỰC NGƯỜI DÙNG (ĐĂNG NHẬP/ ĐĂNG KÝ CHO KHÁCH HÀNG VÀ NHÂN VIÊN)/////--------
-- CREATE TABLE auth_users (
--   id SERIAL PRIMARY KEY,
--   employee_id VARCHAR(10) UNIQUE,
--   phone_number VARCHAR(10) UNIQUE,
--   password VARCHAR(255) NOT NULL
-- )

-- INSERT INTO auth_users (employee_id, phone_number, password) VALUES
-- ('0201050607', '0123456789', 'hashed_password_1');
