import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/expense:
 *   get:
 *     summary: Lấy danh sách chi phí
 *     tags: [Expense]
 *     responses:
 *       200:
 *         description: Danh sách chi phí
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM operating_expenses ORDER BY date DESC');
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
 * /api/expense/{id}:
 *   get:
 *     summary: Lấy thông tin chi phí theo ID
 *     tags: [Expense]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi phí
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM operating_expenses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chi phí' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/expense:
 *   post:
 *     summary: Tạo chi phí mới
 *     tags: [Expense]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [expenseId, date, category, department, amount]
 *             properties:
 *               expenseId: { type: string }
 *               date: { type: string }
 *               category: { type: string }
 *               department: { type: string }
 *               amount: { type: number }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', async (req, res) => {
  try {
    const { expenseId, date, category, department, amount, description, approvedBy, status } = req.body;
    const result = await pool.query(
      `INSERT INTO operating_expenses
       (expenseId, date, category, department, amount, description, approvedBy, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [expenseId, date, category, department, amount, description, approvedBy, status]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ success: false, message: 'Mã chi phí đã tồn tại' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

/**
 * @swagger
 * /api/expense/{id}:
 *   put:
 *     summary: Cập nhật chi phí
 *     tags: [Expense]
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
      `UPDATE operating_expenses SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
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
 * /api/expense/{id}:
 *   delete:
 *     summary: Xóa chi phí
 *     tags: [Expense]
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
    const result = await pool.query('DELETE FROM operating_expenses WHERE id = $1 RETURNING *', [req.params.id]);
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
 * /api/expense/statistics/summary:
 *   get:
 *     summary: Thống kê chi phí
 *     tags: [Expense]
 *     responses:
 *       200:
 *         description: Thống kê
 */
router.get('/statistics/summary', async (req, res) => {
  try {
    const totalExpenseResult = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM operating_expenses');
    const paidResult = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM operating_expenses WHERE status = 'Đã chi'");
    const pendingResult = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM operating_expenses WHERE status = 'Chờ duyệt'");
    const totalCountResult = await pool.query('SELECT COUNT(*) FROM operating_expenses');
    const paidCountResult = await pool.query("SELECT COUNT(*) FROM operating_expenses WHERE status = 'Đã chi'");
    const pendingCountResult = await pool.query("SELECT COUNT(*) FROM operating_expenses WHERE status = 'Chờ duyệt'");

    const stats = {
      totalExpense: parseFloat(totalExpenseResult.rows[0].total),
      paidAmount: parseFloat(paidResult.rows[0].total),
      pendingAmount: parseFloat(pendingResult.rows[0].total),
      totalCount: parseInt(totalCountResult.rows[0].count),
      paidCount: parseInt(paidCountResult.rows[0].count),
      pendingCount: parseInt(pendingCountResult.rows[0].count)
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
