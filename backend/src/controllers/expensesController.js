/**
 * Expenses Controller - UPDATED FOR SCHEMA V2
 * Column changes: date → expense_date, status values in English
 */

import pool from '../config/db.js';

export const getAllExpenses = async (req, res) => {
  try {
    const query = 'SELECT * FROM expenses ORDER BY expense_date DESC, created_at DESC';
    const result = await pool.query(query);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get all expenses error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách chi phí', error: error.message });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM expenses WHERE expense_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chi phí' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get expense by ID error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin chi phí', error: error.message });
  }
};

export const createExpense = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { expense_code, expense_date, category, department, amount, description, approved_by, status } = req.body;

    if (!expense_code || !expense_date || !category || !amount) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const checkCode = await client.query('SELECT expense_id FROM expenses WHERE expense_code = $1', [expense_code]);
    if (checkCode.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, message: 'Mã chi phí đã tồn tại' });
    }

    const insertQuery = `INSERT INTO expenses (expense_code, expense_date, category, department, amount, description, approved_by, status)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    const values = [expense_code, expense_date, category, department || null, amount, description || null, approved_by || null, status || 'pending'];
    const result = await client.query(insertQuery, values);

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Thêm chi phí thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create expense error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi thêm chi phí', error: error.message });
  } finally {
    client.release();
  }
};

export const updateExpense = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { expense_code, expense_date, category, department, amount, description, approved_by, approval_date, status } = req.body;

    const checkExpense = await client.query('SELECT expense_id FROM expenses WHERE expense_id = $1', [id]);
    if (checkExpense.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Không tìm thấy chi phí' });
    }

    if (expense_code) {
      const checkCode = await client.query('SELECT expense_id FROM expenses WHERE expense_code = $1 AND expense_id != $2', [expense_code, id]);
      if (checkCode.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Mã chi phí đã tồn tại' });
      }
    }

    const updateQuery = `UPDATE expenses SET expense_code = COALESCE($1, expense_code), expense_date = COALESCE($2, expense_date),
                         category = COALESCE($3, category), department = COALESCE($4, department), amount = COALESCE($5, amount),
                         description = COALESCE($6, description), approved_by = COALESCE($7, approved_by),
                         approval_date = COALESCE($8, approval_date), status = COALESCE($9, status), updated_at = CURRENT_TIMESTAMP
                         WHERE expense_id = $10 RETURNING *`;
    const values = [expense_code, expense_date, category, department, amount, description, approved_by, approval_date, status, id];
    const result = await client.query(updateQuery, values);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Cập nhật chi phí thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update expense error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật chi phí', error: error.message });
  } finally {
    client.release();
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const checkExpense = await pool.query('SELECT expense_id FROM expenses WHERE expense_id = $1', [id]);
    if (checkExpense.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy chi phí' });
    }
    await pool.query('DELETE FROM expenses WHERE expense_id = $1', [id]);
    res.status(200).json({ success: true, message: 'Xóa chi phí thành công' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa chi phí', error: error.message });
  }
};

export const getExpenseStatistics = async (req, res) => {
  try {
    const statsQuery = `SELECT COUNT(*) as total_count, COALESCE(SUM(amount), 0) as total_amount,
                        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as paid_amount,
                        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
                        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
                        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
                        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
                        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count
                        FROM expenses`;
    const result = await pool.query(statsQuery);
    res.status(200).json({ success: true, data: result.rows[0] || {} });
  } catch (error) {
    console.error('Get expense statistics error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thống kê chi phí', error: error.message });
  }
};
