/**
 * Revenue Controller
 * Handles all revenue operations (replacing RevenueService localStorage)
 */

import pool from '../config/db.js';

export const getAllRevenue = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM revenue ORDER BY date DESC, created_at DESC');
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get all revenue error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách doanh thu', error: error.message });
  }
};

export const getRevenueByMonth = async (req, res) => {
  try {
    const { month } = req.params; // Format: YYYY-MM
    const result = await pool.query('SELECT * FROM revenue WHERE month = $1 ORDER BY date DESC', [month]);
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
    const { date, category, patient_count, revenue_amount, month } = req.body;

    if (!date || !category || !revenue_amount || !month) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const insertQuery = `INSERT INTO revenue (date, category, patient_count, revenue_amount, month)
                         VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await client.query(insertQuery, [date, category, patient_count || 0, revenue_amount, month]);

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
    const { date, category, patient_count, revenue_amount, month } = req.body;

    const checkRevenue = await client.query('SELECT revenue_id FROM revenue WHERE revenue_id = $1', [id]);
    if (checkRevenue.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Không tìm thấy doanh thu' });
    }

    const updateQuery = `UPDATE revenue SET date = COALESCE($1, date), category = COALESCE($2, category),
                         patient_count = COALESCE($3, patient_count), revenue_amount = COALESCE($4, revenue_amount),
                         month = COALESCE($5, month) WHERE revenue_id = $6 RETURNING *`;
    const result = await client.query(updateQuery, [date, category, patient_count, revenue_amount, month, id]);

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
    const statsQuery = `SELECT COUNT(*) as total_records, SUM(patient_count) as total_patients,
                        SUM(revenue_amount) as total_revenue,
                        AVG(CASE WHEN patient_count > 0 THEN revenue_amount / patient_count END) as avg_revenue_per_patient
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
    const query = `SELECT month, SUM(patient_count) as patients, SUM(revenue_amount) as revenue
                   FROM revenue GROUP BY month ORDER BY month DESC LIMIT $1`;
    const result = await pool.query(query, [parseInt(months)]);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    console.error('Get monthly comparison error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy so sánh theo tháng', error: error.message });
  }
};
