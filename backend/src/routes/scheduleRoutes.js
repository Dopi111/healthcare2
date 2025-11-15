import express from 'express';

const router = express.Router();

// In-memory data
let schedules = [
  {
    id: '1',
    scheduleId: 'LLV001',
    employeeId: 'NV001',
    employeeName: 'Bác sĩ Nguyễn Văn A',
    department: 'Khoa Nội',
    date: '2024-11-15',
    shift: 'Ca sáng',
    startTime: '07:00',
    endTime: '12:00',
    status: 'Đã xác nhận',
    notes: 'Trực phòng khám tổng quát',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    scheduleId: 'LLV002',
    employeeId: 'NV001',
    employeeName: 'Bác sĩ Nguyễn Văn A',
    department: 'Khoa Nội',
    date: '2024-11-16',
    shift: 'Ca chiều',
    startTime: '13:00',
    endTime: '18:00',
    status: 'Đã xác nhận',
    notes: 'Khám bệnh theo lịch hẹn',
    createdAt: new Date().toISOString()
  }
];

/**
 * @swagger
 * /api/schedule:
 *   get:
 *     summary: Lấy danh sách lịch làm việc
 *     tags: [Schedule]
 *     responses:
 *       200:
 *         description: Danh sách lịch làm việc
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: schedules.length,
    data: schedules
  });
});

/**
 * @swagger
 * /api/schedule/{id}:
 *   get:
 *     summary: Lấy thông tin lịch làm việc theo ID
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin lịch làm việc
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', (req, res) => {
  const schedule = schedules.find(s => s.id === req.params.id);
  if (!schedule) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy lịch làm việc' });
  }
  res.json({ success: true, data: schedule });
});

/**
 * @swagger
 * /api/schedule:
 *   post:
 *     summary: Tạo lịch làm việc mới
 *     tags: [Schedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [scheduleId, employeeId, employeeName, date, shift]
 *             properties:
 *               scheduleId: { type: string }
 *               employeeId: { type: string }
 *               employeeName: { type: string }
 *               date: { type: string }
 *               shift: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', (req, res) => {
  const newSchedule = {
    id: (schedules.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  schedules.push(newSchedule);
  res.status(201).json({ success: true, data: newSchedule });
});

/**
 * @swagger
 * /api/schedule/{id}:
 *   put:
 *     summary: Cập nhật lịch làm việc
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
router.put('/:id', (req, res) => {
  const index = schedules.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  }
  schedules[index] = { ...schedules[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: schedules[index] });
});

/**
 * @swagger
 * /api/schedule/{id}:
 *   delete:
 *     summary: Xóa lịch làm việc
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', (req, res) => {
  schedules = schedules.filter(s => s.id !== req.params.id);
  res.json({ success: true, message: 'Xóa thành công' });
});

/**
 * @swagger
 * /api/schedule/employee/{employeeId}:
 *   get:
 *     summary: Lấy lịch làm việc theo nhân viên
 *     tags: [Schedule]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lịch làm việc của nhân viên
 */
router.get('/employee/:employeeId', (req, res) => {
  const results = schedules.filter(s => s.employeeId === req.params.employeeId);
  res.json({ success: true, count: results.length, data: results });
});

export default router;
