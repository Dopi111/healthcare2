import express from 'express';
import { getAllRevenue, getRevenueByMonth, createRevenue, updateRevenue, deleteRevenue, getRevenueStatistics, getMonthlyComparison } from '../controllers/revenueController.js';

const router = express.Router();

/**
 * @swagger
 * /api/revenue-new:
 *   get:
 *     summary: Lấy danh sách doanh thu
 *     tags: [Revenue New]
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
 *         description: Danh sách doanh thu
 *       500:
 *         description: Lỗi server
 */
router.get('/', getAllRevenue);

/**
 * @swagger
 * /api/revenue-new/statistics:
 *   get:
 *     summary: Lấy thống kê doanh thu
 *     tags: [Revenue New]
 *     responses:
 *       200:
 *         description: Thống kê doanh thu
 *       500:
 *         description: Lỗi server
 */
router.get('/statistics', getRevenueStatistics);

/**
 * @swagger
 * /api/revenue-new/monthly-comparison:
 *   get:
 *     summary: Lấy so sánh doanh thu theo tháng
 *     tags: [Revenue New]
 *     responses:
 *       200:
 *         description: So sánh doanh thu theo tháng
 *       500:
 *         description: Lỗi server
 */
router.get('/monthly-comparison', getMonthlyComparison);

/**
 * @swagger
 * /api/revenue-new/month/{month}:
 *   get:
 *     summary: Lấy doanh thu theo tháng
 *     tags: [Revenue New]
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema: { type: string }
 *         description: Tháng (YYYY-MM)
 *     responses:
 *       200:
 *         description: Doanh thu theo tháng
 *       500:
 *         description: Lỗi server
 */
router.get('/month/:month', getRevenueByMonth);

/**
 * @swagger
 * /api/revenue-new/{id}:
 *   get:
 *     summary: Lấy doanh thu theo ID
 *     tags: [Revenue New]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin doanh thu
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', getAllRevenue);

/**
 * @swagger
 * /api/revenue-new:
 *   post:
 *     summary: Tạo doanh thu mới
 *     tags: [Revenue New]
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
router.post('/', createRevenue);

/**
 * @swagger
 * /api/revenue-new/{id}:
 *   put:
 *     summary: Cập nhật doanh thu
 *     tags: [Revenue New]
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
router.put('/:id', updateRevenue);

/**
 * @swagger
 * /api/revenue-new/{id}:
 *   delete:
 *     summary: Xóa doanh thu
 *     tags: [Revenue New]
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
router.delete('/:id', deleteRevenue);

export default router;
