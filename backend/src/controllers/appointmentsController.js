import pool from '../config/db.js';

/**
 * Create a new appointment
 * POST /api/appointments
 */
export const createAppointment = async (req, res) => {
  const {
    infor_users_id,
    full_name,
    phone_number,
    email,
    specialty,
    doctor_name,
    appointment_date,
    appointment_time,
    notes
  } = req.body;

  try {
    // Validation
    if (!full_name || !phone_number || !specialty || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc!'
      });
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không hợp lệ!'
      });
    }

    // Check if user exists (if infor_users_id is provided)
    if (infor_users_id) {
      const userCheck = await pool.query(
        'SELECT infor_users_id FROM infor_users WHERE infor_users_id = $1',
        [infor_users_id]
      );

      if (userCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Người dùng không tồn tại!'
        });
      }
    }

    // Create appointment
    const result = await pool.query(
      `INSERT INTO appointments
       (infor_users_id, full_name, phone_number, email, specialty, doctor_name,
        appointment_date, appointment_time, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
       RETURNING *`,
      [
        infor_users_id || null,
        full_name,
        phone_number,
        email,
        specialty,
        doctor_name,
        appointment_date,
        appointment_time,
        notes
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Đặt lịch hẹn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Get all appointments (for admin)
 * GET /api/appointments
 */
export const getAllAppointments = async (req, res) => {
  const { status, limit = 50, offset = 0, date } = req.query;

  try {
    let query = 'SELECT * FROM appointments WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (date) {
      paramCount++;
      query += ` AND appointment_date = $${paramCount}`;
      params.push(date);
    }

    query += ' ORDER BY appointment_date DESC, appointment_time DESC';

    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM appointments WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (status) {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }

    if (date) {
      countParamCount++;
      countQuery += ` AND appointment_date = $${countParamCount}`;
      countParams.push(date);
    }

    const countResult = await pool.query(countQuery, countParams);

    res.status(200).json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Get appointments by user ID
 * GET /api/appointments/user/:user_id
 */
export const getUserAppointments = async (req, res) => {
  const { user_id } = req.params;
  const { status, limit = 20, offset = 0 } = req.query;

  try {
    let query = 'SELECT * FROM appointments WHERE infor_users_id = $1';
    const params = [user_id];
    let paramCount = 1;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY appointment_date DESC, appointment_time DESC';

    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM appointments WHERE infor_users_id = $1';
    const countParams = [user_id];
    let countParamCount = 1;

    if (status) {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }

    const countResult = await pool.query(countQuery, countParams);

    res.status(200).json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Get single appointment by ID
 * GET /api/appointments/:id
 */
export const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM appointments WHERE appointment_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn!'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Update appointment status
 * PUT /api/appointments/:id/status
 */
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status, confirmed_by } = req.body;

  try {
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ!'
      });
    }

    const result = await pool.query(
      `UPDATE appointments
       SET status = $1,
           confirmed_at = CASE WHEN $1 = 'confirmed' THEN CURRENT_TIMESTAMP ELSE confirmed_at END,
           confirmed_by = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE appointment_id = $3
       RETURNING *`,
      [status, confirmed_by || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Update appointment details
 * PUT /api/appointments/:id
 */
export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const {
    specialty,
    doctor_name,
    appointment_date,
    appointment_time,
    notes
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE appointments
       SET specialty = COALESCE($1, specialty),
           doctor_name = COALESCE($2, doctor_name),
           appointment_date = COALESCE($3, appointment_date),
           appointment_time = COALESCE($4, appointment_time),
           notes = COALESCE($5, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE appointment_id = $6
       RETURNING *`,
      [specialty, doctor_name, appointment_date, appointment_time, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật lịch hẹn thành công!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Delete appointment
 * DELETE /api/appointments/:id
 */
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM appointments WHERE appointment_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa lịch hẹn thành công!'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};
