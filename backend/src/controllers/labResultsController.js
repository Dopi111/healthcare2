import pool from '../config/db.js';

/**
 * Create a new lab result
 * POST /api/lab-results
 */
export const createLabResult = async (req, res) => {
  const {
    infor_users_id,
    patient_name,
    patient_phone,
    patient_card_id,
    appointment_id,
    test_type,
    test_category,
    test_date,
    sample_type,
    result_values,
    result_summary,
    result_status,
    reference_range,
    unit,
    doctor_id,
    doctor_name,
    doctor_notes,
    technician_id,
    technician_name,
    attachment_url,
    status,
    notes
  } = req.body;

  try {
    // Validation
    if (!patient_name || !test_type || !test_date) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ thông tin bắt buộc!'
      });
    }

    const result = await pool.query(
      `INSERT INTO lab_results
       (infor_users_id, patient_name, patient_phone, patient_card_id, appointment_id,
        test_type, test_category, test_date, sample_type, result_values, result_summary,
        result_status, reference_range, unit, doctor_id, doctor_name, doctor_notes,
        technician_id, technician_name, attachment_url, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
       RETURNING *`,
      [
        infor_users_id || null,
        patient_name,
        patient_phone,
        patient_card_id,
        appointment_id || null,
        test_type,
        test_category,
        test_date,
        sample_type,
        result_values ? JSON.stringify(result_values) : null,
        result_summary,
        result_status || 'normal',
        reference_range,
        unit,
        doctor_id || null,
        doctor_name,
        doctor_notes,
        technician_id || null,
        technician_name,
        attachment_url,
        status || 'completed',
        notes
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo kết quả xét nghiệm thành công!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Create lab result error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Get all lab results with filters
 * GET /api/lab-results
 */
export const getAllLabResults = async (req, res) => {
  const { status, result_status, test_type, from_date, to_date, limit = 50, offset = 0 } = req.query;

  try {
    let query = 'SELECT * FROM lab_results WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (result_status) {
      paramCount++;
      query += ` AND result_status = $${paramCount}`;
      params.push(result_status);
    }

    if (test_type) {
      paramCount++;
      query += ` AND test_type ILIKE $${paramCount}`;
      params.push(`%${test_type}%`);
    }

    if (from_date) {
      paramCount++;
      query += ` AND test_date >= $${paramCount}`;
      params.push(from_date);
    }

    if (to_date) {
      paramCount++;
      query += ` AND test_date <= $${paramCount}`;
      params.push(to_date);
    }

    query += ' ORDER BY test_date DESC, created_at DESC';

    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM lab_results WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (status) {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }

    if (result_status) {
      countParamCount++;
      countQuery += ` AND result_status = $${countParamCount}`;
      countParams.push(result_status);
    }

    if (test_type) {
      countParamCount++;
      countQuery += ` AND test_type ILIKE $${countParamCount}`;
      countParams.push(`%${test_type}%`);
    }

    if (from_date) {
      countParamCount++;
      countQuery += ` AND test_date >= $${countParamCount}`;
      countParams.push(from_date);
    }

    if (to_date) {
      countParamCount++;
      countQuery += ` AND test_date <= $${countParamCount}`;
      countParams.push(to_date);
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
    console.error('Get lab results error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Get lab results by user ID
 * GET /api/lab-results/user/:user_id
 */
export const getUserLabResults = async (req, res) => {
  const { user_id } = req.params;
  const { limit = 20, offset = 0 } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM lab_results
       WHERE infor_users_id = $1
       ORDER BY test_date DESC, created_at DESC
       LIMIT $2 OFFSET $3`,
      [user_id, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM lab_results WHERE infor_users_id = $1',
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
    console.error('Get user lab results error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Get single lab result by ID
 * GET /api/lab-results/:id
 */
export const getLabResultById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM lab_results WHERE lab_result_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy kết quả xét nghiệm!'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get lab result error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Update lab result
 * PUT /api/lab-results/:id
 */
export const updateLabResult = async (req, res) => {
  const { id } = req.params;
  const {
    test_type,
    test_category,
    test_date,
    sample_type,
    result_values,
    result_summary,
    result_status,
    reference_range,
    unit,
    doctor_notes,
    attachment_url,
    status,
    notes
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE lab_results
       SET test_type = COALESCE($1, test_type),
           test_category = COALESCE($2, test_category),
           test_date = COALESCE($3, test_date),
           sample_type = COALESCE($4, sample_type),
           result_values = COALESCE($5, result_values),
           result_summary = COALESCE($6, result_summary),
           result_status = COALESCE($7, result_status),
           reference_range = COALESCE($8, reference_range),
           unit = COALESCE($9, unit),
           doctor_notes = COALESCE($10, doctor_notes),
           attachment_url = COALESCE($11, attachment_url),
           status = COALESCE($12, status),
           notes = COALESCE($13, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE lab_result_id = $14
       RETURNING *`,
      [
        test_type,
        test_category,
        test_date,
        sample_type,
        result_values ? JSON.stringify(result_values) : null,
        result_summary,
        result_status,
        reference_range,
        unit,
        doctor_notes,
        attachment_url,
        status,
        notes,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy kết quả xét nghiệm!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật kết quả xét nghiệm thành công!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update lab result error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Verify lab result
 * PUT /api/lab-results/:id/verify
 */
export const verifyLabResult = async (req, res) => {
  const { id } = req.params;
  const { verified_by } = req.body;

  try {
    const result = await pool.query(
      `UPDATE lab_results
       SET status = 'verified',
           verified_at = CURRENT_TIMESTAMP,
           verified_by = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE lab_result_id = $2
       RETURNING *`,
      [verified_by, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy kết quả xét nghiệm!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xác nhận kết quả xét nghiệm thành công!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Verify lab result error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};

/**
 * Delete lab result
 * DELETE /api/lab-results/:id
 */
export const deleteLabResult = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM lab_results WHERE lab_result_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy kết quả xét nghiệm!'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa kết quả xét nghiệm thành công!'
    });
  } catch (error) {
    console.error('Delete lab result error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message
    });
  }
};
