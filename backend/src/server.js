import express from 'express';
import employeesRouters from './routes/employeesRouters.js'
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import bcrypt from 'bcryptjs';

// Import Swagger
import { swaggerUi, swaggerSpec } from './swagger.js';

// Import new API routes
import laboratoryRoutes from './routes/laboratoryRoutes.js';
import fundRoutes from './routes/fundRoutes.js';
import revenueRoutes from './routes/revenueRoutes.js';
import insuranceRoutes from './routes/insuranceRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import positionRoutes from './routes/positionRoutes.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Cho phép từ frontend
app.use(express.json())

// Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Existing routes
app.use(("/api/employee"), employeesRouters);
app.use('/api/department', departmentRoutes);
app.use('/api/position', positionRoutes);

// New REST API routes
app.use('/api/laboratory', laboratoryRoutes);
app.use('/api/fund', fundRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/account', accountRoutes);

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
                console.log(`🚀 Server running on http://localhost:${PORT}`);
                console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
        });
};

start();



