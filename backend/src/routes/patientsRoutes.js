import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Lấy danh sách tất cả bệnh nhân
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: Danh sách bệnh nhân thành công
 */
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT
        infor_users_id,
        phone_number,
        card_id,
        full_name,
        date_of_birth,
        gender,
        permanent_address,
        current_address,
        role_user,
        created_at
      FROM infor_users
      WHERE role_user = 'users'
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);

    return res.status(200).json({
      ok: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách bệnh nhân:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi server khi lấy danh sách bệnh nhân"
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Lấy thông tin bệnh nhân theo ID
 *     tags: [Patients]
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
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        infor_users_id,
        phone_number,
        card_id,
        full_name,
        date_of_birth,
        gender,
        permanent_address,
        current_address,
        role_user
      FROM infor_users
      WHERE infor_users_id = $1 AND role_user = 'users'
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "❌ Không tìm thấy bệnh nhân"
      });
    }

    return res.status(200).json({
      ok: true,
      data: rows[0]
    });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin bệnh nhân:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi server"
    });
  }
});

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Thêm bệnh nhân mới
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone_number, card_id, full_name]
 *             properties:
 *               phone_number: { type: string }
 *               card_id: { type: string }
 *               full_name: { type: string }
 *               date_of_birth: { type: string }
 *               gender: { type: string }
 *               permanent_address: { type: string }
 *               current_address: { type: string }
 *     responses:
 *       201:
 *         description: Thêm bệnh nhân thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', async (req, res) => {
  try {
    const {
      phone_number,
      card_id,
      full_name,
      date_of_birth,
      gender,
      permanent_address,
      current_address
    } = req.body;

    // Validate
    if (!phone_number || !card_id || !full_name) {
      return res.status(400).json({
        ok: false,
        error: "❌ Vui lòng nhập đầy đủ: Số điện thoại, CCCD, Họ tên"
      });
    }

    // Kiểm tra số điện thoại phải 10 số
    if (!/^\d{10}$/.test(phone_number)) {
      return res.status(400).json({
        ok: false,
        error: "❌ Số điện thoại phải gồm đúng 10 chữ số"
      });
    }

    // Kiểm tra CCCD phải 12 số
    if (!/^\d{12}$/.test(card_id)) {
      return res.status(400).json({
        ok: false,
        error: "❌ Số CCCD phải gồm đúng 12 chữ số"
      });
    }

    // Kiểm tra trùng
    const checkQuery = `
      SELECT infor_users_id FROM infor_users
      WHERE phone_number = $1 OR card_id = $2
      LIMIT 1
    `;
    const checkResult = await pool.query(checkQuery, [phone_number, card_id]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        ok: false,
        error: "❌ Số điện thoại hoặc CCCD đã tồn tại trong hệ thống"
      });
    }

    // Thêm mới
    const insertQuery = `
      INSERT INTO infor_users
        (phone_number, card_id, full_name, date_of_birth, gender, permanent_address, current_address, role_user)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'users')
      RETURNING
        infor_users_id,
        phone_number,
        card_id,
        full_name,
        date_of_birth,
        gender,
        permanent_address,
        current_address,
        role_user,
        created_at
    `;

    const { rows } = await pool.query(insertQuery, [
      phone_number,
      card_id,
      full_name,
      date_of_birth || null,
      gender || null,
      permanent_address || null,
      current_address || null
    ]);

    return res.status(201).json({
      ok: true,
      message: "✅ Thêm bệnh nhân thành công!",
      data: rows[0]
    });

  } catch (err) {
    console.error("Lỗi khi thêm bệnh nhân:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi server khi thêm bệnh nhân"
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Cập nhật thông tin bệnh nhân
 *     tags: [Patients]
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
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res.status(400).json({
        ok: false,
        error: "❌ Không có dữ liệu để cập nhật"
      });
    }

    const setQuery = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `
      UPDATE infor_users
      SET ${setQuery}, updated_at = CURRENT_TIMESTAMP
      WHERE infor_users_id = $${fields.length + 1} AND role_user = 'users'
      RETURNING *
    `;

    const { rows } = await pool.query(query, [...values, id]);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "❌ Không tìm thấy bệnh nhân"
      });
    }

    return res.status(200).json({
      ok: true,
      message: "✅ Cập nhật thành công",
      data: rows[0]
    });

  } catch (err) {
    console.error("Lỗi khi cập nhật bệnh nhân:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi server"
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Xóa bệnh nhân
 *     tags: [Patients]
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
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM infor_users
      WHERE infor_users_id = $1 AND role_user = 'users'
      RETURNING infor_users_id
    `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "❌ Không tìm thấy bệnh nhân"
      });
    }

    return res.status(200).json({
      ok: true,
      message: "✅ Xóa bệnh nhân thành công"
    });

  } catch (err) {
    console.error("Lỗi khi xóa bệnh nhân:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi server"
    });
  }
});

/**
 * @swagger
 * /api/patients/search/{keyword}:
 *   get:
 *     summary: Tìm kiếm bệnh nhân
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */
router.get('/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;

    const query = `
      SELECT
        infor_users_id,
        phone_number,
        card_id,
        full_name,
        date_of_birth,
        gender,
        permanent_address,
        current_address
      FROM infor_users
      WHERE role_user = 'users'
        AND (
          full_name ILIKE $1
          OR phone_number ILIKE $1
          OR card_id ILIKE $1
        )
      ORDER BY full_name ASC
    `;

    const { rows } = await pool.query(query, [`%${keyword}%`]);

    return res.status(200).json({
      ok: true,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    console.error("Lỗi khi tìm kiếm bệnh nhân:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi server"
    });
  }
});

export default router;
