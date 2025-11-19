import express from 'express';
import {
  createAppointment,
  getAllAppointments,
  getUserAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentsController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Quản lý lịch hẹn khám bệnh
 */

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Tạo lịch hẹn mới (cho cả User và Guest)
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - phone_number
 *               - specialty
 *               - appointment_date
 *               - appointment_time
 *             properties:
 *               infor_users_id:
 *                 type: integer
 *                 description: ID user (optional, null nếu là guest)
 *               full_name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               email:
 *                 type: string
 *               specialty:
 *                 type: string
 *               doctor_name:
 *                 type: string
 *               appointment_date:
 *                 type: string
 *                 format: date
 *               appointment_time:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đặt lịch hẹn thành công
 */
router.post('/', createAppointment);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Lấy tất cả lịch hẹn (Admin)
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *       - in: query
 *         name: date
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
 *         description: Danh sách lịch hẹn
 */
router.get('/', getAllAppointments);

/**
 * @swagger
 * /api/appointments/user/{user_id}:
 *   get:
 *     summary: Lấy lịch hẹn của user
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Danh sách lịch hẹn của user
 */
router.get('/user/:user_id', getUserAppointments);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Lấy chi tiết lịch hẹn
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết lịch hẹn
 */
router.get('/:id', getAppointmentById);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái lịch hẹn
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *               confirmed_by:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */
router.put('/:id/status', updateAppointmentStatus);

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Cập nhật thông tin lịch hẹn
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật lịch hẹn thành công
 */
router.put('/:id', updateAppointment);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Xóa lịch hẹn
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa lịch hẹn thành công
 */
router.delete('/:id', deleteAppointment);

export default router;
