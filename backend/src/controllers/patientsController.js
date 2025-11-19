/**
 * Patients Controller
 * Handles all patient-related operations (replacing PatientService localStorage)
 */

import pool from '../config/db.js';

/**
 * @desc Get all patients
 * @route GET /api/patients
 */
export const getAllPatients = async (req, res) => {
  try {
    const query = `
      SELECT
        p.*,
        u.full_name,
        u.phone_number,
        u.card_id,
        u.date_of_birth,
        u.gender,
        u.current_address
      FROM patients p
      LEFT JOIN infor_users u ON p.infor_users_id = u.infor_users_id
      ORDER BY p.created_at DESC
    `;

    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách bệnh nhân',
      error: error.message
    });
  }
};

/**
 * @desc Get patient by ID
 * @route GET /api/patients/:id
 */
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        p.*,
        u.full_name,
        u.phone_number,
        u.card_id,
        u.date_of_birth,
        u.gender,
        u.current_address,
        u.permanent_address
      FROM patients p
      LEFT JOIN infor_users u ON p.infor_users_id = u.infor_users_id
      WHERE p.patient_id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get patient by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin bệnh nhân',
      error: error.message
    });
  }
};

/**
 * @desc Get patient by patient code
 * @route GET /api/patients/code/:code
 */
export const getPatientByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const query = `
      SELECT
        p.*,
        u.full_name,
        u.phone_number,
        u.card_id,
        u.date_of_birth,
        u.gender,
        u.current_address
      FROM patients p
      LEFT JOIN infor_users u ON p.infor_users_id = u.infor_users_id
      WHERE p.patient_code = $1
    `;

    const result = await pool.query(query, [code]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get patient by code error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin bệnh nhân',
      error: error.message
    });
  }
};

/**
 * @desc Create new patient
 * @route POST /api/patients
 */
export const createPatient = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      patient_code,
      infor_users_id,
      doctor_in_charge,
      visit_date,
      diagnosis,
      status,
      medical_history,
      allergies,
      notes
    } = req.body;

    // Validate required fields
    if (!patient_code) {
      return res.status(400).json({
        success: false,
        message: 'Mã bệnh nhân là bắt buộc'
      });
    }

    // Check if patient code already exists
    const checkCode = await client.query(
      'SELECT patient_id FROM patients WHERE patient_code = $1',
      [patient_code]
    );

    if (checkCode.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Mã bệnh nhân đã tồn tại'
      });
    }

    // Insert patient
    const insertQuery = `
      INSERT INTO patients (
        patient_code, infor_users_id, doctor_in_charge, visit_date,
        diagnosis, status, medical_history, allergies, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      patient_code,
      infor_users_id || null,
      doctor_in_charge || null,
      visit_date || null,
      diagnosis || null,
      status || 'Đang điều trị',
      medical_history || null,
      allergies || null,
      notes || null
    ];

    const result = await client.query(insertQuery, values);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Thêm bệnh nhân thành công',
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm bệnh nhân',
      error: error.message
    });
  } finally {
    client.release();
  }
};

/**
 * @desc Update patient
 * @route PUT /api/patients/:id
 */
export const updatePatient = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const {
      patient_code,
      doctor_in_charge,
      visit_date,
      diagnosis,
      status,
      medical_history,
      allergies,
      notes
    } = req.body;

    // Check if patient exists
    const checkPatient = await client.query(
      'SELECT patient_id FROM patients WHERE patient_id = $1',
      [id]
    );

    if (checkPatient.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    // Check if patient code is being changed and already exists
    if (patient_code) {
      const checkCode = await client.query(
        'SELECT patient_id FROM patients WHERE patient_code = $1 AND patient_id != $2',
        [patient_code, id]
      );

      if (checkCode.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'Mã bệnh nhân đã tồn tại'
        });
      }
    }

    // Update patient
    const updateQuery = `
      UPDATE patients
      SET
        patient_code = COALESCE($1, patient_code),
        doctor_in_charge = COALESCE($2, doctor_in_charge),
        visit_date = COALESCE($3, visit_date),
        diagnosis = COALESCE($4, diagnosis),
        status = COALESCE($5, status),
        medical_history = COALESCE($6, medical_history),
        allergies = COALESCE($7, allergies),
        notes = COALESCE($8, notes)
      WHERE patient_id = $9
      RETURNING *
    `;

    const values = [
      patient_code,
      doctor_in_charge,
      visit_date,
      diagnosis,
      status,
      medical_history,
      allergies,
      notes,
      id
    ];

    const result = await client.query(updateQuery, values);

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Cập nhật bệnh nhân thành công',
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật bệnh nhân',
      error: error.message
    });
  } finally {
    client.release();
  }
};

/**
 * @desc Delete patient
 * @route DELETE /api/patients/:id
 */
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if patient exists
    const checkPatient = await pool.query(
      'SELECT patient_id FROM patients WHERE patient_id = $1',
      [id]
    );

    if (checkPatient.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    // Delete patient
    await pool.query('DELETE FROM patients WHERE patient_id = $1', [id]);

    res.status(200).json({
      success: true,
      message: 'Xóa bệnh nhân thành công'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa bệnh nhân',
      error: error.message
    });
  }
};

/**
 * @desc Search patients
 * @route GET /api/patients/search?query=
 */
export const searchPatients = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập từ khóa tìm kiếm'
      });
    }

    const searchQuery = `
      SELECT
        p.*,
        u.full_name,
        u.phone_number,
        u.card_id
      FROM patients p
      LEFT JOIN infor_users u ON p.infor_users_id = u.infor_users_id
      WHERE
        p.patient_code ILIKE $1 OR
        u.full_name ILIKE $1 OR
        u.phone_number ILIKE $1 OR
        p.diagnosis ILIKE $1
      ORDER BY p.created_at DESC
    `;

    const result = await pool.query(searchQuery, [`%${query}%`]);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tìm kiếm bệnh nhân',
      error: error.message
    });
  }
};

/**
 * @desc Get patients by status
 * @route GET /api/patients/status/:status
 */
export const getPatientsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const query = `
      SELECT
        p.*,
        u.full_name,
        u.phone_number,
        u.card_id
      FROM patients p
      LEFT JOIN infor_users u ON p.infor_users_id = u.infor_users_id
      WHERE p.status = $1
      ORDER BY p.created_at DESC
    `;

    const result = await pool.query(query, [status]);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get patients by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách bệnh nhân theo trạng thái',
      error: error.message
    });
  }
};

/**
 * @desc Get patients by doctor
 * @route GET /api/patients/doctor/:doctorName
 */
export const getPatientsByDoctor = async (req, res) => {
  try {
    const { doctorName } = req.params;

    const query = `
      SELECT
        p.*,
        u.full_name,
        u.phone_number,
        u.card_id
      FROM patients p
      LEFT JOIN infor_users u ON p.infor_users_id = u.infor_users_id
      WHERE p.doctor_in_charge = $1
      ORDER BY p.created_at DESC
    `;

    const result = await pool.query(query, [doctorName]);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get patients by doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách bệnh nhân theo bác sĩ',
      error: error.message
    });
  }
};
