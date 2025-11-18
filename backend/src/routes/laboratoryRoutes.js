import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/laboratory:
 *   get:
 *     summary: Lấy danh sách tất cả xét nghiệm
 *     tags: [Laboratory]
 *     responses:
 *       200:
 *         description: Danh sách xét nghiệm
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM laboratory_tests ORDER BY created_at DESC'
    );
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
 * /api/laboratory/{id}:
 *   get:
 *     summary: Lấy thông tin xét nghiệm theo ID
 *     tags: [Laboratory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin xét nghiệm
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM laboratory_tests WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy xét nghiệm' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/laboratory:
 *   post:
 *     summary: Tạo phiếu xét nghiệm mới
 *     tags: [Laboratory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [test_id, patient_id, patient_name, test_type, sample_id, sample_type, received_date, received_time]
 *             properties:
 *               test_id: { type: string }
 *               patient_id: { type: string }
 *               patient_name: { type: string }
 *               test_type: { type: string }
 *               sample_id: { type: string }
 *               sample_type: { type: string }
 *               received_date: { type: string }
 *               received_time: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', async (req, res) => {
  try {
    const {
      test_id, patient_id, patient_name, test_type, sample_id, sample_type,
      received_date, received_time, technician, status, priority, results, notes
    } = req.body;

    const result = await pool.query(
      `INSERT INTO laboratory_tests
       (test_id, patient_id, patient_name, test_type, sample_id, sample_type,
        received_date, received_time, technician, status, priority, results, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [test_id, patient_id, patient_name, test_type, sample_id, sample_type,
       received_date, received_time, technician, status || 'Chờ xử lý',
       priority || 'Bình thường', results || {}, notes]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ success: false, message: 'Mã xét nghiệm đã tồn tại' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

/**
 * @swagger
 * /api/laboratory/{id}:
 *   put:
 *     summary: Cập nhật xét nghiệm
 *     tags: [Laboratory]
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
      `UPDATE laboratory_tests SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy xét nghiệm' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/laboratory/{id}:
 *   delete:
 *     summary: Xóa xét nghiệm
 *     tags: [Laboratory]
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
    const result = await pool.query(
      'DELETE FROM laboratory_tests WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy xét nghiệm' });
    }

    res.json({ success: true, message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/laboratory/statistics/summary:
 *   get:
 *     summary: Thống kê xét nghiệm
 *     tags: [Laboratory]
 *     responses:
 *       200:
 *         description: Thống kê
 */
router.get('/statistics/summary', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM laboratory_tests');
    const pendingResult = await pool.query("SELECT COUNT(*) FROM laboratory_tests WHERE status = 'Chờ xử lý'");
    const inProgressResult = await pool.query("SELECT COUNT(*) FROM laboratory_tests WHERE status = 'Đang xét nghiệm'");
    const completedResult = await pool.query("SELECT COUNT(*) FROM laboratory_tests WHERE status = 'Hoàn thành'");
    const urgentResult = await pool.query("SELECT COUNT(*) FROM laboratory_tests WHERE priority = 'Cấp tốc'");

    const stats = {
      total: parseInt(totalResult.rows[0].count),
      pending: parseInt(pendingResult.rows[0].count),
      inProgress: parseInt(inProgressResult.rows[0].count),
      completed: parseInt(completedResult.rows[0].count),
      urgent: parseInt(urgentResult.rows[0].count)
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
