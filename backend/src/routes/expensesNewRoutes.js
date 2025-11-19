import express from 'express';
import { getAllExpenses, getExpenseById, createExpense, updateExpense, deleteExpense, getExpenseStatistics } from '../controllers/expensesController.js';

const router = express.Router();

/**
 * @swagger
 * /api/expenses-new:
 *   get:
 *     summary: Lấy danh sách chi phí
 *     tags: [Expenses New]
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
 *         description: Danh sách chi phí
 *       500:
 *         description: Lỗi server
 */
router.get('/', getAllExpenses);

/**
 * @swagger
 * /api/expenses-new/statistics:
 *   get:
 *     summary: Lấy thống kê chi phí
 *     tags: [Expenses New]
 *     responses:
 *       200:
 *         description: Thống kê chi phí
 *       500:
 *         description: Lỗi server
 */
router.get('/statistics', getExpenseStatistics);

/**
 * @swagger
 * /api/expenses-new/{id}:
 *   get:
 *     summary: Lấy chi phí theo ID
 *     tags: [Expenses New]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin chi phí
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', getExpenseById);

/**
 * @swagger
 * /api/expenses-new:
 *   post:
 *     summary: Tạo chi phí mới
 *     tags: [Expenses New]
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
router.post('/', createExpense);

/**
 * @swagger
 * /api/expenses-new/{id}:
 *   put:
 *     summary: Cập nhật chi phí
 *     tags: [Expenses New]
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
router.put('/:id', updateExpense);

/**
 * @swagger
 * /api/expenses-new/{id}:
 *   delete:
 *     summary: Xóa chi phí
 *     tags: [Expenses New]
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
router.delete('/:id', deleteExpense);

export default router;
