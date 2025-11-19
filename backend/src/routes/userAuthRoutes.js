import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/user-auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - password
 *               - full_name
 *               - card_id
 *               - date_of_birth
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "0987654321"
 *               password:
 *                 type: string
 *                 example: "User@123"
 *               full_name:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               card_id:
 *                 type: string
 *                 example: "123456789012"
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               gender:
 *                 type: string
 *                 enum: [Nam, Nữ, Khác]
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               permanent_address:
 *                 type: string
 *               current_address:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request - validation error
 *       409:
 *         description: User already exists
 */
router.post('/register', async (req, res) => {
  const {
    phone_number,
    password,
    full_name,
    card_id,
    date_of_birth,
    gender,
    email,
    permanent_address,
    current_address
  } = req.body;

  try {
    // Validate required fields
    if (!phone_number || !password || !full_name || !card_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (SĐT, mật khẩu, họ tên, CCCD)'
      });
    }

    // Check if user already exists
    const userCheck = await pool.query(
      'SELECT * FROM infor_users WHERE phone_number = $1 OR card_id = $2',
      [phone_number, card_id]
    );

    if (userCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Số điện thoại hoặc số CCCD đã được đăng ký'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await pool.query(
      `INSERT INTO infor_users
       (phone_number, card_id, password, full_name, date_of_birth, gender,
        email, permanent_address, current_address, role_user)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'users')
       RETURNING infor_users_id, phone_number, full_name, email`,
      [phone_number, card_id, hashedPassword, full_name, date_of_birth,
       gender, email, permanent_address, current_address]
    );

    const newUser = result.rows[0];

    // Create empty medical info record
    await pool.query(
      'INSERT INTO user_medical_info (infor_users_id) VALUES ($1)',
      [newUser.infor_users_id]
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      data: {
        user_id: newUser.infor_users_id,
        phone_number: newUser.phone_number,
        full_name: newUser.full_name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

/**
 * @swagger
 * /api/user-auth/login:
 *   post:
 *     summary: Login user account
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - password
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "0987654321"
 *               password:
 *                 type: string
 *                 example: "User@123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post('/login', async (req, res) => {
  const { phone_number, password } = req.body;

  try {
    // Validate input
    if (!phone_number || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ số điện thoại và mật khẩu'
      });
    }

    // Find user
    const result = await pool.query(
      `SELECT infor_users_id, phone_number, password, full_name,
              email, date_of_birth, gender, role_user
       FROM infor_users
       WHERE phone_number = $1 AND role_user = 'users'`,
      [phone_number]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Số điện thoại không tồn tại hoặc chưa đăng ký'
      });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không chính xác'
      });
    }

    // Return user data (without password)
    delete user.password;

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công!',
      data: {
        user_id: user.infor_users_id,
        phone_number: user.phone_number,
        full_name: user.full_name,
        email: user.email,
        date_of_birth: user.date_of_birth,
        gender: user.gender,
        role: user.role_user
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

/**
 * @swagger
 * /api/user-auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [User Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - old_password
 *               - new_password
 *             properties:
 *               phone_number:
 *                 type: string
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Old password incorrect
 */
router.put('/change-password', async (req, res) => {
  const { phone_number, old_password, new_password } = req.body;

  try {
    if (!phone_number || !old_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Get user
    const result = await pool.query(
      'SELECT * FROM infor_users WHERE phone_number = $1 AND role_user = $2',
      [phone_number, 'users']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    const user = result.rows[0];

    // Verify old password
    const isValid = await bcrypt.compare(old_password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu cũ không chính xác'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await pool.query(
      'UPDATE infor_users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE infor_users_id = $2',
      [hashedPassword, user.infor_users_id]
    );

    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công!'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

export default router;
