/**
 * Test Results Controller
 * Handles all test result operations (replacing TestResultService localStorage)
 */

import pool from '../config/db.js';

export const getAllTestResults = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM test_results ORDER BY order_date DESC, created_at DESC');
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get all test results error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách kết quả xét nghiệm', error: error.message });
  }
};

export const getTestResultById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM test_results WHERE test_result_id = $1', [id]);
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
    const result = await pool.query('SELECT * FROM test_results WHERE test_code = $1', [code]);
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
    const { test_code, patient_id, patient_code, patient_name, test_type, doctor_order,
            order_date, sample_date, result_date, status, priority, results, notes } = req.body;

    if (!test_code || !patient_name || !test_type || !order_date) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const checkCode = await client.query('SELECT test_result_id FROM test_results WHERE test_code = $1', [test_code]);
    if (checkCode.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Mã phiếu xét nghiệm đã tồn tại' });
    }

    const insertQuery = `INSERT INTO test_results (test_code, patient_id, patient_code, patient_name, test_type, doctor_order,
                         order_date, sample_date, result_date, status, priority, results, notes)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
    const values = [test_code, patient_id || null, patient_code || null, patient_name, test_type, doctor_order || null,
                    order_date, sample_date || null, result_date || null, status || 'Đang xử lý', priority || 'Bình thường',
                    results ? JSON.stringify(results) : '{}', notes || null];
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
    const { test_code, patient_id, patient_code, patient_name, test_type, doctor_order,
            order_date, sample_date, result_date, status, priority, results, notes } = req.body;

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
                         patient_code = COALESCE($3, patient_code), patient_name = COALESCE($4, patient_name),
                         test_type = COALESCE($5, test_type), doctor_order = COALESCE($6, doctor_order),
                         order_date = COALESCE($7, order_date), sample_date = COALESCE($8, sample_date),
                         result_date = COALESCE($9, result_date), status = COALESCE($10, status), priority = COALESCE($11, priority),
                         results = COALESCE($12, results), notes = COALESCE($13, notes)
                         WHERE test_result_id = $14 RETURNING *`;
    const values = [test_code, patient_id, patient_code, patient_name, test_type, doctor_order, order_date, sample_date,
                    result_date, status, priority, results ? JSON.stringify(results) : null, notes, id];
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
    const searchQuery = `SELECT * FROM test_results WHERE test_code ILIKE $1 OR patient_code ILIKE $1 OR
                         patient_name ILIKE $1 OR test_type ILIKE $1 ORDER BY order_date DESC`;
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
    const result = await pool.query('SELECT * FROM test_results WHERE status = $1 ORDER BY order_date DESC', [status]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get test results by status error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách kết quả xét nghiệm theo trạng thái', error: error.message });
  }
};

export const getTestResultsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const result = await pool.query('SELECT * FROM test_results WHERE patient_id = $1 ORDER BY order_date DESC', [patientId]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get test results by patient error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách kết quả xét nghiệm theo bệnh nhân', error: error.message });
  }
};

export const getTestResultsByDoctor = async (req, res) => {
  try {
    const { doctorName } = req.params;
    const result = await pool.query('SELECT * FROM test_results WHERE doctor_order = $1 ORDER BY order_date DESC', [doctorName]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get test results by doctor error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách kết quả xét nghiệm theo bác sĩ', error: error.message });
  }
};
