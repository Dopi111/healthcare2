import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/insurance:
 *   get:
 *     summary: Lấy danh sách hồ sơ bảo hiểm
 *     tags: [Insurance]
 *     responses:
 *       200:
 *         description: Danh sách hồ sơ
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM insurance_claims ORDER BY visitDate DESC');
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
 * /api/insurance/{id}:
 *   get:
 *     summary: Lấy thông tin hồ sơ bảo hiểm theo ID
 *     tags: [Insurance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin hồ sơ
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM insurance_claims WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/insurance:
 *   post:
 *     summary: Tạo hồ sơ bảo hiểm mới
 *     tags: [Insurance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [claimId, patientId, patientName, insuranceCard]
 *             properties:
 *               claimId: { type: string }
 *               patientId: { type: string }
 *               patientName: { type: string }
 *               insuranceCard: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', async (req, res) => {
  try {
    const {
      claimId, patientId, patientName, insuranceCard, insuranceType,
      visitDate, totalAmount, insuranceCovered, patientPay, status,
      approvedBy, approvedDate, notes
    } = req.body;
    const result = await pool.query(
      `INSERT INTO insurance_claims
       (claimId, patientId, patientName, insuranceCard, insuranceType, visitDate,
        totalAmount, insuranceCovered, patientPay, status, approvedBy, approvedDate, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [claimId, patientId, patientName, insuranceCard, insuranceType, visitDate,
       totalAmount, insuranceCovered, patientPay, status, approvedBy, approvedDate, notes]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ success: false, message: 'Mã hồ sơ đã tồn tại' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

/**
 * @swagger
 * /api/insurance/{id}:
 *   put:
 *     summary: Cập nhật hồ sơ bảo hiểm
 *     tags: [Insurance]
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
      `UPDATE insurance_claims SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
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
 * /api/insurance/{id}:
 *   delete:
 *     summary: Xóa hồ sơ bảo hiểm
 *     tags: [Insurance]
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
    const result = await pool.query('DELETE FROM insurance_claims WHERE id = $1 RETURNING *', [req.params.id]);
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
 * /api/insurance/statistics/summary:
 *   get:
 *     summary: Thống kê bảo hiểm
 *     tags: [Insurance]
 *     responses:
 *       200:
 *         description: Thống kê
 */
router.get('/statistics/summary', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM insurance_claims');
    const approvedResult = await pool.query("SELECT COUNT(*) FROM insurance_claims WHERE status = 'Đã duyệt'");
    const pendingResult = await pool.query("SELECT COUNT(*) FROM insurance_claims WHERE status = 'Chờ duyệt'");
    const rejectedResult = await pool.query("SELECT COUNT(*) FROM insurance_claims WHERE status = 'Từ chối'");
    const totalAmountResult = await pool.query('SELECT COALESCE(SUM(totalAmount), 0) as total FROM insurance_claims');
    const insuranceCoveredResult = await pool.query('SELECT COALESCE(SUM(insuranceCovered), 0) as total FROM insurance_claims');
    const patientPayResult = await pool.query('SELECT COALESCE(SUM(patientPay), 0) as total FROM insurance_claims');

    const stats = {
      total: parseInt(totalResult.rows[0].count),
      approved: parseInt(approvedResult.rows[0].count),
      pending: parseInt(pendingResult.rows[0].count),
      rejected: parseInt(rejectedResult.rows[0].count),
      totalAmount: parseFloat(totalAmountResult.rows[0].total),
      insuranceCovered: parseFloat(insuranceCoveredResult.rows[0].total),
      patientPay: parseFloat(patientPayResult.rows[0].total)
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
