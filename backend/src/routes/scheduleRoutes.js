import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/schedule:
 *   get:
 *     summary: Lấy danh sách lịch làm việc
 *     tags: [Schedule]
 *     responses:
 *       200:
 *         description: Danh sách lịch làm việc
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM work_schedules ORDER BY date DESC');
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
 * /api/schedule/{id}:
 *   get:
 *     summary: Lấy thông tin lịch làm việc theo ID
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin lịch làm việc
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM work_schedules WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lịch làm việc' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/schedule:
 *   post:
 *     summary: Tạo lịch làm việc mới
 *     tags: [Schedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [scheduleId, employeeId, employeeName, date, shift]
 *             properties:
 *               scheduleId: { type: string }
 *               employeeId: { type: string }
 *               employeeName: { type: string }
 *               date: { type: string }
 *               shift: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', async (req, res) => {
  try {
    const {
      scheduleId, employeeId, employeeName, department, date, shift,
      startTime, endTime, status, notes
    } = req.body;
    const result = await pool.query(
      `INSERT INTO work_schedules
       (scheduleId, employeeId, employeeName, department, date, shift, startTime, endTime, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [scheduleId, employeeId, employeeName, department, date, shift, startTime, endTime, status, notes]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ success: false, message: 'Mã lịch làm việc đã tồn tại' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

/**
 * @swagger
 * /api/schedule/{id}:
 *   put:
 *     summary: Cập nhật lịch làm việc
 *     tags: [Schedule]
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
      `UPDATE work_schedules SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
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
 * /api/schedule/{id}:
 *   delete:
 *     summary: Xóa lịch làm việc
 *     tags: [Schedule]
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
    const result = await pool.query('DELETE FROM work_schedules WHERE id = $1 RETURNING *', [req.params.id]);
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
 * /api/schedule/employee/{employeeId}:
 *   get:
 *     summary: Lấy lịch làm việc theo nhân viên
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lịch làm việc của nhân viên
 */
router.get('/employee/:employeeId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM work_schedules WHERE employeeId = $1 ORDER BY date DESC',
      [req.params.employeeId]
    );
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
