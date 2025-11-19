import express from 'express';
import employeesRouters from './routes/employeesRouters.js'
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import bcrypt from 'bcryptjs';

// Import Swagger
import { swaggerUi, swaggerSpec } from './swagger.js';

// Import core routes
import accountRoutes from './routes/accountRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import positionRoutes from './routes/positionRoutes.js';
import patientsRoutes from './routes/patientsRoutes.js';
import userAuthRoutes from './routes/userAuthRoutes.js';
import userProfileRoutes from './routes/userProfileRoutes.js';
import appointmentsRoutes from './routes/appointmentsRoutes.js';
import labResultsRoutes from './routes/labResultsRoutes.js';

// Import database-backed routes (main API)
import patientsNewRoutes from './routes/patientsNewRoutes.js';
import expensesNewRoutes from './routes/expensesNewRoutes.js';
import fundsNewRoutes from './routes/fundsNewRoutes.js';
import insuranceNewRoutes from './routes/insuranceNewRoutes.js';
import revenueNewRoutes from './routes/revenueNewRoutes.js';
import laboratoryTestsRoutes from './routes/laboratoryTestsRoutes.js';
import testResultsNewRoutes from './routes/testResultsNewRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Cho phép từ frontend
app.use(express.json())

// Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Core routes
app.use('/api/employee', employeesRouters);
app.use('/api/department', departmentRoutes);
app.use('/api/position', positionRoutes);
app.use('/api/account', accountRoutes);

// User routes
app.use('/api/patients', patientsRoutes);  // User info only (from infor_users)
app.use('/api/user-auth', userAuthRoutes);
app.use('/api/user-profile', userProfileRoutes);

// Medical routes
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/lab-results', labResultsRoutes);

// Medical records & operations (main database-backed API)
app.use('/api/patients-new', patientsNewRoutes);
app.use('/api/expenses-new', expensesNewRoutes);
app.use('/api/funds-new', fundsNewRoutes);
app.use('/api/insurance-new', insuranceNewRoutes);
app.use('/api/revenue-new', revenueNewRoutes);
app.use('/api/laboratory-tests', laboratoryTestsRoutes);
app.use('/api/test-results-new', testResultsNewRoutes);

const ensureDefaultAdmin = async () => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const full_name = 'Admin System';
  const position = 'Admin';
  const phone_number = '0000000000'; // Tránh null
  const card_id = '000000000000'; // Card ID mặc định cho admin (12 số)
  const role_user = 'employee'; // Admin là employee
  const employee_id_str = '0000000001'; // Employee ID mặc định cho admin (10 số)

  try {
    // Kiểm tra xem có admin nào chưa
    const authCheck = await pool.query(
      `SELECT 1 FROM infor_auth_employee WHERE position = 'Admin' LIMIT 1`
    );

    const userCheck = await pool.query(
      'SELECT 1 FROM infor_users WHERE phone_number = $1',
      [phone_number]
    );

    if (authCheck.rowCount === 0 && userCheck.rowCount === 0) {
      // Lấy department_id hợp lệ từ database (Phòng Hành chính)
      const deptResult = await pool.query(
        `SELECT department_id FROM list_department WHERE department_name = 'Phòng Hành chính' LIMIT 1`
      );

      const department_id = deptResult.rows.length > 0 ? deptResult.rows[0].department_id : null;

      // Tạo user
      const userResult = await pool.query(
        `INSERT INTO infor_users (phone_number, full_name, card_id, role_user, employee_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING infor_users_id`,
        [phone_number, full_name, card_id, role_user, employee_id_str]
      );
      const infor_users_id = userResult.rows[0].infor_users_id;

      // Tạo nhân viên (employee) - department_id có thể là NULL nếu không tìm thấy
      const employeeResult = await pool.query(
        `INSERT INTO infor_employee (infor_users_id, position_id, department_id, status_employee)
         VALUES ($1, NULL, $2, 'active')
         RETURNING infor_employee_id`,
        [infor_users_id, department_id]
      );
      const infor_employee_id = employeeResult.rows[0].infor_employee_id;

      // Tạo auth
      const hashed = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        `INSERT INTO infor_auth_employee (employee_id, password_employee, position)
         VALUES ($1, $2, $3)`,
        [employee_id_str, hashed, position]
      );

      console.log(`✅ Default admin created successfully. Employee ID: ${employee_id_str}, Department: ${department_id || 'None'}`);
    } else {
      console.log('ℹ️ Default admin already exists.');
    }
  } catch (err) {
    console.error('❌ Error ensuring default admin:', err.message || err);
    // Log thêm chi tiết để debug
    if (err.constraint) {
      console.error('   Constraint violation:', err.constraint);
      console.error('   Detail:', err.detail);
    }
  }
};

const start = async () => {
        await ensureDefaultAdmin();

        app.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
                console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
        });
};

start();



