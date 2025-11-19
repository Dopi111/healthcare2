/**
 * Insurance Controller
 * Handles all insurance claim operations (replacing InsuranceService localStorage)
 */

import pool from '../config/db.js';

export const getAllInsurance = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM insurance_claims ORDER BY visit_date DESC, created_at DESC');
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get all insurance error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách bảo hiểm', error: error.message });
  }
};

export const getInsuranceById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM insurance_claims WHERE insurance_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ bảo hiểm' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get insurance by ID error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin bảo hiểm', error: error.message });
  }
};

export const createInsurance = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { claim_code, patient_id, patient_code, patient_name, insurance_card, insurance_type,
            visit_date, total_amount, insurance_covered, patient_pay, status, approved_by, approved_date, notes } = req.body;

    if (!claim_code || !patient_name || !visit_date || !total_amount) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const checkCode = await client.query('SELECT insurance_id FROM insurance_claims WHERE claim_code = $1', [claim_code]);
    if (checkCode.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Mã hồ sơ đã tồn tại' });
    }

    const insertQuery = `INSERT INTO insurance_claims (claim_code, patient_id, patient_code, patient_name, insurance_card,
                         insurance_type, visit_date, total_amount, insurance_covered, patient_pay, status, approved_by, approved_date, notes)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`;
    const values = [claim_code, patient_id || null, patient_code || null, patient_name, insurance_card || null,
                    insurance_type || null, visit_date, total_amount, insurance_covered || 0, patient_pay || 0,
                    status || 'Chờ duyệt', approved_by || null, approved_date || null, notes || null];
    const result = await client.query(insertQuery, values);

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Thêm hồ sơ bảo hiểm thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create insurance error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi thêm hồ sơ bảo hiểm', error: error.message });
  } finally {
    client.release();
  }
};

export const updateInsurance = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { claim_code, patient_id, patient_code, patient_name, insurance_card, insurance_type,
            visit_date, total_amount, insurance_covered, patient_pay, status, approved_by, approved_date, notes } = req.body;

    const checkInsurance = await client.query('SELECT insurance_id FROM insurance_claims WHERE insurance_id = $1', [id]);
    if (checkInsurance.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ bảo hiểm' });
    }

    if (claim_code) {
      const checkCode = await client.query('SELECT insurance_id FROM insurance_claims WHERE claim_code = $1 AND insurance_id != $2', [claim_code, id]);
      if (checkCode.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Mã hồ sơ đã tồn tại' });
      }
    }

    const updateQuery = `UPDATE insurance_claims SET claim_code = COALESCE($1, claim_code), patient_id = COALESCE($2, patient_id),
                         patient_code = COALESCE($3, patient_code), patient_name = COALESCE($4, patient_name),
                         insurance_card = COALESCE($5, insurance_card), insurance_type = COALESCE($6, insurance_type),
                         visit_date = COALESCE($7, visit_date), total_amount = COALESCE($8, total_amount),
                         insurance_covered = COALESCE($9, insurance_covered), patient_pay = COALESCE($10, patient_pay),
                         status = COALESCE($11, status), approved_by = COALESCE($12, approved_by),
                         approved_date = COALESCE($13, approved_date), notes = COALESCE($14, notes)
                         WHERE insurance_id = $15 RETURNING *`;
    const values = [claim_code, patient_id, patient_code, patient_name, insurance_card, insurance_type, visit_date,
                    total_amount, insurance_covered, patient_pay, status, approved_by, approved_date, notes, id];
    const result = await client.query(updateQuery, values);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Cập nhật hồ sơ bảo hiểm thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update insurance error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật hồ sơ bảo hiểm', error: error.message });
  } finally {
    client.release();
  }
};

export const deleteInsurance = async (req, res) => {
  try {
    const { id } = req.params;
    const checkInsurance = await pool.query('SELECT insurance_id FROM insurance_claims WHERE insurance_id = $1', [id]);
    if (checkInsurance.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ bảo hiểm' });
    }
    await pool.query('DELETE FROM insurance_claims WHERE insurance_id = $1', [id]);
    res.status(200).json({ success: true, message: 'Xóa hồ sơ bảo hiểm thành công' });
  } catch (error) {
    console.error('Delete insurance error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa hồ sơ bảo hiểm', error: error.message });
  }
};

export const getInsuranceStatistics = async (req, res) => {
  try {
    const statsQuery = `SELECT COUNT(*) as total, COUNT(CASE WHEN status = 'Đã duyệt' THEN 1 END) as approved,
                        COUNT(CASE WHEN status = 'Chờ duyệt' THEN 1 END) as pending,
                        COUNT(CASE WHEN status = 'Từ chối' THEN 1 END) as rejected,
                        SUM(total_amount) as total_amount, SUM(insurance_covered) as insurance_covered, SUM(patient_pay) as patient_pay
                        FROM insurance_claims`;
    const result = await pool.query(statsQuery);
    res.status(200).json({ success: true, data: result.rows[0] || {} });
  } catch (error) {
    console.error('Get insurance statistics error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thống kê bảo hiểm', error: error.message });
  }
};
