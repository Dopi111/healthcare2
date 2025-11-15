import express from 'express';

const router = express.Router();

// In-memory data
let patients = [
  {
    id: '1',
    patientId: 'BN001',
    fullName: 'Nguyễn Văn An',
    dateOfBirth: '1990-05-15',
    gender: 'Nam',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    idCard: '079090001234',
    doctorInCharge: 'Bác sĩ Nguyễn Văn A',
    visitDate: '2024-11-10',
    diagnosis: 'Viêm họng cấp',
    status: 'Đang điều trị',
    medicalHistory: 'Không có bệnh nền',
    allergies: 'Không',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    patientId: 'BN002',
    fullName: 'Trần Thị Bình',
    dateOfBirth: '1985-08-20',
    gender: 'Nữ',
    phone: '0987654321',
    address: '456 Lê Lợi, Q3, TP.HCM',
    idCard: '079085002345',
    doctorInCharge: 'Bác sĩ Nguyễn Văn A',
    visitDate: '2024-11-12',
    diagnosis: 'Cao huyết áp',
    status: 'Tái khám',
    medicalHistory: 'Đái tháo đường type 2',
    allergies: 'Penicillin',
    createdAt: new Date().toISOString()
  }
];

/**
 * @swagger
 * /api/patient:
 *   get:
 *     summary: Lấy danh sách bệnh nhân
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: Danh sách bệnh nhân
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: patients.length,
    data: patients
  });
});

/**
 * @swagger
 * /api/patient/{id}:
 *   get:
 *     summary: Lấy thông tin bệnh nhân theo ID
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin bệnh nhân
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh nhân' });
  }
  res.json({ success: true, data: patient });
});

/**
 * @swagger
 * /api/patient:
 *   post:
 *     summary: Tạo bệnh nhân mới
 *     tags: [Patient]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, fullName, dateOfBirth, gender, phone]
 *             properties:
 *               patientId: { type: string }
 *               fullName: { type: string }
 *               dateOfBirth: { type: string }
 *               gender: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', (req, res) => {
  const newPatient = {
    id: (patients.length + 1).toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  patients.push(newPatient);
  res.status(201).json({ success: true, data: newPatient });
});

/**
 * @swagger
 * /api/patient/{id}:
 *   put:
 *     summary: Cập nhật bệnh nhân
 *     tags: [Patient]
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
  const index = patients.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy' });
  }
  patients[index] = { ...patients[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: patients[index] });
});

/**
 * @swagger
 * /api/patient/{id}:
 *   delete:
 *     summary: Xóa bệnh nhân
 *     tags: [Patient]
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
  patients = patients.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'Xóa thành công' });
});

/**
 * @swagger
 * /api/patient/search/{query}:
 *   get:
 *     summary: Tìm kiếm bệnh nhân
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */
router.get('/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  const results = patients.filter(p =>
    p.patientId.toLowerCase().includes(query) ||
    p.fullName.toLowerCase().includes(query) ||
    p.phone.toLowerCase().includes(query)
  );
  res.json({ success: true, count: results.length, data: results });
});

export default router;
