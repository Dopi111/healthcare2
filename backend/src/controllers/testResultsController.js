/**
 * Test Results Controller
 * Handles all test result operations (replacing TestResultService localStorage)
 * UPDATED FOR SCHEMA V2: Removed patient_code and patient_name duplication
 */

import pool from '../config/db.js';

export const getAllTestResults = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tr.*, p.patient_code, u.full_name as patient_name
      FROM test_results tr
      LEFT JOIN patients p ON tr.patient_id = p.patient_id
      LEFT JOIN users u ON p.user_id = u.user_id
      ORDER BY tr.order_date DESC, tr.created_at DESC
    `);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get all test results error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách kết quả xét nghiệm', error: error.message });
  }
};

export const getTestResultById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT tr.*, p.patient_code, u.full_name as patient_name
      FROM test_results tr
      LEFT JOIN patients p ON tr.patient_id = p.patient_id
      LEFT JOIN users u ON p.user_id = u.user_id
      WHERE tr.test_result_id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy kết quả xét nghiệm' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get test result by ID error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin kết quả xét nghiệm', error: error.message });
  }
};

export const getTestResultByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query(`
      SELECT tr.*, p.patient_code, u.full_name as patient_name
      FROM test_results tr
      LEFT JOIN patients p ON tr.patient_id = p.patient_id
      LEFT JOIN users u ON p.user_id = u.user_id
      WHERE tr.test_code = $1
    `, [code]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy kết quả xét nghiệm' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get test result by code error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin kết quả xét nghiệm', error: error.message });
  }
};

export const createTestResult = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { test_code, patient_id, test_name, test_type, doctor,
            order_date, sample_collected_date, result_date, status, result_value,
            unit, reference_range, technician, notes } = req.body;

    if (!test_code || !patient_id || !test_name || !order_date) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc (test_code, patient_id, test_name, order_date)' });
    }

    const checkCode = await client.query('SELECT test_result_id FROM test_results WHERE test_code = $1', [test_code]);
    if (checkCode.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Mã phiếu xét nghiệm đã tồn tại' });
    }

    const insertQuery = `INSERT INTO test_results (test_code, patient_id, test_name, test_type, doctor,
                         order_date, sample_collected_date, result_date, status, result_value,
                         unit, reference_range, technician, notes)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
    const values = [test_code, patient_id, test_name, test_type || null, doctor || null,
                    order_date, sample_collected_date || null, result_date || null, status || 'pending',
                    result_value || null, unit || null, reference_range || null, technician || null, notes || null];
    const result = await client.query(insertQuery, values);

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Thêm kết quả xét nghiệm thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create test result error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi thêm kết quả xét nghiệm', error: error.message });
  } finally {
    client.release();
  }
};

export const updateTestResult = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { test_code, patient_id, test_name, test_type, doctor,
            order_date, sample_collected_date, result_date, status, result_value,
            unit, reference_range, technician, notes } = req.body;

    const checkTestResult = await client.query('SELECT test_result_id FROM test_results WHERE test_result_id = $1', [id]);
    if (checkTestResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Không tìm thấy kết quả xét nghiệm' });
    }

    if (test_code) {
      const checkCode = await client.query('SELECT test_result_id FROM test_results WHERE test_code = $1 AND test_result_id != $2', [test_code, id]);
      if (checkCode.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Mã phiếu xét nghiệm đã tồn tại' });
      }
    }

    const updateQuery = `UPDATE test_results SET test_code = COALESCE($1, test_code), patient_id = COALESCE($2, patient_id),
                         test_name = COALESCE($3, test_name), test_type = COALESCE($4, test_type), doctor = COALESCE($5, doctor),
                         order_date = COALESCE($6, order_date), sample_collected_date = COALESCE($7, sample_collected_date),
                         result_date = COALESCE($8, result_date), status = COALESCE($9, status), result_value = COALESCE($10, result_value),
                         unit = COALESCE($11, unit), reference_range = COALESCE($12, reference_range),
                         technician = COALESCE($13, technician), notes = COALESCE($14, notes),
                         updated_at = CURRENT_TIMESTAMP
                         WHERE test_result_id = $15 RETURNING *`;
    const values = [test_code, patient_id, test_name, test_type, doctor,
                    order_date, sample_collected_date, result_date, status, result_value,
                    unit, reference_range, technician, notes, id];
    const result = await client.query(updateQuery, values);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Cập nhật kết quả xét nghiệm thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update test result error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật kết quả xét nghiệm', error: error.message });
  } finally {
    client.release();
  }
};

export const deleteTestResult = async (req, res) => {
  try {
    const { id } = req.params;
    const checkTestResult = await pool.query('SELECT test_result_id FROM test_results WHERE test_result_id = $1', [id]);
    if (checkTestResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy kết quả xét nghiệm' });
    }
    await pool.query('DELETE FROM test_results WHERE test_result_id = $1', [id]);
    res.status(200).json({ success: true, message: 'Xóa kết quả xét nghiệm thành công' });
  } catch (error) {
    console.error('Delete test result error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa kết quả xét nghiệm', error: error.message });
  }
};

export const searchTestResults = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập từ khóa tìm kiếm' });
    }
    const searchQuery = `
      SELECT tr.*, p.patient_code, u.full_name as patient_name
      FROM test_results tr
      LEFT JOIN patients p ON tr.patient_id = p.patient_id
      LEFT JOIN users u ON p.user_id = u.user_id
      WHERE tr.test_code ILIKE $1 OR p.patient_code ILIKE $1 OR
            u.full_name ILIKE $1 OR tr.test_name ILIKE $1 OR tr.test_type ILIKE $1
      ORDER BY tr.order_date DESC
    `;
    const result = await pool.query(searchQuery, [`%${query}%`]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Search test results error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tìm kiếm kết quả xét nghiệm', error: error.message });
  }
};

export const getTestResultsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const result = await pool.query(`
      SELECT tr.*, p.patient_code, u.full_name as patient_name
      FROM test_results tr
      LEFT JOIN patients p ON tr.patient_id = p.patient_id
      LEFT JOIN users u ON p.user_id = u.user_id
      WHERE tr.status = $1
      ORDER BY tr.order_date DESC
    `, [status]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get test results by status error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách kết quả xét nghiệm theo trạng thái', error: error.message });
  }
};

export const getTestResultsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const result = await pool.query(`
      SELECT tr.*, p.patient_code, u.full_name as patient_name
      FROM test_results tr
      LEFT JOIN patients p ON tr.patient_id = p.patient_id
      LEFT JOIN users u ON p.user_id = u.user_id
      WHERE tr.patient_id = $1
      ORDER BY tr.order_date DESC
    `, [patientId]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get test results by patient error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách kết quả xét nghiệm của bệnh nhân', error: error.message });
  }
};

export const getTestResultsByDoctor = async (req, res) => {
  try {
    const { doctorName } = req.params;
    const result = await pool.query(`
      SELECT tr.*, p.patient_code, u.full_name as patient_name
      FROM test_results tr
      LEFT JOIN patients p ON tr.patient_id = p.patient_id
      LEFT JOIN users u ON p.user_id = u.user_id
      WHERE tr.doctor = $1
      ORDER BY tr.order_date DESC
    `, [doctorName]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get test results by doctor error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách kết quả xét nghiệm của bác sĩ', error: error.message });
  }
};
