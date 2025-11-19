import express from 'express';
import { getAllTestResults, getTestResultById, getTestResultByCode, createTestResult, updateTestResult, deleteTestResult, searchTestResults, getTestResultsByStatus, getTestResultsByPatient, getTestResultsByDoctor } from '../controllers/testResultsController.js';

const router = express.Router();

/**
 * @swagger
 * /api/test-results-new:
 *   get:
 *     summary: Lấy danh sách kết quả xét nghiệm
 *     tags: [Test Results New]
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
 *         description: Danh sách kết quả xét nghiệm
 *       500:
 *         description: Lỗi server
 */
router.get('/', getAllTestResults);

/**
 * @swagger
 * /api/test-results-new/search:
 *   get:
 *     summary: Tìm kiếm kết quả xét nghiệm
 *     tags: [Test Results New]
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
router.get('/search', searchTestResults);

/**
 * @swagger
 * /api/test-results-new/code/{code}:
 *   get:
 *     summary: Lấy kết quả xét nghiệm theo mã
 *     tags: [Test Results New]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thông tin kết quả xét nghiệm
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.get('/code/:code', getTestResultByCode);

/**
 * @swagger
 * /api/test-results-new/status/{status}:
 *   get:
 *     summary: Lấy kết quả xét nghiệm theo trạng thái
 *     tags: [Test Results New]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách kết quả theo trạng thái
 *       500:
 *         description: Lỗi server
 */
router.get('/status/:status', getTestResultsByStatus);

/**
 * @swagger
 * /api/test-results-new/patient/{patientId}:
 *   get:
 *     summary: Lấy kết quả xét nghiệm của bệnh nhân
 *     tags: [Test Results New]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Danh sách kết quả của bệnh nhân
 *       500:
 *         description: Lỗi server
 */
router.get('/patient/:patientId', getTestResultsByPatient);

/**
 * @swagger
 * /api/test-results-new/doctor/{doctorName}:
 *   get:
 *     summary: Lấy kết quả xét nghiệm của bác sĩ
 *     tags: [Test Results New]
 *     parameters:
 *       - in: path
 *         name: doctorName
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách kết quả của bác sĩ
 *       500:
 *         description: Lỗi server
 */
router.get('/doctor/:doctorName', getTestResultsByDoctor);

/**
 * @swagger
 * /api/test-results-new/{id}:
 *   get:
 *     summary: Lấy kết quả xét nghiệm theo ID
 *     tags: [Test Results New]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin kết quả xét nghiệm
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', getTestResultById);

/**
 * @swagger
 * /api/test-results-new:
 *   post:
 *     summary: Tạo kết quả xét nghiệm mới
 *     tags: [Test Results New]
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
router.post('/', createTestResult);

/**
 * @swagger
 * /api/test-results-new/{id}:
 *   put:
 *     summary: Cập nhật kết quả xét nghiệm
 *     tags: [Test Results New]
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
router.put('/:id', updateTestResult);

/**
 * @swagger
 * /api/test-results-new/{id}:
 *   delete:
 *     summary: Xóa kết quả xét nghiệm
 *     tags: [Test Results New]
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
router.delete('/:id', deleteTestResult);

export default router;
