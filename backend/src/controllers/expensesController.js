/**
 * Expenses Controller
 * Handles all expense-related operations (replacing ExpenseService localStorage)
 */

import pool from '../config/db.js';

/**
 * @desc Get all expenses
 * @route GET /api/expenses
 */
export const getAllExpenses = async (req, res) => {
  try {
    const query = 'SELECT * FROM expenses ORDER BY date DESC, created_at DESC';
    const result = await pool.query(query);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Get all expenses error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách chi phí',
      error: error.message
    });
  }
};

/**
 * @desc Get expense by ID
 * @route GET /api/expenses/:id
 */
export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM expenses WHERE expense_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi phí'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get expense by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin chi phí',
      error: error.message
    });
  }
};

/**
 * @desc Create new expense
 * @route POST /api/expenses
 */
export const createExpense = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      expense_code,
      date,
      category,
      department,
      amount,
      description,
      approved_by,
      status
    } = req.body;

    if (!expense_code || !date || !category || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Check duplicate expense code
    const checkCode = await client.query(
      'SELECT expense_id FROM expenses WHERE expense_code = $1',
      [expense_code]
    );

    if (checkCode.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Mã chi phí đã tồn tại'
      });
    }

    const insertQuery = `
      INSERT INTO expenses (expense_code, date, category, department, amount, description, approved_by, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      expense_code,
      date,
      category,
      department || null,
      amount,
      description || null,
      approved_by || null,
      status || 'Chờ duyệt'
    ];

    const result = await client.query(insertQuery, values);
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Thêm chi phí thành công',
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm chi phí',
      error: error.message
    });
  } finally {
    client.release();
  }
};

/**
 * @desc Update expense
 * @route PUT /api/expenses/:id
 */
export const updateExpense = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const {
      expense_code,
      date,
      category,
      department,
      amount,
      description,
      approved_by,
      status
    } = req.body;

    const checkExpense = await client.query(
      'SELECT expense_id FROM expenses WHERE expense_id = $1',
      [id]
    );

    if (checkExpense.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi phí'
      });
    }

    if (expense_code) {
      const checkCode = await client.query(
        'SELECT expense_id FROM expenses WHERE expense_code = $1 AND expense_id != $2',
        [expense_code, id]
      );

      if (checkCode.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: 'Mã chi phí đã tồn tại'
        });
      }
    }

    const updateQuery = `
      UPDATE expenses
      SET
        expense_code = COALESCE($1, expense_code),
        date = COALESCE($2, date),
        category = COALESCE($3, category),
        department = COALESCE($4, department),
        amount = COALESCE($5, amount),
        description = COALESCE($6, description),
        approved_by = COALESCE($7, approved_by),
        status = COALESCE($8, status)
      WHERE expense_id = $9
      RETURNING *
    `;

    const values = [expense_code, date, category, department, amount, description, approved_by, status, id];
    const result = await client.query(updateQuery, values);

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Cập nhật chi phí thành công',
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật chi phí',
      error: error.message
    });
  } finally {
    client.release();
  }
};

/**
 * @desc Delete expense
 * @route DELETE /api/expenses/:id
 */
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const checkExpense = await pool.query(
      'SELECT expense_id FROM expenses WHERE expense_id = $1',
      [id]
    );

    if (checkExpense.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chi phí'
      });
    }

    await pool.query('DELETE FROM expenses WHERE expense_id = $1', [id]);

    res.status(200).json({
      success: true,
      message: 'Xóa chi phí thành công'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa chi phí',
      error: error.message
    });
  }
};

/**
 * @desc Get expense statistics
 * @route GET /api/expenses/statistics
 */
export const getExpenseStatistics = async (req, res) => {
  try {
    const statsQuery = `
      SELECT
        COUNT(*) as total_count,
        SUM(amount) as total_amount,
        SUM(CASE WHEN status = 'Đã chi' THEN amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN status = 'Chờ duyệt' THEN amount ELSE 0 END) as pending_amount,
        COUNT(CASE WHEN status = 'Đã chi' THEN 1 END) as paid_count,
        COUNT(CASE WHEN status = 'Chờ duyệt' THEN 1 END) as pending_count,
        json_object_agg(category, category_amount) as category_stats
      FROM (
        SELECT category, SUM(amount) as category_amount
        FROM expenses
        GROUP BY category
      ) as category_data, expenses
      GROUP BY ()
    `;

    const result = await pool.query(statsQuery);

    res.status(200).json({
      success: true,
      data: result.rows[0] || {}
    });
  } catch (error) {
    console.error('Get expense statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê chi phí',
      error: error.message
    });
  }
};
