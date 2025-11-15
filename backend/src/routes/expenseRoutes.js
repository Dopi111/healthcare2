import express from 'express';

const router = express.Router();

// In-memory data
let expenses = [
  {
    id: '1',
    expenseId: 'CP001',
    date: '2024-11-01',
    category: 'Lương',
    department: 'Toàn bộ',
    amount: 50000000,
    description: 'Lương tháng 11',
    approvedBy: 'Giám đốc Nguyễn Văn A',
    status: 'Đã chi',
    createdAt: new Date('2024-11-01').toISOString()
  },
  {
    id: '2',
    expenseId: 'CP002',
    date: '2024-11-03',
    category: 'Thuốc men',
    department: 'Dược',
    amount: 12000000,
    description: 'Mua thuốc và vật tư y tế',
    approvedBy: 'Trưởng khoa Dược',
    status: 'Đã chi',
    createdAt: new Date('2024-11-03').toISOString()
  }
];

/**
 * @swagger
 * /api/expense:
 *   get:
 *     summary: Lấy danh sách chi phí
 *     tags: [Expense]
 *     responses:
 *       200:
 *         description: Danh sách chi phí
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: expenses.length,
    data: expenses
  });
});

/**
 * @swagger
 * /api/expense/{id}:
 *   get:
 *     summary: Lấy thông tin chi phí theo ID
 *     tags: [Expense]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi phí
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', (req, res) => {
  const expense = expenses.find(e => e.id === req.params.id);
  if (!expense) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy chi phí' });
  }
  res.json({ success: true, data: expense });
});

/**
 * @swagger
 * /api/expense:
 *   post:
 *     summary: Tạo chi phí mới
 *     tags: [Expense]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [expenseId, date, category, department, amount]
 *             properties:
 *               expenseId: { type: string }
 *               date: { type: string }
 *               category: { type: string }
 *               department: { type: string }
 *               amount: { type: number }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', (req, res) => {
  const newExpense = {
    id: (expenses.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  expenses.push(newExpense);
  res.status(201).json({ success: true, data: newExpense });
});

/**
 * @swagger
 * /api/expense/{id}:
 *   put:
 *     summary: Cập nhật chi phí
 *     tags: [Expense]
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
  const index = expenses.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  }
  expenses[index] = { ...expenses[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: expenses[index] });
});

/**
 * @swagger
 * /api/expense/{id}:
 *   delete:
 *     summary: Xóa chi phí
 *     tags: [Expense]
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
  expenses = expenses.filter(e => e.id !== req.params.id);
  res.json({ success: true, message: 'Xóa thành công' });
});

/**
 * @swagger
 * /api/expense/statistics/summary:
 *   get:
 *     summary: Thống kê chi phí
 *     tags: [Expense]
 *     responses:
 *       200:
 *         description: Thống kê
 */
router.get('/statistics/summary', (req, res) => {
  const paid = expenses.filter(e => e.status === 'Đã chi');
  const pending = expenses.filter(e => e.status === 'Chờ duyệt');

  const stats = {
    totalExpense: expenses.reduce((sum, e) => sum + e.amount, 0),
    paidAmount: paid.reduce((sum, e) => sum + e.amount, 0),
    pendingAmount: pending.reduce((sum, e) => sum + e.amount, 0),
    totalCount: expenses.length,
    paidCount: paid.length,
    pendingCount: pending.length
  };
  res.json({ success: true, data: stats });
});

export default router;
