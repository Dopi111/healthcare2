/**
 * Statistics Helper
 * Utilities for using materialized views for faster statistics
 */

import pool from '../config/db.js';

/**
 * Get expense statistics from materialized view
 * Much faster than querying expenses table directly
 * @param {boolean} refresh - Whether to refresh view before reading
 */
export const getExpenseStatistics = async (refresh = false) => {
  try {
    if (refresh) {
      await pool.query('REFRESH MATERIALIZED VIEW mv_expense_statistics');
    }
    const result = await pool.query('SELECT * FROM mv_expense_statistics');
    return {
      success: true,
      data: result.rows[0] || {}
    };
  } catch (error) {
    console.error('Get expense statistics error:', error);
    // Fallback to direct query if materialized view doesn't exist
    const fallbackQuery = `
      SELECT
        COUNT(*) as total_count,
        COALESCE(SUM(amount), 0) as total_amount,
        COALESCE(SUM(CASE WHEN status = 'Đã chi' THEN amount ELSE 0 END), 0) as paid_amount,
        COALESCE(SUM(CASE WHEN status = 'Chờ duyệt' THEN amount ELSE 0 END), 0) as pending_amount,
        COUNT(CASE WHEN status = 'Đã chi' THEN 1 END) as paid_count,
        COUNT(CASE WHEN status = 'Chờ duyệt' THEN 1 END) as pending_count
      FROM expenses
    `;
    const result = await pool.query(fallbackQuery);
    return {
      success: true,
      data: result.rows[0] || {}
    };
  }
};

/**
 * Get fund statistics from materialized view
 */
export const getFundStatistics = async (refresh = false) => {
  try {
    if (refresh) {
      await pool.query('REFRESH MATERIALIZED VIEW mv_fund_statistics');
    }
    const result = await pool.query('SELECT * FROM mv_fund_statistics');
    return {
      success: true,
      data: result.rows[0] || {}
    };
  } catch (error) {
    console.error('Get fund statistics error:', error);
    // Fallback to direct query
    const fallbackQuery = `
      SELECT
        COUNT(*) as transaction_count,
        COALESCE(SUM(CASE WHEN type = 'Thu' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'Chi' THEN amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN type = 'Thu' THEN amount ELSE -amount END), 0) as balance
      FROM funds
    `;
    const result = await pool.query(fallbackQuery);
    return {
      success: true,
      data: result.rows[0] || {}
    };
  }
};

/**
 * Get insurance statistics from materialized view
 */
export const getInsuranceStatistics = async (refresh = false) => {
  try {
    if (refresh) {
      await pool.query('REFRESH MATERIALIZED VIEW mv_insurance_statistics');
    }
    const result = await pool.query('SELECT * FROM mv_insurance_statistics');
    return {
      success: true,
      data: result.rows[0] || {}
    };
  } catch (error) {
    console.error('Get insurance statistics error:', error);
    // Fallback to direct query
    const fallbackQuery = `
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Đã duyệt' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'Chờ duyệt' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'Từ chối' THEN 1 END) as rejected,
        COALESCE(SUM(total_amount), 0) as total_amount,
        COALESCE(SUM(insurance_covered), 0) as insurance_covered,
        COALESCE(SUM(patient_pay), 0) as patient_pay
      FROM insurance_claims
    `;
    const result = await pool.query(fallbackQuery);
    return {
      success: true,
      data: result.rows[0] || {}
    };
  }
};

/**
 * Get laboratory test statistics from materialized view
 */
export const getLabTestStatistics = async (refresh = false) => {
  try {
    if (refresh) {
      await pool.query('REFRESH MATERIALIZED VIEW mv_lab_test_statistics');
    }
    const result = await pool.query('SELECT * FROM mv_lab_test_statistics');
    return {
      success: true,
      data: result.rows[0] || {}
    };
  } catch (error) {
    console.error('Get lab test statistics error:', error);
    // Fallback to direct query
    const fallbackQuery = `
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Chờ xử lý' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'Đang xét nghiệm' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'Hoàn thành' THEN 1 END) as completed,
        COUNT(CASE WHEN priority = 'Cấp tốc' THEN 1 END) as urgent,
        COUNT(CASE WHEN priority = 'Khẩn cấp' THEN 1 END) as emergency
      FROM laboratory_tests
    `;
    const result = await pool.query(fallbackQuery);
    return {
      success: true,
      data: result.rows[0] || {}
    };
  }
};

/**
 * Get revenue statistics from materialized view
 */
export const getRevenueStatistics = async (refresh = false) => {
  try {
    if (refresh) {
      await pool.query('REFRESH MATERIALIZED VIEW mv_revenue_statistics');
    }
    const result = await pool.query('SELECT * FROM mv_revenue_statistics');
    return {
      success: true,
      data: result.rows[0] || {}
    };
  } catch (error) {
    console.error('Get revenue statistics error:', error);
    // Fallback to direct query
    const fallbackQuery = `
      SELECT
        COUNT(*) as total_records,
        COALESCE(SUM(patient_count), 0) as total_patients,
        COALESCE(SUM(revenue_amount), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN patient_count > 0 THEN revenue_amount / patient_count END), 0) as avg_revenue_per_patient
      FROM revenue
    `;
    const result = await pool.query(fallbackQuery);
    return {
      success: true,
      data: result.rows[0] || {}
    };
  }
};

/**
 * Refresh all materialized views
 * Should be called daily or after bulk data changes
 */
export const refreshAllStatistics = async () => {
  try {
    await pool.query('SELECT refresh_all_statistics()');
    return {
      success: true,
      message: 'All statistics refreshed successfully'
    };
  } catch (error) {
    console.error('Refresh all statistics error:', error);
    return {
      success: false,
      message: 'Failed to refresh statistics',
      error: error.message
    };
  }
};

/**
 * Check if materialized views exist
 */
export const checkMaterializedViewsExist = async () => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as view_count
      FROM pg_matviews
      WHERE schemaname = 'public'
        AND matviewname LIKE 'mv_%_statistics'
    `);
    return parseInt(result.rows[0].view_count) === 5;
  } catch (error) {
    console.error('Check materialized views error:', error);
    return false;
  }
};

export default {
  getExpenseStatistics,
  getFundStatistics,
  getInsuranceStatistics,
  getLabTestStatistics,
  getRevenueStatistics,
  refreshAllStatistics,
  checkMaterializedViewsExist
};
