import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

/**
 * @swagger
 * /api/user-profile/{user_id}:
 *   get:
 *     summary: Get complete user profile
 *     tags: [User Profile]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    // Get basic user info
    const userResult = await pool.query(
      `SELECT user_id, phone_number, card_id, full_name, date_of_birth,
              gender, email, permanent_address, current_address, created_at
       FROM users
       WHERE user_id = $1 AND role = 'patient'`,
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    const user = userResult.rows[0];

    // Get medical info
    const medicalResult = await pool.query(
      `SELECT * FROM user_medical_infos WHERE user_id = $1`,
      [user_id]
    );

    // Get relatives
    const relativesResult = await pool.query(
      `SELECT * FROM user_relatives WHERE user_id = $1 ORDER BY is_emergency_contact DESC, created_at`,
      [user_id]
    );

    // Get medical history
    const historyResult = await pool.query(
      `SELECT * FROM user_medical_histories WHERE user_id = $1 ORDER BY visit_date DESC LIMIT 20`,
      [user_id]
    );

    res.status(200).json({
      success: true,
      data: {
        user: user,
        medical_info: medicalResult.rows[0] || null,
        relatives: relativesResult.rows,
        medical_history: historyResult.rows
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

/**
 * @swagger
 * /api/user-profile/{user_id}/basic:
 *   put:
 *     summary: Update basic user information
 *     tags: [User Profile]
 *     parameters:
 *       - in: path
 *         name: user_id
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
 *         description: Profile updated successfully
 */
router.put('/:user_id/basic', async (req, res) => {
  const { user_id } = req.params;
  const {
    full_name,
    date_of_birth,
    gender,
    email,
    permanent_address,
    current_address
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           date_of_birth = COALESCE($2, date_of_birth),
           gender = COALESCE($3, gender),
           email = COALESCE($4, email),
           permanent_address = COALESCE($5, permanent_address),
           current_address = COALESCE($6, current_address),
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $7 AND role = 'patient'
       RETURNING *`,
      [full_name, date_of_birth, gender, email, permanent_address, current_address, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    const user = result.rows[0];
    delete user.password;

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công!',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

/**
 * @swagger
 * /api/user-profile/{user_id}/medical:
 *   put:
 *     summary: Update medical information
 *     tags: [User Profile]
 */
router.put('/:user_id/medical', async (req, res) => {
  const { user_id } = req.params;
  const {
    blood_type,
    allergies,
    chronic_diseases,
    emergency_contact_name,
    emergency_contact_phone,
    emergency_contact_relation,
    insurance_number,
    insurance_provider
  } = req.body;

  try {
    // Check if medical info exists
    const checkResult = await pool.query(
      'SELECT * FROM user_medical_infos WHERE user_id = $1',
      [user_id]
    );

    let result;
    if (checkResult.rows.length === 0) {
      // Insert new record
      result = await pool.query(
        `INSERT INTO user_medical_infos
         (user_id, blood_type, allergies, chronic_diseases,
          emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
          insurance_number, insurance_provider)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [user_id, blood_type, allergies, chronic_diseases,
         emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
         insurance_number, insurance_provider]
      );
    } else {
      // Update existing record
      result = await pool.query(
        `UPDATE user_medical_infos
         SET blood_type = COALESCE($1, blood_type),
             allergies = COALESCE($2, allergies),
             chronic_diseases = COALESCE($3, chronic_diseases),
             emergency_contact_name = COALESCE($4, emergency_contact_name),
             emergency_contact_phone = COALESCE($5, emergency_contact_phone),
             emergency_contact_relation = COALESCE($6, emergency_contact_relation),
             insurance_number = COALESCE($7, insurance_number),
             insurance_provider = COALESCE($8, insurance_provider),
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $9
         RETURNING *`,
        [blood_type, allergies, chronic_diseases,
         emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
         insurance_number, insurance_provider, user_id]
      );
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin y tế thành công!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update medical info error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

/**
 * @swagger
 * /api/user-profile/{user_id}/relatives:
 *   post:
 *     summary: Add a relative
 *     tags: [User Profile]
 */
router.post('/:user_id/relatives', async (req, res) => {
  const { user_id } = req.params;
  const { full_name, relation, phone_number, email, address, is_emergency_contact } = req.body;

  try {
    if (!full_name || !relation) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập họ tên và mối quan hệ'
      });
    }

    const result = await pool.query(
      `INSERT INTO user_relatives
       (user_id, full_name, relation, phone_number, email, address, is_emergency_contact)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, full_name, relation, phone_number, email, address, is_emergency_contact || false]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm người thân thành công!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Add relative error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

/**
 * @swagger
 * /api/user-profile/{user_id}/relatives/{relative_id}:
 *   put:
 *     summary: Update a relative
 *     tags: [User Profile]
 */
router.put('/:user_id/relatives/:relative_id', async (req, res) => {
  const { user_id, relative_id } = req.params;
  const { full_name, relation, phone_number, email, address, is_emergency_contact } = req.body;

  try {
    const result = await pool.query(
      `UPDATE user_relatives
       SET full_name = COALESCE($1, full_name),
           relation = COALESCE($2, relation),
           phone_number = COALESCE($3, phone_number),
           email = COALESCE($4, email),
           address = COALESCE($5, address),
           is_emergency_contact = COALESCE($6, is_emergency_contact),
           updated_at = CURRENT_TIMESTAMP
       WHERE relative_id = $7 AND user_id = $8
       RETURNING *`,
      [full_name, relation, phone_number, email, address, is_emergency_contact, relative_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người thân'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin người thân thành công!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update relative error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

/**
 * @swagger
 * /api/user-profile/{user_id}/relatives/{relative_id}:
 *   delete:
 *     summary: Delete a relative
 *     tags: [User Profile]
 */
router.delete('/:user_id/relatives/:relative_id', async (req, res) => {
  const { user_id, relative_id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM user_relatives WHERE relative_id = $1 AND user_id = $2 RETURNING *',
      [relative_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người thân'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa thông tin người thân thành công!'
    });
  } catch (error) {
    console.error('Delete relative error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

/**
 * @swagger
 * /api/user-profile/{user_id}/medical-history:
 *   get:
 *     summary: Get medical history
 *     tags: [User Profile]
 */
router.get('/:user_id/medical-history', async (req, res) => {
  const { user_id } = req.params;
  const { limit = 20, offset = 0 } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM user_medical_histories
       WHERE user_id = $1
       ORDER BY visit_date DESC
       LIMIT $2 OFFSET $3`,
      [user_id, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM user_medical_histories WHERE user_id = $1',
      [user_id]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get medical history error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
});

export default router;
