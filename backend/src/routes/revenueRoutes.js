import express from 'express';

const router = express.Router();

// In-memory data
let revenue = [
  {
    id: '1',
    date: '2024-11-01',
    category: 'Khám bệnh',
    patientCount: 45,
    revenue: 22500000,
    month: '2024-11'
  },
  {
    id: '2',
    date: '2024-11-01',
    category: 'Xét nghiệm',
    patientCount: 30,
    revenue: 15000000,
    month: '2024-11'
  },
  {
    id: '3',
    date: '2024-11-01',
    category: 'Nội trú',
    patientCount: 10,
    revenue: 35000000,
    month: '2024-11'
  },
  {
    id: '4',
    date: '2024-11-01',
    category: 'Phẫu thuật',
    patientCount: 5,
    revenue: 50000000,
    month: '2024-11'
  }
];

/**
 * @swagger
 * /api/revenue:
 *   get:
 *     summary: Lấy danh sách doanh thu
 *     tags: [Revenue]
 *     responses:
 *       200:
 *         description: Danh sách doanh thu
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: revenue.length,
    data: revenue
  });
});

/**
 * @swagger
 * /api/revenue/{id}:
 *   get:
 *     summary: Lấy thông tin doanh thu theo ID
 *     tags: [Revenue]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin doanh thu
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', (req, res) => {
  const item = revenue.find(r => r.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  }
  res.json({ success: true, data: item });
});

/**
 * @swagger
 * /api/revenue:
 *   post:
 *     summary: Tạo bản ghi doanh thu mới
 *     tags: [Revenue]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date, category, patientCount, revenue, month]
 *             properties:
 *               date: { type: string }
 *               category: { type: string }
 *               patientCount: { type: number }
 *               revenue: { type: number }
 *               month: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', (req, res) => {
  const newRevenue = {
    id: (revenue.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  revenue.push(newRevenue);
  res.status(201).json({ success: true, data: newRevenue });
});

/**
 * @swagger
 * /api/revenue/{id}:
 *   put:
 *     summary: Cập nhật doanh thu
 *     tags: [Revenue]
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
  const index = revenue.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  }
  revenue[index] = { ...revenue[index], ...req.body };
  res.json({ success: true, data: revenue[index] });
});

/**
 * @swagger
 * /api/revenue/{id}:
 *   delete:
 *     summary: Xóa doanh thu
 *     tags: [Revenue]
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
  revenue = revenue.filter(r => r.id !== req.params.id);
  res.json({ success: true, message: 'Xóa thành công' });
});

/**
 * @swagger
 * /api/revenue/statistics/summary:
 *   get:
 *     summary: Thống kê doanh thu
 *     tags: [Revenue]
 *     responses:
 *       200:
 *         description: Thống kê
 */
router.get('/statistics/summary', (req, res) => {
  const totalRevenue = revenue.reduce((sum, r) => sum + r.revenue, 0);
  const totalPatients = revenue.reduce((sum, r) => sum + r.patientCount, 0);

  const stats = {
    totalRevenue,
    totalPatients,
    avgRevenuePerPatient: totalPatients > 0 ? totalRevenue / totalPatients : 0
  };
  res.json({ success: true, data: stats });
});

export default router;
