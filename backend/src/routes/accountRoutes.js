import express from 'express';

const router = express.Router();

// In-memory data
let accounts = [
  {
    id: '1',
    employeeId: 'admin',
    password: 'admin123',
    name: 'Admin',
    department: 'Quản trị',
    position: 'Quản trị viên',
    role: 'administrator',
    phone: '0123456789',
    email: 'admin@healthcare.com',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    employeeId: 'doctor01',
    password: 'doctor123',
    name: 'Bác sĩ Nguyễn Văn A',
    department: 'Bác sĩ chuyên khoa',
    position: 'Bác sĩ',
    role: 'doctor',
    phone: '0987654321',
    email: 'doctor01@healthcare.com',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

/**
 * @swagger
 * /api/account:
 *   get:
 *     summary: Lấy danh sách tài khoản
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: Danh sách tài khoản (không bao gồm mật khẩu)
 */
router.get('/', (req, res) => {
  const safeAccounts = accounts.map(({ password, ...account }) => account);
  res.json({
    success: true,
    count: safeAccounts.length,
    data: safeAccounts
  });
});

/**
 * @swagger
 * /api/account/{id}:
 *   get:
 *     summary: Lấy thông tin tài khoản theo ID
 *     tags: [Account]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin tài khoản
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', (req, res) => {
  const account = accounts.find(a => a.id === req.params.id);
  if (!account) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
  }
  const { password, ...safeAccount } = account;
  res.json({ success: true, data: safeAccount });
});

/**
 * @swagger
 * /api/account:
 *   post:
 *     summary: Tạo tài khoản mới
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [employeeId, password, name, role]
 *             properties:
 *               employeeId: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *               role: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', (req, res) => {
  const newAccount = {
    id: (accounts.length + 1).toString(),
    ...req.body,
    status: req.body.status || 'active',
    createdAt: new Date().toISOString()
  };
  accounts.push(newAccount);
  const { password, ...safeAccount } = newAccount;
  res.status(201).json({ success: true, data: safeAccount });
});

/**
 * @swagger
 * /api/account/{id}:
 *   put:
 *     summary: Cập nhật tài khoản
 *     tags: [Account]
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
  const index = accounts.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  }
  accounts[index] = { ...accounts[index], ...req.body, updatedAt: new Date().toISOString() };
  const { password, ...safeAccount } = accounts[index];
  res.json({ success: true, data: safeAccount });
});

/**
 * @swagger
 * /api/account/{id}:
 *   delete:
 *     summary: Xóa tài khoản
 *     tags: [Account]
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
  const account = accounts.find(a => a.id === req.params.id);
  if (account && account.employeeId === 'admin') {
    return res.status(403).json({ success: false, message: 'Không thể xóa tài khoản admin' });
  }
  accounts = accounts.filter(a => a.id !== req.params.id);
  res.json({ success: true, message: 'Xóa thành công' });
});

/**
 * @swagger
 * /api/account/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [employeeId, password]
 *             properties:
 *               employeeId: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai thông tin đăng nhập
 */
router.post('/login', (req, res) => {
  const { employeeId, password } = req.body;
  const account = accounts.find(a => a.employeeId === employeeId && a.password === password);

  if (!account) {
    return res.status(401).json({ success: false, message: 'Mã nhân viên hoặc mật khẩu không đúng' });
  }

  if (account.status !== 'active') {
    return res.status(401).json({ success: false, message: 'Tài khoản đã bị khóa' });
  }

  const { password: _, ...safeAccount } = account;
  res.json({ success: true, account: safeAccount });
});

export default router;
