import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/revenue:
 *   get:
 *     summary: Lấy danh sách doanh thu
 *     tags: [Revenue]
 *     responses:
 *       200:
 *         description: Danh sách doanh thu
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medical_revenue ORDER BY date DESC');
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
 * /api/revenue/{id}:
 *   get:
 *     summary: Lấy thông tin doanh thu theo ID
 *     tags: [Revenue]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin doanh thu
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medical_revenue WHERE id = $1', [req.params.id]);
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
 * /api/revenue:
 *   post:
 *     summary: Tạo bản ghi doanh thu mới
 *     tags: [Revenue]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, category, patientCount, revenue, month]
 *             properties:
 *               date: { type: string }
 *               category: { type: string }
 *               patientCount: { type: number }
 *               revenue: { type: number }
 *               month: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', async (req, res) => {
  try {
    const { date, category, patientCount, revenue, month } = req.body;
    const result = await pool.query(
      `INSERT INTO medical_revenue (date, category, patientCount, revenue, month)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [date, category, patientCount, revenue, month]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/revenue/{id}:
 *   put:
 *     summary: Cập nhật doanh thu
 *     tags: [Revenue]
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
      `UPDATE medical_revenue SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
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
 * /api/revenue/{id}:
 *   delete:
 *     summary: Xóa doanh thu
 *     tags: [Revenue]
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
    const result = await pool.query('DELETE FROM medical_revenue WHERE id = $1 RETURNING *', [req.params.id]);
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
 * /api/revenue/statistics/summary:
 *   get:
 *     summary: Thống kê doanh thu
 *     tags: [Revenue]
 *     responses:
 *       200:
 *         description: Thống kê
 */
router.get('/statistics/summary', async (req, res) => {
  try {
    const revenueResult = await pool.query('SELECT COALESCE(SUM(revenue), 0) as total FROM medical_revenue');
    const patientsResult = await pool.query('SELECT COALESCE(SUM(patientCount), 0) as total FROM medical_revenue');

    const totalRevenue = parseFloat(revenueResult.rows[0].total);
    const totalPatients = parseInt(patientsResult.rows[0].total);

    const stats = {
      totalRevenue,
      totalPatients,
      avgRevenuePerPatient: totalPatients > 0 ? totalRevenue / totalPatients : 0
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
