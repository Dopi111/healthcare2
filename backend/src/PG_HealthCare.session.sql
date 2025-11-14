-- ------/////BẢNG NGƯỜI DÙNG (KHÁCH HÀNG / NHÂN VIÊN)/////--------
-- CREATE TABLE infor_users (
--   id SERIAL PRIMARY KEY,
--   employee_id VARCHAR(10) UNIQUE, --Dùng để đăng nhập nhân viên
--   phone_number VARCHAR(10) UNIQUE NOT NULL, --Dùng để đăng nhập khách hàng
--   password VARCHAR(255) NOT NULL, --Dùng để đăng nhập nhân viên/ khách hàng
--   card_id VARCHAR(12) UNIQUE NOT NULL,
--   full_name VARCHAR(100),
--   date_of_birth DATE,
--   permanent_address VARCHAR(255),
--   current_address VARCHAR(255),
--   role_user varchar(20) DEFAULT 'users', -- Phân quyền (users, employees, admins)
--   -- Nhân viên 
--   position VARCHAR(50), -- Chức vụ
--   department VARCHAR(50), -- Phòng ban
--   started_date DATE, -- Ngày bắt đầu làm việc
--   salary INT, -- Lương cơ bản
--   status_employee VARCHAR(20) DEFAULT 'active' -- Trạng thái làm việc (active, inactive, on_leave)
-- );
-- ALTER TABLE infor_users ADD column gender INT


-- ------/////BẢNG BÁC SĨ/ Y Tá / Điều dưỡng //////--------
-- CREATE TABLE infor_doctor_nurse(
--   doctor_nurse_id varchar(10) PRIMARY KEY NOT NULL,
--   Specialty varchar(100), --Chuyên khoa
--   educational_level varchar(100), --Trình độ
--   experience varchar(100), --Kinh nghiệm
--   professtional_license varchar(100), --giấy phép hành ngheè
--   professtional_description varchar(255), --mô tả
--   card_id varchar(12) UNIQUE not NULL,
--   CONSTRAINT fk_cardid_infor_user_doctor FOREIGN KEY (card_id) REFERENCES infor_users(card_id)
-- );


-- ------/////BẢNG Thông tin hành chính/ công việc //////--------
-- CREATE TABLE infor_work_employee (
--   id_work_information serial PRIMARY KEY,
--   id_schedule_doctor INT UNIQUE,  --Lịch làm việc (lưu vào chuối + tạo bảng lịch riêng)
--   business varchar(100), --Phòng khám / bệnh viện công tác
--   status_work varchar(50), --Trang thái làm việc (làm việc, nghỉ phép, nghỉ hưu)
--   doctor_nurse_id varchar(10) NOT NULL,
--   FOREIGN KEY (doctor_nurse_id) REFERENCES infor_doctor_nurse(doctor_nurse_id)
-- );

-- ALTER TABLE infor_work_employee ADD column 


-- ------/////BẢNG Lịch của BÁC SĨ //////--------
-- CREATE TABLE shedule_doctor (
--   id_schedule_doctor serial PRIMARY KEY,
--   date_work date NOT NULL, 
--   description_work_in varchar(255), --mô tả công việc
--   status_work varchar(20) DEFAULT 'not yet examined',
--   CONSTRAINT fk_work_schedule FOREIGN KEY (id_schedule_doctor) REFERENCES infor_work_employee(id_schedule_doctor)
-- );



-- ------/////BẢNG Thông tin bệnh nhân //////--------
-- CREATE TABLE infor_medical_users(
--   infor_medical_id serial PRIMARY key,
--   bhyt_id varchar(17) UNIQUE NOT null,
--   card_id varchar(12) UNIQUE not null, 
--   blood_type varchar(5), --Loại máu
--   medical_history varchar (255), --Lịch sử khám
--   allergy varchar(255), --Dị ứng
--   note_users varchar(255), --ghi chú
--   created_date date NOT NULL, --Ngày tạo hồ sơ
--   update_new_date date, --Cập nhật mới nhất
--   status_medical_users varchar DEFAULT 'not yet examined',
--   -- Under treatment (đang điều trị) / Discharged (xuất viện) / Deleted / Paused
--   FOREIGN key (card_id) REFERENCES infor_users(card_id)
-- );

