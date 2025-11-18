import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/position/{id}:
 *   get:
 *     summary: Lấy thông tin chức vụ theo ID
 *     tags: [Position]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chức vụ
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM list_position WHERE position_id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Không tìm thấy chức vụ'
      });
    }

    res.json({
      ok: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching position:', error);
    res.status(500).json({
      ok: false,
      error: 'Lỗi server khi lấy thông tin chức vụ'
    });
  }
});

/**
 * @swagger
 * /api/position:
 *   get:
 *     summary: Lấy danh sách tất cả chức vụ
 *     tags: [Position]
 *     responses:
 *       200:
 *         description: Danh sách chức vụ
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM list_position ORDER BY position_name ASC'
    );

    res.json({
      ok: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({
      ok: false,
      error: 'Lỗi server khi lấy danh sách chức vụ'
    });
  }
});

export default router;
