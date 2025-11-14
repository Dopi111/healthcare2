import express from 'express';
import employeesRouters from './routes/employeesRouters.js'
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Cho phép từ frontend
app.use(express.json())

app.use(("/api/employee"), employeesRouters);

const ensureDefaultAdmin = async () => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const full_name = 'Admin System';
  const position = 'Admin';
  const department_id = 1; // giả sử đã có phòng ban IT
  const phone_number = '0000000000'; //tránh null

  try {
    //Kiểm tra xem có admin nào chưa
    const authCheck = await pool.query(
    `SELECT 1 FROM infor_auth_employee WHERE position = 'Admin' LIMIT 1`
    );

    const userCheck = await pool.query(
        'SELECT 1 FROM infor_users WHERE phone_number = $1',
        [phone_number]
    );

    if (authCheck.rowCount === 0 && userCheck.rowCount === 0) {
        //Tạo user
      const userResult = await pool.query(
        `INSERT INTO infor_users (phone_number, full_name)
         VALUES ($1, $2)
         RETURNING infor_users_id`,
        [phone_number, full_name]
      );
      const infor_users_id = userResult.rows[0].infor_users_id;

      //Tạo nhân viên (employee)
      const employeeResult = await pool.query(
        `INSERT INTO infor_employee (infor_users_id, position_id, department_id, status_employee)
         VALUES ($1, NULL, $2, 'active')
         RETURNING infor_employee_id`,
        [infor_users_id, department_id]
      );
      const employee_id = employeeResult.rows[0].infor_employee_id;

      //Tạo auth
      const hashed = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        `INSERT INTO infor_auth_employee (employee_id, password_employee, position)
         VALUES ($1, $2, $3)`,
        [employee_id, hashed, position]
      );

      console.log(`✅ Default admin created successfully. Employee ID: ${employee_id}`);
    } else {
        console.log('ℹ️ Default admin already exists.');
    }
  } catch (err) {
    console.error('❌ Error ensuring default admin:', err.message || err);
  }
};

const start = async () => {
        await ensureDefaultAdmin();

        app.listen(PORT, () => {
                console.log(`Start Server on Port: ${PORT}`);
        });
};

start();