-- ------/////Bảng lịch của bệnh nhân //////--------
-- CREATE TABLE schadule_patient(
--   schadule_patient_id serial PRIMARY key not null,
--   infor_medical_id INT not null, --Bảng infor_medical_users
--   doctor_nurse_id varchar(10), --Bảng infor_doctor_nurse
--   examination_day date, --Ngày khám
--   examination_hour time, --Giờ khám
--   clinic varchar(50), -- Phòng khám
--   reason_examination text, -- Lý do khám
--   status_schadule_patient varchar(30) DEFAULT 'booked', --Checked | Cancle | Pending
--   FOREIGN key (infor_medical_id) REFERENCES infor_medical_users(infor_medical_id),
--   FOREIGN key (doctor_nurse_id) REFERENCES infor_doctor_nurse(doctor_nurse_id)
-- );

-- --9:00AM-11/11 update coulum
-- ALTER TABLE work_schedule_list_doctor ADD column work_shift time; 


-- ------/////Bảng chức vụ (position) //////--------
-- ------/////Bảng phòng ban (department) //////--------



-- Healthcare data model (PostgreSQL)
-- File: healthcare_schema.sql
-- Tạo theo ERD do người dùng cung cấp (đã chuẩn hóa tên cột / FK)

-- Xóa các bảng (theo thứ tự tránh vi phạm FK)
DROP TABLE IF EXISTS schadule_patient_with_doctor CASCADE;
DROP TABLE IF EXISTS schadule_patient CASCADE;
DROP TABLE IF EXISTS infor_medical_users CASCADE;
DROP TABLE IF EXISTS schedule_employee CASCADE;
DROP TABLE IF EXISTS infor_expertise_doctor_nurse CASCADE;
DROP TABLE IF EXISTS infor_employee CASCADE;
DROP TABLE IF EXISTS infor_auth_employee CASCADE;
DROP TABLE IF EXISTS infor_auth_user CASCADE;
DROP TABLE IF EXISTS infor_users CASCADE;
DROP TABLE IF EXISTS list_position CASCADE;
DROP TABLE IF EXISTS list_department CASCADE;

-- -----------------------
-- Danh sách phòng ban
-- -----------------------
CREATE TABLE list_department (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL
);
INSERT INTO list_department (department_name) VALUES ('System');


-- -----------------------
-- Danh sách chức vụ
-- -----------------------
CREATE TABLE list_position (
  position_id SERIAL PRIMARY KEY,
  position_name VARCHAR(100) NOT NULL,
  department_id INT,
  CONSTRAINT fk_position_department FOREIGN KEY (department_id) REFERENCES list_department(department_id) ON DELETE SET NULL
);
insert into list_position (position_name,department_id)
VALUES('Admin', 1)


-- -----------------------
-- Thông tin chung (khách hàng / nhân viên)
-- -----------------------
CREATE TABLE infor_users (
  infor_users_id SERIAL PRIMARY KEY,
  phone_number VARCHAR(10) UNIQUE,
  card_id VARCHAR(12) UNIQUE,
  full_name VARCHAR(100),
  date_of_birth DATE,
  gender INT,
  permanent_address VARCHAR(255),
  current_address VARCHAR(255)
);


-- -----------------------
-- Thông tin nhân viên (kế thừa infor_users)
-- -----------------------
CREATE TABLE infor_employee (
  infor_employee_id SERIAL PRIMARY KEY,
  infor_users_id INT UNIQUE NOT NULL,
  position_id INT,                 -- FK tới list_position.position_id
  department_id INT,               -- FK tới list_department.department_id (tiện cho lookup nhanh)
  business VARCHAR(200),           -- chi nhánh / cơ sở
  started_date DATE,
  salary INT,
  coefficient NUMERIC(8,2),        -- hệ số lương (decimal)
  attached INT,                    -- gắn bó (số tháng/năm - tuỳ bạn interpret)
  status_employee VARCHAR(20) DEFAULT 'active',
  CONSTRAINT fk_employee_user FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE CASCADE,
  CONSTRAINT fk_employee_position FOREIGN KEY (position_id) REFERENCES list_position(position_id) ON DELETE SET NULL,
  CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES list_department(department_id) ON DELETE SET NULL
);

-- -----------------------
-- Thông tin chuyên môn cho bác sĩ / y tá
-- -----------------------
CREATE TABLE infor_expertise_doctor_nurse (
  doctor_nurse_id SERIAL PRIMARY KEY,
  infor_employee_id INT NOT NULL UNIQUE,
  specialty VARCHAR(150),
  educational_level VARCHAR(150),
  experience TEXT,
  professional_license VARCHAR(150),
  professional_description VARCHAR(400),
  CONSTRAINT fk_expertise_employee FOREIGN KEY (infor_employee_id) REFERENCES infor_employee(infor_employee_id) ON DELETE CASCADE
);

