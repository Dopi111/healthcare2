/**
 * Laboratory Tests Controller
 * Handles all laboratory test operations (replacing LaboratoryService localStorage)
 */

import pool from '../config/db.js';

export const getAllLabTests = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM laboratory_tests ORDER BY received_date DESC, created_at DESC');
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get all lab tests error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách xét nghiệm', error: error.message });
  }
};

export const getLabTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM laboratory_tests WHERE lab_test_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy xét nghiệm' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get lab test by ID error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin xét nghiệm', error: error.message });
  }
};

export const getLabTestByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query('SELECT * FROM laboratory_tests WHERE test_code = $1', [code]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy xét nghiệm' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get lab test by code error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin xét nghiệm', error: error.message });
  }
};

export const createLabTest = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { test_code, patient_id, patient_code, patient_name, test_type, sample_id, sample_type,
            received_date, received_time, technician, status, priority, results, notes } = req.body;

    if (!test_code || !patient_name || !test_type || !received_date) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const checkCode = await client.query('SELECT lab_test_id FROM laboratory_tests WHERE test_code = $1', [test_code]);
    if (checkCode.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Mã xét nghiệm đã tồn tại' });
    }

    if (sample_id) {
      const checkSample = await client.query('SELECT lab_test_id FROM laboratory_tests WHERE sample_id = $1', [sample_id]);
      if (checkSample.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Mã mẫu bệnh phẩm đã tồn tại' });
      }
    }

    const insertQuery = `INSERT INTO laboratory_tests (test_code, patient_id, patient_code, patient_name, test_type, sample_id, sample_type,
                         received_date, received_time, technician, status, priority, results, notes)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
    const values = [test_code, patient_id || null, patient_code || null, patient_name, test_type, sample_id || null, sample_type || null,
                    received_date, received_time || null, technician || null, status || 'Chờ xử lý', priority || 'Bình thường',
                    results ? JSON.stringify(results) : '{}', notes || null];
    const result = await client.query(insertQuery, values);

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Thêm xét nghiệm thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create lab test error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi thêm xét nghiệm', error: error.message });
  } finally {
    client.release();
  }
};

export const updateLabTest = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { test_code, patient_id, patient_code, patient_name, test_type, sample_id, sample_type,
            received_date, received_time, technician, status, priority, results, completed_date, completed_time, verified_by, notes } = req.body;

    const checkLabTest = await client.query('SELECT lab_test_id FROM laboratory_tests WHERE lab_test_id = $1', [id]);
    if (checkLabTest.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Không tìm thấy xét nghiệm' });
    }

    if (test_code) {
      const checkCode = await client.query('SELECT lab_test_id FROM laboratory_tests WHERE test_code = $1 AND lab_test_id != $2', [test_code, id]);
      if (checkCode.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Mã xét nghiệm đã tồn tại' });
      }
    }

    if (sample_id) {
      const checkSample = await client.query('SELECT lab_test_id FROM laboratory_tests WHERE sample_id = $1 AND lab_test_id != $2', [sample_id, id]);
      if (checkSample.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Mã mẫu bệnh phẩm đã tồn tại' });
      }
    }

    const updateQuery = `UPDATE laboratory_tests SET test_code = COALESCE($1, test_code), patient_id = COALESCE($2, patient_id),
                         patient_code = COALESCE($3, patient_code), patient_name = COALESCE($4, patient_name),
                         test_type = COALESCE($5, test_type), sample_id = COALESCE($6, sample_id), sample_type = COALESCE($7, sample_type),
                         received_date = COALESCE($8, received_date), received_time = COALESCE($9, received_time),
                         technician = COALESCE($10, technician), status = COALESCE($11, status), priority = COALESCE($12, priority),
                         results = COALESCE($13, results), completed_date = COALESCE($14, completed_date),
                         completed_time = COALESCE($15, completed_time), verified_by = COALESCE($16, verified_by), notes = COALESCE($17, notes)
                         WHERE lab_test_id = $18 RETURNING *`;
    const values = [test_code, patient_id, patient_code, patient_name, test_type, sample_id, sample_type, received_date, received_time,
                    technician, status, priority, results ? JSON.stringify(results) : null, completed_date, completed_time, verified_by, notes, id];
    const result = await client.query(updateQuery, values);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Cập nhật xét nghiệm thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update lab test error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật xét nghiệm', error: error.message });
  } finally {
    client.release();
  }
};

export const deleteLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    const checkLabTest = await pool.query('SELECT lab_test_id FROM laboratory_tests WHERE lab_test_id = $1', [id]);
    if (checkLabTest.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy xét nghiệm' });
    }
    await pool.query('DELETE FROM laboratory_tests WHERE lab_test_id = $1', [id]);
    res.status(200).json({ success: true, message: 'Xóa xét nghiệm thành công' });
  } catch (error) {
    console.error('Delete lab test error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa xét nghiệm', error: error.message });
  }
};

export const getLabTestStatistics = async (req, res) => {
  try {
    const statsQuery = `SELECT COUNT(*) as total, COUNT(CASE WHEN status = 'Chờ xử lý' THEN 1 END) as pending,
                        COUNT(CASE WHEN status = 'Đang xét nghiệm' THEN 1 END) as in_progress,
                        COUNT(CASE WHEN status = 'Hoàn thành' THEN 1 END) as completed,
                        COUNT(CASE WHEN priority = 'Cấp tốc' THEN 1 END) as urgent FROM laboratory_tests`;
    const result = await pool.query(statsQuery);
    res.status(200).json({ success: true, data: result.rows[0] || {} });
  } catch (error) {
    console.error('Get lab test statistics error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thống kê xét nghiệm', error: error.message });
  }
};

export const searchLabTests = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập từ khóa tìm kiếm' });
    }
    const searchQuery = `SELECT * FROM laboratory_tests WHERE test_code ILIKE $1 OR patient_code ILIKE $1 OR
                         patient_name ILIKE $1 OR test_type ILIKE $1 OR sample_id ILIKE $1 ORDER BY received_date DESC`;
    const result = await pool.query(searchQuery, [`%${query}%`]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Search lab tests error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi tìm kiếm xét nghiệm', error: error.message });
  }
};

export const getLabTestsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const result = await pool.query('SELECT * FROM laboratory_tests WHERE status = $1 ORDER BY received_date DESC', [status]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get lab tests by status error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách xét nghiệm theo trạng thái', error: error.message });
  }
};
