import express from 'express';
import { getAllFunds, getFundById, createFund, updateFund, deleteFund, getFundStatistics } from '../controllers/fundsController.js';

const router = express.Router();

/**
 * @swagger
 * /api/funds-new:
 *   get:
 *     summary: Lấy danh sách quỹ
 *     tags: [Funds New]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         description: Số trang (mặc định 1)
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         description: Số bản ghi mỗi trang (mặc định 20)
 *     responses:
 *       200:
 *         description: Danh sách quỹ
 *       500:
 *         description: Lỗi server
 */
router.get('/', getAllFunds);

/**
 * @swagger
 * /api/funds-new/statistics:
 *   get:
 *     summary: Lấy thống kê quỹ
 *     tags: [Funds New]
 *     responses:
 *       200:
 *         description: Thống kê quỹ
 *       500:
 *         description: Lỗi server
 */
router.get('/statistics', getFundStatistics);

/**
 * @swagger
 * /api/funds-new/{id}:
 *   get:
 *     summary: Lấy quỹ theo ID
 *     tags: [Funds New]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin quỹ
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', getFundById);

/**
 * @swagger
 * /api/funds-new:
 *   post:
 *     summary: Tạo quỹ mới
 *     tags: [Funds New]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       500:
 *         description: Lỗi server
 */
router.post('/', createFund);

/**
 * @swagger
 * /api/funds-new/{id}:
 *   put:
 *     summary: Cập nhật quỹ
 *     tags: [Funds New]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.put('/:id', updateFund);

/**
 * @swagger
 * /api/funds-new/{id}:
 *   delete:
 *     summary: Xóa quỹ
 *     tags: [Funds New]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', deleteFund);

export default router;
