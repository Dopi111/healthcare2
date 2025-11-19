import express from 'express';
import { getAllInsurance, getInsuranceById, createInsurance, updateInsurance, deleteInsurance, getInsuranceStatistics } from '../controllers/insuranceController.js';

const router = express.Router();

/**
 * @swagger
 * /api/insurance-new:
 *   get:
 *     summary: Lấy danh sách bảo hiểm
 *     tags: [Insurance New]
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
 *         description: Danh sách bảo hiểm
 *       500:
 *         description: Lỗi server
 */
router.get('/', getAllInsurance);

/**
 * @swagger
 * /api/insurance-new/statistics:
 *   get:
 *     summary: Lấy thống kê bảo hiểm
 *     tags: [Insurance New]
 *     responses:
 *       200:
 *         description: Thống kê bảo hiểm
 *       500:
 *         description: Lỗi server
 */
router.get('/statistics', getInsuranceStatistics);

/**
 * @swagger
 * /api/insurance-new/{id}:
 *   get:
 *     summary: Lấy bảo hiểm theo ID
 *     tags: [Insurance New]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin bảo hiểm
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', getInsuranceById);

/**
 * @swagger
 * /api/insurance-new:
 *   post:
 *     summary: Tạo bảo hiểm mới
 *     tags: [Insurance New]
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
router.post('/', createInsurance);

/**
 * @swagger
 * /api/insurance-new/{id}:
 *   put:
 *     summary: Cập nhật bảo hiểm
 *     tags: [Insurance New]
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
router.put('/:id', updateInsurance);

/**
 * @swagger
 * /api/insurance-new/{id}:
 *   delete:
 *     summary: Xóa bảo hiểm
 *     tags: [Insurance New]
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
router.delete('/:id', deleteInsurance);

export default router;
