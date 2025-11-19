import express from 'express';
import {
  createLabResult,
  getAllLabResults,
  getUserLabResults,
  getLabResultById,
  updateLabResult,
  verifyLabResult,
  deleteLabResult
} from '../controllers/labResultsController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lab Results
 *   description: Quản lý kết quả xét nghiệm
 */

/**
 * @swagger
 * /api/lab-results:
 *   post:
 *     summary: Tạo kết quả xét nghiệm mới
 *     tags: [Lab Results]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_name
 *               - test_type
 *               - test_date
 *     responses:
 *       201:
 *         description: Tạo kết quả thành công
 */
router.post('/', createLabResult);

/**
 * @swagger
 * /api/lab-results:
 *   get:
 *     summary: Lấy tất cả kết quả xét nghiệm
 *     tags: [Lab Results]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: result_status
 *         schema:
 *           type: string
 *       - in: query
 *         name: test_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Danh sách kết quả xét nghiệm
 */
router.get('/', getAllLabResults);

/**
 * @swagger
 * /api/lab-results/user/{user_id}:
 *   get:
 *     summary: Lấy kết quả xét nghiệm của user
 *     tags: [Lab Results]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách kết quả xét nghiệm của user
 */
router.get('/user/:user_id', getUserLabResults);

/**
 * @swagger
 * /api/lab-results/{id}:
 *   get:
 *     summary: Lấy chi tiết kết quả xét nghiệm
 *     tags: [Lab Results]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết kết quả xét nghiệm
 */
router.get('/:id', getLabResultById);

/**
 * @swagger
 * /api/lab-results/{id}:
 *   put:
 *     summary: Cập nhật kết quả xét nghiệm
 *     tags: [Lab Results]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', updateLabResult);

/**
 * @swagger
 * /api/lab-results/{id}/verify:
 *   put:
 *     summary: Xác nhận kết quả xét nghiệm
 *     tags: [Lab Results]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xác nhận thành công
 */
router.put('/:id/verify', verifyLabResult);

/**
 * @swagger
 * /api/lab-results/{id}:
 *   delete:
 *     summary: Xóa kết quả xét nghiệm
 *     tags: [Lab Results]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', deleteLabResult);

export default router;
