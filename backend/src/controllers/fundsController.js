/**
 * Funds Controller
 * Handles all fund transaction operations (replacing FundService localStorage)
 */

import pool from '../config/db.js';

export const getAllFunds = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM funds ORDER BY date DESC, created_at DESC');
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get all funds error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách quỹ', error: error.message });
  }
};

export const getFundById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM funds WHERE fund_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giao dịch' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get fund by ID error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin giao dịch', error: error.message });
  }
};

export const createFund = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { transaction_code, date, type, category, amount, description, created_by } = req.body;

    if (!transaction_code || !date || !type || !category || !amount) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const checkCode = await client.query('SELECT fund_id FROM funds WHERE transaction_code = $1', [transaction_code]);
    if (checkCode.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Mã giao dịch đã tồn tại' });
    }

    const insertQuery = `INSERT INTO funds (transaction_code, date, type, category, amount, description, created_by)
                         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const result = await client.query(insertQuery, [transaction_code, date, type, category, amount, description || null, created_by || null]);

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Thêm giao dịch thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create fund error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi thêm giao dịch', error: error.message });
  } finally {
    client.release();
  }
};

export const updateFund = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { transaction_code, date, type, category, amount, description, created_by } = req.body;

    const checkFund = await client.query('SELECT fund_id FROM funds WHERE fund_id = $1', [id]);
    if (checkFund.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Không tìm thấy giao dịch' });
    }

    if (transaction_code) {
      const checkCode = await client.query('SELECT fund_id FROM funds WHERE transaction_code = $1 AND fund_id != $2', [transaction_code, id]);
      if (checkCode.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Mã giao dịch đã tồn tại' });
      }
    }

    const updateQuery = `UPDATE funds SET transaction_code = COALESCE($1, transaction_code), date = COALESCE($2, date),
                         type = COALESCE($3, type), category = COALESCE($4, category), amount = COALESCE($5, amount),
                         description = COALESCE($6, description), created_by = COALESCE($7, created_by)
                         WHERE fund_id = $8 RETURNING *`;
    const result = await client.query(updateQuery, [transaction_code, date, type, category, amount, description, created_by, id]);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Cập nhật giao dịch thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update fund error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật giao dịch', error: error.message });
  } finally {
    client.release();
  }
};

export const deleteFund = async (req, res) => {
  try {
    const { id } = req.params;
    const checkFund = await pool.query('SELECT fund_id FROM funds WHERE fund_id = $1', [id]);
    if (checkFund.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giao dịch' });
    }
    await pool.query('DELETE FROM funds WHERE fund_id = $1', [id]);
    res.status(200).json({ success: true, message: 'Xóa giao dịch thành công' });
  } catch (error) {
    console.error('Delete fund error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa giao dịch', error: error.message });
  }
};

export const getFundStatistics = async (req, res) => {
  try {
    const statsQuery = `SELECT 
      COUNT(*) as transaction_count,
      SUM(CASE WHEN type = 'Thu' THEN amount ELSE 0 END) as total_income,
      SUM(CASE WHEN type = 'Chi' THEN amount ELSE 0 END) as total_expense,
      SUM(CASE WHEN type = 'Thu' THEN amount ELSE -amount END) as balance
      FROM funds`;
    const result = await pool.query(statsQuery);
    res.status(200).json({ success: true, data: result.rows[0] || {} });
  } catch (error) {
    console.error('Get fund statistics error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thống kê quỹ', error: error.message });
  }
};
