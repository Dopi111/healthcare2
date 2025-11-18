import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/patient:
 *   get:
 *     summary: Lấy danh sách bệnh nhân
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: Danh sách bệnh nhân
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients ORDER BY visitDate DESC');
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
 * /api/patient/{id}:
 *   get:
 *     summary: Lấy thông tin bệnh nhân theo ID
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin bệnh nhân
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh nhân' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/patient:
 *   post:
 *     summary: Tạo bệnh nhân mới
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, fullName, dateOfBirth, gender, phone]
 *             properties:
 *               patientId: { type: string }
 *               fullName: { type: string }
 *               dateOfBirth: { type: string }
 *               gender: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', async (req, res) => {
  try {
    const {
      patientId, fullName, dateOfBirth, gender, phone, address, idCard,
      doctorInCharge, visitDate, diagnosis, status, medicalHistory, allergies
    } = req.body;
    const result = await pool.query(
      `INSERT INTO patients
       (patientId, fullName, dateOfBirth, gender, phone, address, idCard,
        doctorInCharge, visitDate, diagnosis, status, medicalHistory, allergies)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [patientId, fullName, dateOfBirth, gender, phone, address, idCard,
       doctorInCharge, visitDate, diagnosis, status, medicalHistory, allergies]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ success: false, message: 'Mã bệnh nhân đã tồn tại' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

/**
 * @swagger
 * /api/patient/{id}:
 *   put:
 *     summary: Cập nhật bệnh nhân
 *     tags: [Patient]
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
      `UPDATE patients SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
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
 * /api/patient/{id}:
 *   delete:
 *     summary: Xóa bệnh nhân
 *     tags: [Patient]
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
    const result = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING *', [req.params.id]);
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
 * /api/patient/search/{query}:
 *   get:
 *     summary: Tìm kiếm bệnh nhân
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const result = await pool.query(
      `SELECT * FROM patients
       WHERE LOWER(patientId) LIKE $1
          OR LOWER(fullName) LIKE $1
          OR LOWER(phone) LIKE $1
       ORDER BY visitDate DESC`,
      [`%${query}%`]
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
