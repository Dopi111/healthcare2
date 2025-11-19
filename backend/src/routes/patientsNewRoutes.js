/**
 * Patients Routes (PostgreSQL)
 * Routes for patient management (replacing PatientService localStorage)
 */

import express from 'express';
import {
  getAllPatients,
  getPatientById,
  getPatientByCode,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients,
  getPatientsByStatus,
  getPatientsByDoctor
} from '../controllers/patientsController.js';

const router = express.Router();

/**
 * @swagger
 * /api/patients-new:
 *   get:
 *     summary: Lấy danh sách tất cả bệnh nhân
 *     tags: [Patients New]
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
 *         description: Danh sách bệnh nhân
 */
router.get('/', getAllPatients);

/**
 * @swagger
 * /api/patients-new/search:
 *   get:
 *     summary: Tìm kiếm bệnh nhân
 *     tags: [Patients New]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */
router.get('/search', searchPatients);

/**
 * @swagger
 * /api/patients-new/code/{code}:
 *   get:
 *     summary: Lấy bệnh nhân theo mã bệnh nhân
 *     tags: [Patients New]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Thông tin bệnh nhân
 *       404:
 *         description: Không tìm thấy
 */
router.get('/code/:code', getPatientByCode);

/**
 * @swagger
 * /api/patients-new/status/{status}:
 *   get:
 *     summary: Lấy bệnh nhân theo trạng thái
 *     tags: [Patients New]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách bệnh nhân theo trạng thái
 */
router.get('/status/:status', getPatientsByStatus);

/**
 * @swagger
 * /api/patients-new/doctor/{doctorName}:
 *   get:
 *     summary: Lấy bệnh nhân theo bác sĩ phụ trách
 *     tags: [Patients New]
 *     parameters:
 *       - in: path
 *         name: doctorName
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Danh sách bệnh nhân của bác sĩ
 */
router.get('/doctor/:doctorName', getPatientsByDoctor);

/**
 * @swagger
 * /api/patients-new/{id}:
 *   get:
 *     summary: Lấy bệnh nhân theo ID
 *     tags: [Patients New]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Thông tin bệnh nhân
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', getPatientById);

/**
 * @swagger
 * /api/patients-new:
 *   post:
 *     summary: Tạo hồ sơ bệnh nhân mới
 *     tags: [Patients New]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patient_code]
 *             properties:
 *               patient_code: { type: string }
 *               doctor_in_charge: { type: string }
 *               diagnosis: { type: string }
 *               treatment: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', createPatient);

/**
 * @swagger
 * /api/patients-new/{id}:
 *   put:
 *     summary: Cập nhật thông tin bệnh nhân
 *     tags: [Patients New]
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
 */
router.put('/:id', updatePatient);

/**
 * @swagger
 * /api/patients-new/{id}:
 *   delete:
 *     summary: Xóa bệnh nhân
 *     tags: [Patients New]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', deletePatient);

export default router;
