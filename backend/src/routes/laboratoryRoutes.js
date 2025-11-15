import express from 'express';

const router = express.Router();

// In-memory data
let laboratoryTests = [
  {
    id: '1',
    testId: 'LAB001',
    patientId: 'BN001',
    patientName: 'Nguyễn Văn A',
    testType: 'Xét nghiệm máu tổng quát',
    sampleId: 'MAU001',
    sampleType: 'Máu tĩnh mạch',
    receivedDate: '2024-11-14',
    receivedTime: '08:30',
    technician: 'KTV Trần Văn E',
    status: 'Hoàn thành',
    priority: 'Bình thường',
    results: {
      'WBC (Bạch cầu)': { value: '7.2', unit: 'x10³/µL', range: '4.0-11.0', normal: true },
      'RBC (Hồng cầu)': { value: '4.8', unit: 'x10⁶/µL', range: '4.5-5.5', normal: true }
    }
  },
  {
    id: '2',
    testId: 'LAB002',
    patientId: 'BN002',
    patientName: 'Trần Thị B',
    testType: 'Xét nghiệm sinh hóa',
    sampleId: 'MAU002',
    sampleType: 'Máu tĩnh mạch',
    receivedDate: '2024-11-14',
    receivedTime: '09:15',
    technician: 'KTV Lê Thị G',
    status: 'Đang xét nghiệm',
    priority: 'Cấp tốc',
    results: {}
  }
];

/**
 * @swagger
 * /api/laboratory:
 *   get:
 *     summary: Lấy danh sách tất cả xét nghiệm
 *     tags: [Laboratory]
 *     responses:
 *       200:
 *         description: Danh sách xét nghiệm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   testId: { type: string }
 *                   patientName: { type: string }
 *                   testType: { type: string }
 *                   status: { type: string }
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: laboratoryTests.length,
    data: laboratoryTests
  });
});

/**
 * @swagger
 * /api/laboratory/{id}:
 *   get:
 *     summary: Lấy thông tin xét nghiệm theo ID
 *     tags: [Laboratory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin xét nghiệm
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', (req, res) => {
  const test = laboratoryTests.find(t => t.id === req.params.id);
  if (!test) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy xét nghiệm' });
  }
  res.json({ success: true, data: test });
});

/**
 * @swagger
 * /api/laboratory:
 *   post:
 *     summary: Tạo phiếu xét nghiệm mới
 *     tags: [Laboratory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [testId, patientId, patientName, testType, sampleId]
 *             properties:
 *               testId: { type: string }
 *               patientId: { type: string }
 *               patientName: { type: string }
 *               testType: { type: string }
 *               sampleId: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', (req, res) => {
  const newTest = {
    id: (laboratoryTests.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  laboratoryTests.push(newTest);
  res.status(201).json({ success: true, data: newTest });
});

/**
 * @swagger
 * /api/laboratory/{id}:
 *   put:
 *     summary: Cập nhật xét nghiệm
 *     tags: [Laboratory]
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
  const index = laboratoryTests.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  }
  laboratoryTests[index] = { ...laboratoryTests[index], ...req.body };
  res.json({ success: true, data: laboratoryTests[index] });
});

/**
 * @swagger
 * /api/laboratory/{id}:
 *   delete:
 *     summary: Xóa xét nghiệm
 *     tags: [Laboratory]
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
  laboratoryTests = laboratoryTests.filter(t => t.id !== req.params.id);
  res.json({ success: true, message: 'Xóa thành công' });
});

/**
 * @swagger
 * /api/laboratory/statistics/summary:
 *   get:
 *     summary: Thống kê xét nghiệm
 *     tags: [Laboratory]
 *     responses:
 *       200:
 *         description: Thống kê
 */
router.get('/statistics/summary', (req, res) => {
  const stats = {
    total: laboratoryTests.length,
    pending: laboratoryTests.filter(t => t.status === 'Chờ xử lý').length,
    inProgress: laboratoryTests.filter(t => t.status === 'Đang xét nghiệm').length,
    completed: laboratoryTests.filter(t => t.status === 'Hoàn thành').length,
    urgent: laboratoryTests.filter(t => t.priority === 'Cấp tốc').length
  };
  res.json({ success: true, data: stats });
});

export default router;
