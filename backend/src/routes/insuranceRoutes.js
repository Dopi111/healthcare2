import express from 'express';

const router = express.Router();

// In-memory data
let insurance = [
  {
    id: '1',
    claimId: 'BH001',
    patientId: 'BN001',
    patientName: 'Nguyễn Văn A',
    insuranceCard: 'DN1234567890',
    insuranceType: 'BHYT',
    visitDate: '2024-11-10',
    totalAmount: 5000000,
    insuranceCovered: 4000000,
    patientPay: 1000000,
    status: 'Đã duyệt',
    approvedBy: 'Kế toán Trần Thị B',
    approvedDate: '2024-11-11',
    notes: '',
    createdAt: new Date('2024-11-10').toISOString()
  },
  {
    id: '2',
    claimId: 'BH002',
    patientId: 'BN002',
    patientName: 'Trần Thị B',
    insuranceCard: 'DN9876543210',
    insuranceType: 'BHYT',
    visitDate: '2024-11-12',
    totalAmount: 3500000,
    insuranceCovered: 2800000,
    patientPay: 700000,
    status: 'Chờ duyệt',
    approvedBy: '',
    approvedDate: '',
    notes: '',
    createdAt: new Date('2024-11-12').toISOString()
  }
];

/**
 * @swagger
 * /api/insurance:
 *   get:
 *     summary: Lấy danh sách hồ sơ bảo hiểm
 *     tags: [Insurance]
 *     responses:
 *       200:
 *         description: Danh sách hồ sơ
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: insurance.length,
    data: insurance
  });
});

/**
 * @swagger
 * /api/insurance/{id}:
 *   get:
 *     summary: Lấy thông tin hồ sơ bảo hiểm theo ID
 *     tags: [Insurance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin hồ sơ
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', (req, res) => {
  const item = insurance.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ' });
  }
  res.json({ success: true, data: item });
});

/**
 * @swagger
 * /api/insurance:
 *   post:
 *     summary: Tạo hồ sơ bảo hiểm mới
 *     tags: [Insurance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [claimId, patientId, patientName, insuranceCard]
 *             properties:
 *               claimId: { type: string }
 *               patientId: { type: string }
 *               patientName: { type: string }
 *               insuranceCard: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', (req, res) => {
  const newInsurance = {
    id: (insurance.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  insurance.push(newInsurance);
  res.status(201).json({ success: true, data: newInsurance });
});

/**
 * @swagger
 * /api/insurance/{id}:
 *   put:
 *     summary: Cập nhật hồ sơ bảo hiểm
 *     tags: [Insurance]
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
  const index = insurance.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  }
  insurance[index] = { ...insurance[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: insurance[index] });
});

/**
 * @swagger
 * /api/insurance/{id}:
 *   delete:
 *     summary: Xóa hồ sơ bảo hiểm
 *     tags: [Insurance]
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
  insurance = insurance.filter(i => i.id !== req.params.id);
  res.json({ success: true, message: 'Xóa thành công' });
});

/**
 * @swagger
 * /api/insurance/statistics/summary:
 *   get:
 *     summary: Thống kê bảo hiểm
 *     tags: [Insurance]
 *     responses:
 *       200:
 *         description: Thống kê
 */
router.get('/statistics/summary', (req, res) => {
  const approved = insurance.filter(i => i.status === 'Đã duyệt');
  const pending = insurance.filter(i => i.status === 'Chờ duyệt');
  const rejected = insurance.filter(i => i.status === 'Từ chối');

  const stats = {
    total: insurance.length,
    approved: approved.length,
    pending: pending.length,
    rejected: rejected.length,
    totalAmount: insurance.reduce((sum, i) => sum + i.totalAmount, 0),
    insuranceCovered: insurance.reduce((sum, i) => sum + i.insuranceCovered, 0),
    patientPay: insurance.reduce((sum, i) => sum + i.patientPay, 0)
  };
  res.json({ success: true, data: stats });
});

export default router;
