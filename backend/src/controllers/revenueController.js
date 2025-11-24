/**
 * Revenue Controller - UPDATED FOR SCHEMA V2
 * Column changes: date → revenue_date, month → month_year (YYYY-MM format)
 */

import pool from '../config/db.js';

export const getAllRevenue = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM revenue ORDER BY revenue_date DESC, created_at DESC');
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get all revenue error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách doanh thu', error: error.message });
  }
};

export const getRevenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM revenue WHERE revenue_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy doanh thu' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get revenue by ID error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin doanh thu', error: error.message });
  }
};

export const getRevenueByMonth = async (req, res) => {
  try {
    const { month } = req.params; // Format: YYYY-MM
    const result = await pool.query('SELECT * FROM revenue WHERE month_year = $1 ORDER BY revenue_date DESC', [month]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get revenue by month error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy doanh thu theo tháng', error: error.message });
  }
};

export const createRevenue = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { revenue_date, category, patient_count, revenue_amount, month_year } = req.body;

    if (!revenue_date || !category || !revenue_amount || !month_year) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc (revenue_date, category, revenue_amount, month_year)' });
    }

    // Validate month_year format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(month_year)) {
      return res.status(400).json({ success: false, message: 'month_year phải có định dạng YYYY-MM (ví dụ: 2024-11)' });
    }

    const insertQuery = `INSERT INTO revenue (revenue_date, category, patient_count, revenue_amount, month_year)
                         VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [revenue_date, category, patient_count || 0, revenue_amount, month_year];
    const result = await client.query(insertQuery, values);

    await client.query('COMMIT');
    res.status(201).json({ success: true, message: 'Thêm doanh thu thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create revenue error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi thêm doanh thu', error: error.message });
  } finally {
    client.release();
  }
};

export const updateRevenue = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { revenue_date, category, patient_count, revenue_amount, month_year } = req.body;

    const checkRevenue = await client.query('SELECT revenue_id FROM revenue WHERE revenue_id = $1', [id]);
    if (checkRevenue.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Không tìm thấy doanh thu' });
    }

    // Validate month_year format if provided
    if (month_year && !/^\d{4}-\d{2}$/.test(month_year)) {
      return res.status(400).json({ success: false, message: 'month_year phải có định dạng YYYY-MM (ví dụ: 2024-11)' });
    }

    const updateQuery = `UPDATE revenue SET revenue_date = COALESCE($1, revenue_date),
                         category = COALESCE($2, category), patient_count = COALESCE($3, patient_count),
                         revenue_amount = COALESCE($4, revenue_amount), month_year = COALESCE($5, month_year),
                         updated_at = CURRENT_TIMESTAMP
                         WHERE revenue_id = $6 RETURNING *`;
    const values = [revenue_date, category, patient_count, revenue_amount, month_year, id];
    const result = await client.query(updateQuery, values);

    await client.query('COMMIT');
    res.status(200).json({ success: true, message: 'Cập nhật doanh thu thành công', data: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update revenue error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật doanh thu', error: error.message });
  } finally {
    client.release();
  }
};

export const deleteRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const checkRevenue = await pool.query('SELECT revenue_id FROM revenue WHERE revenue_id = $1', [id]);
    if (checkRevenue.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy doanh thu' });
    }
    await pool.query('DELETE FROM revenue WHERE revenue_id = $1', [id]);
    res.status(200).json({ success: true, message: 'Xóa doanh thu thành công' });
  } catch (error) {
    console.error('Delete revenue error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi xóa doanh thu', error: error.message });
  }
};

export const getRevenueStatistics = async (req, res) => {
  try {
    const statsQuery = `SELECT COUNT(*) as total_records,
                        COALESCE(SUM(patient_count), 0) as total_patients,
                        COALESCE(SUM(revenue_amount), 0) as total_revenue,
                        COALESCE(AVG(CASE WHEN patient_count > 0 THEN revenue_amount / patient_count END), 0) as avg_revenue_per_patient
                        FROM revenue`;
    const result = await pool.query(statsQuery);
    res.status(200).json({ success: true, data: result.rows[0] || {} });
  } catch (error) {
    console.error('Get revenue statistics error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy thống kê doanh thu', error: error.message });
  }
};

export const getMonthlyComparison = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const query = `SELECT month_year, SUM(patient_count) as patients, SUM(revenue_amount) as revenue
                   FROM revenue GROUP BY month_year ORDER BY month_year DESC LIMIT $1`;
    const result = await pool.query(query, [parseInt(months)]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get monthly comparison error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy so sánh theo tháng', error: error.message });
  }
};
