import express from 'express';
import { getAllLabTests, getLabTestById, getLabTestByCode, createLabTest, updateLabTest, deleteLabTest, getLabTestStatistics, searchLabTests, getLabTestsByStatus } from '../controllers/laboratoryTestsController.js';

const router = express.Router();

/**
 * @swagger
 * /api/laboratory-tests:
 *   get:
 *     summary: Lấy danh sách xét nghiệm phòng
 *     tags: [Laboratory Tests]
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
 *         description: Danh sách xét nghiệm
 *       500:
 *         description: Lỗi server
 */
router.get('/', getAllLabTests);

/**
 * @swagger
 * /api/laboratory-tests/search:
 *   get:
 *     summary: Tìm kiếm xét nghiệm
 *     tags: [Laboratory Tests]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 *       500:
 *         description: Lỗi server
 */
router.get('/search', searchLabTests);

/**
 * @swagger
 * /api/laboratory-tests/statistics:
 *   get:
 *     summary: Lấy thống kê xét nghiệm
 *     tags: [Laboratory Tests]
 *     responses:
 *       200:
 *         description: Thống kê xét nghiệm
 *       500:
 *         description: Lỗi server
 */
router.get('/statistics', getLabTestStatistics);

/**
 * @swagger
 * /api/laboratory-tests/code/{code}:
 *   get:
 *     summary: Lấy xét nghiệm theo mã
 *     tags: [Laboratory Tests]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thông tin xét nghiệm
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.get('/code/:code', getLabTestByCode);

/**
 * @swagger
 * /api/laboratory-tests/status/{status}:
 *   get:
 *     summary: Lấy xét nghiệm theo trạng thái
 *     tags: [Laboratory Tests]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách xét nghiệm theo trạng thái
 *       500:
 *         description: Lỗi server
 */
router.get('/status/:status', getLabTestsByStatus);

/**
 * @swagger
 * /api/laboratory-tests/{id}:
 *   get:
 *     summary: Lấy xét nghiệm theo ID
 *     tags: [Laboratory Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin xét nghiệm
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', getLabTestById);

/**
 * @swagger
 * /api/laboratory-tests:
 *   post:
 *     summary: Tạo xét nghiệm mới
 *     tags: [Laboratory Tests]
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
router.post('/', createLabTest);

/**
 * @swagger
 * /api/laboratory-tests/{id}:
 *   put:
 *     summary: Cập nhật xét nghiệm
 *     tags: [Laboratory Tests]
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
router.put('/:id', updateLabTest);

/**
 * @swagger
 * /api/laboratory-tests/{id}:
 *   delete:
 *     summary: Xóa xét nghiệm
 *     tags: [Laboratory Tests]
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
router.delete('/:id', deleteLabTest);

export default router;