-- -----------------------
-- Lịch làm việc của nhân viên (bác sĩ, y tá, ...)
-- -----------------------
CREATE TABLE schedule_employee (
  schedule_employee_id SERIAL PRIMARY KEY,
  infor_employee_id INT NOT NULL,
  date_work DATE,
  work_shift TIME,
  work_location VARCHAR(150),
  description_work_in VARCHAR(400),
  status_work VARCHAR(20) DEFAULT 'ready',
  CONSTRAINT fk_schedule_employee FOREIGN KEY (infor_employee_id) REFERENCES infor_employee(infor_employee_id) ON DELETE CASCADE
);

-- -----------------------
-- Hồ sơ y tế của người dùng (khách hàng)
-- -----------------------
CREATE TABLE infor_medical_users (
  infor_medical_id SERIAL PRIMARY KEY,
  bhyt_id VARCHAR(17) UNIQUE,
  card_id VARCHAR(12) UNIQUE NOT NULL,
  blood_type VARCHAR(5),
  medical_history TEXT,
  allergy TEXT,
  note_users TEXT,
  created_date DATE DEFAULT CURRENT_DATE,
  update_new_date DATE,
  status_medical_users VARCHAR(50) DEFAULT 'not yet examined',
  CONSTRAINT fk_medical_user_card FOREIGN KEY (card_id) REFERENCES infor_users(card_id) ON DELETE CASCADE
);

-- -----------------------
-- Lịch đăng ký khám bệnh của khách hàng
-- (Ở đây map card_id -> hồ sơ y tế; bạn có thể đổi để trỏ tới infor_medical_users.infor_medical_id nếu muốn)
-- -----------------------
CREATE TABLE schadule_patient (
  schadule_patient_id SERIAL PRIMARY KEY,
  card_id VARCHAR(12) NOT NULL,
  examination_day DATE,
  examination_hour TIME,
  clinic VARCHAR(100),
  reason_examination TEXT,
  status_schadule_patient VARCHAR(30) DEFAULT 'booked',
  CONSTRAINT fk_schadule_patient_card FOREIGN KEY (card_id) REFERENCES infor_medical_users(card_id) ON DELETE CASCADE
);

-- -----------------------
-- Bảng hẹn (liên kết bệnh nhân - bác sĩ)
-- -----------------------
CREATE TABLE schadule_patient_with_doctor (
  schadule_patient_with_doctor_id SERIAL PRIMARY KEY,
  date_medical_examination DATE,
  hour_medical_examination TIME,
  infor_employee_id INT NOT NULL,
  infor_users_id INT NOT NULL,
  CONSTRAINT fk_spwd_employee FOREIGN KEY (infor_employee_id) REFERENCES infor_employee(infor_employee_id) ON DELETE CASCADE,
  CONSTRAINT fk_spwd_user FOREIGN KEY (infor_users_id) REFERENCES infor_users(infor_users_id) ON DELETE CASCADE
);

-- -----------------------
-- Bảng xác thực khách hàng (login)
-- -----------------------
CREATE TABLE infor_auth_user (
  infor_auth_user_id SERIAL PRIMARY KEY,
  phone_number VARCHAR(10) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_authuser_phone FOREIGN KEY (phone_number) REFERENCES infor_users(phone_number) ON DELETE CASCADE
);

-- -----------------------
-- Bảng xác thực nhân viên (login employee)
-- Lưu ý: employee_id ở đây map tới infor_employee.infor_employee_id
-- -----------------------
CREATE TABLE infor_auth_employee (
  infor_auth_employee_id SERIAL PRIMARY KEY,
  employee_id INT UNIQUE NOT NULL,         -- map đến infor_employee.infor_employee_id
  password_employee VARCHAR(255) NOT NULL,
  position VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_authemployee_employee FOREIGN KEY (employee_id) REFERENCES infor_employee(infor_employee_id) ON DELETE CASCADE
);

-- -----------------------
-- Index tối ưu (nếu cần)
-- -----------------------
CREATE INDEX idx_users_cardid ON infor_users(card_id);
CREATE INDEX idx_medical_cardid ON infor_medical_users(card_id);
CREATE INDEX idx_employee_userid ON infor_employee(infor_users_id);
CREATE INDEX idx_schedule_emp ON schedule_employee(infor_employee_id);

--Timeline: 03:00 AM: Cập nhật lại toàn bộ bảng, thêm bảng, xoá bảng...
--Sử dụng bảng auth_user cho đăng nhập khách hàng (map tham chiếu với phone_number)
--Sử dụng bảng auth_employee cho đăng nhập nhân viên (map tham chiếu với employee)

DROP TABLE IF EXISTS shedule_doctor CASCADE;