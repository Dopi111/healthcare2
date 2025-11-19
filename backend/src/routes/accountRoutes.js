import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/account:
 *   get:
 *     summary: Lấy danh sách tài khoản
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Danh sách tài khoản (không bao gồm mật khẩu)
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, employee_id, name, department, position, role, phone, email, status, created_at FROM accounts ORDER BY created_at DESC');
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/account/{id}:
 *   get:
 *     summary: Lấy thông tin tài khoản theo ID
 *     tags: [Account]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin tài khoản
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, employee_id, name, department, position, role, phone, email, status, created_at FROM accounts WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/account:
 *   post:
 *     summary: Tạo tài khoản mới
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [employeeId, password, name, role]
 *             properties:
 *               employeeId: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *               role: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', async (req, res) => {
  try {
    const { employeeId, password, name, department, position, role, phone, email, status } = req.body;
    const result = await pool.query(
      `INSERT INTO accounts
       (employee_id, password, name, department, position, role, phone, email, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, employee_id, name, department, position, role, phone, email, status, created_at`,
      [employeeId, password, name, department, position, role, phone, email, status || 'active']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ success: false, message: 'Mã nhân viên đã tồn tại' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

/**
 * @swagger
 * /api/account/{id}:
 *   put:
 *     summary: Cập nhật tài khoản
 *     tags: [Account]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;

    Object.keys(fields).forEach(key => {
      if (key !== 'id') {
        updates.push(`${key} = $${paramCount}`);
        values.push(fields[key]);
        paramCount++;
      }
    });

    values.push(id);
    const result = await pool.query(
      `UPDATE accounts SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, employee_id, name, department, position, role, phone, email, status, created_at`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/account/{id}:
 *   delete:
 *     summary: Xóa tài khoản
 *     tags: [Account]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', async (req, res) => {
  try {
    const checkResult = await pool.query('SELECT employee_id FROM accounts WHERE id = $1', [req.params.id]);
    if (checkResult.rows.length > 0 && checkResult.rows[0].employee_id === 'admin') {
      return res.status(403).json({ success: false, message: 'Không thể xóa tài khoản admin' });
    }

    const result = await pool.query('DELETE FROM accounts WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    }
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/account/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [employeeId, password]
 *             properties:
 *               employeeId: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai thông tin đăng nhập
 */
router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    const result = await pool.query(
      'SELECT id, employee_id, name, department, position, role, phone, email, status, created_at FROM accounts WHERE employee_id = $1 AND password = $2',
      [employeeId, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Mã nhân viên hoặc mật khẩu không đúng' });
    }

    const account = result.rows[0];
    if (account.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Tài khoản đã bị khóa' });
    }

    res.json({ success: true, account });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
