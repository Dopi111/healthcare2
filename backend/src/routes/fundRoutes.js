import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/fund:
 *   get:
 *     summary: Lấy danh sách giao dịch quỹ
 *     tags: [Fund]
 *     responses:
 *       200:
 *         description: Danh sách giao dịch
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fund_transactions ORDER BY date DESC');
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
 * /api/fund/{id}:
 *   get:
 *     summary: Lấy thông tin giao dịch theo ID
 *     tags: [Fund]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin giao dịch
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fund_transactions WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giao dịch' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/fund:
 *   post:
 *     summary: Tạo giao dịch mới
 *     tags: [Fund]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [transaction_id, date, type, category, amount]
 *             properties:
 *               transaction_id: { type: string }
 *               date: { type: string }
 *               type: { type: string }
 *               category: { type: string }
 *               amount: { type: number }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', async (req, res) => {
  try {
    const { transaction_id, date, type, category, amount, description, created_by } = req.body;
    const result = await pool.query(
      `INSERT INTO fund_transactions (transaction_id, date, type, category, amount, description, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [transaction_id, date, type, category, amount, description, created_by]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ success: false, message: 'Mã giao dịch đã tồn tại' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

/**
 * @swagger
 * /api/fund/{id}:
 *   put:
 *     summary: Cập nhật giao dịch
 *     tags: [Fund]
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
      `UPDATE fund_transactions SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
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
 * /api/fund/{id}:
 *   delete:
 *     summary: Xóa giao dịch
 *     tags: [Fund]
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
    const result = await pool.query('DELETE FROM fund_transactions WHERE id = $1 RETURNING *', [req.params.id]);
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
 * /api/fund/statistics/summary:
 *   get:
 *     summary: Thống kê quỹ
 *     tags: [Fund]
 *     responses:
 *       200:
 *         description: Thống kê
 */
router.get('/statistics/summary', async (req, res) => {
  try {
    const incomeResult = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM fund_transactions WHERE type = 'Thu'");
    const expenseResult = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM fund_transactions WHERE type = 'Chi'");
    const countResult = await pool.query('SELECT COUNT(*) FROM fund_transactions');

    const income = parseFloat(incomeResult.rows[0].total);
    const expense = parseFloat(expenseResult.rows[0].total);

    const stats = {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      transactionCount: parseInt(countResult.rows[0].count)
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
