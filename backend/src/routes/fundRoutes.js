import express from 'express';

const router = express.Router();

// In-memory data
let funds = [
  {
    id: '1',
    transactionId: 'TXN001',
    date: '2024-11-01',
    type: 'Thu',
    category: 'Khám bệnh',
    amount: 15000000,
    description: 'Thu phí khám bệnh tháng 11',
    createdBy: 'Kế toán Nguyễn Văn A',
    createdAt: new Date('2024-11-01').toISOString()
  },
  {
    id: '2',
    transactionId: 'TXN002',
    date: '2024-11-03',
    type: 'Chi',
    category: 'Thuốc men',
    amount: 12000000,
    description: 'Mua thuốc và vật tư y tế',
    createdBy: 'Kế toán Trần Thị B',
    createdAt: new Date('2024-11-03').toISOString()
  }
];

/**
 * @swagger
 * /api/fund:
 *   get:
 *     summary: Lấy danh sách giao dịch quỹ
 *     tags: [Fund]
 *     responses:
 *       200:
 *         description: Danh sách giao dịch
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: funds.length,
    data: funds
  });
});

/**
 * @swagger
 * /api/fund/{id}:
 *   get:
 *     summary: Lấy thông tin giao dịch theo ID
 *     tags: [Fund]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin giao dịch
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', (req, res) => {
  const fund = funds.find(f => f.id === req.params.id);
  if (!fund) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy giao dịch' });
  }
  res.json({ success: true, data: fund });
});

/**
 * @swagger
 * /api/fund:
 *   post:
 *     summary: Tạo giao dịch mới
 *     tags: [Fund]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [transactionId, date, type, category, amount]
 *             properties:
 *               transactionId: { type: string }
 *               date: { type: string }
 *               type: { type: string }
 *               category: { type: string }
 *               amount: { type: number }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', (req, res) => {
  const newFund = {
    id: (funds.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  funds.push(newFund);
  res.status(201).json({ success: true, data: newFund });
});

/**
 * @swagger
 * /api/fund/{id}:
 *   put:
 *     summary: Cập nhật giao dịch
 *     tags: [Fund]
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
  const index = funds.findIndex(f => f.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  }
  funds[index] = { ...funds[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: funds[index] });
});

/**
 * @swagger
 * /api/fund/{id}:
 *   delete:
 *     summary: Xóa giao dịch
 *     tags: [Fund]
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
  funds = funds.filter(f => f.id !== req.params.id);
  res.json({ success: true, message: 'Xóa thành công' });
});

/**
 * @swagger
 * /api/fund/statistics/summary:
 *   get:
 *     summary: Thống kê quỹ
 *     tags: [Fund]
 *     responses:
 *       200:
 *         description: Thống kê
 */
router.get('/statistics/summary', (req, res) => {
  const income = funds.filter(f => f.type === 'Thu').reduce((sum, f) => sum + f.amount, 0);
  const expense = funds.filter(f => f.type === 'Chi').reduce((sum, f) => sum + f.amount, 0);

  const stats = {
    totalIncome: income,
    totalExpense: expense,
    balance: income - expense,
    transactionCount: funds.length
  };
  res.json({ success: true, data: stats });
});

export default router;
