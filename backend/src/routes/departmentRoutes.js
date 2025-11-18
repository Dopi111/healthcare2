import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/department/{id}:
 *   get:
 *     summary: Lấy thông tin phòng ban theo ID
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin phòng ban
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM list_department WHERE department_id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Không tìm thấy phòng ban'
      });
    }

    res.json({
      ok: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({
      ok: false,
      error: 'Lỗi server khi lấy thông tin phòng ban'
    });
  }
});

/**
 * @swagger
 * /api/department:
 *   get:
 *     summary: Lấy danh sách tất cả phòng ban
 *     tags: [Department]
 *     responses:
 *       200:
 *         description: Danh sách phòng ban
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM list_department ORDER BY department_name ASC'
    );

    res.json({
      ok: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      ok: false,
      error: 'Lỗi server khi lấy danh sách phòng ban'
    });
  }
});

export default router;
