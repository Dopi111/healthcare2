-- ============================================
-- PERFORMANCE OPTIMIZATION MIGRATION
-- Author: Healthcare Management System
-- Date: 2025-11-19
-- Description: Add indexes and optimize queries for better performance
-- ============================================

\echo '============================================'
\echo 'PERFORMANCE OPTIMIZATION - Starting...'
\echo '============================================'
\echo ''

-- ============================================
-- STEP 1: Add Search Indexes
-- ============================================
\echo 'Step 1: Creating search indexes...'

-- Full-text search indexes for patients table
CREATE INDEX IF NOT EXISTS idx_patients_code_search ON patients (patient_code);
CREATE INDEX IF NOT EXISTS idx_patients_diagnosis_search ON patients USING gin(to_tsvector('english', COALESCE(diagnosis, '')));
CREATE INDEX IF NOT EXISTS idx_patients_notes_search ON patients USING gin(to_tsvector('english', COALESCE(notes, '')));
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_doctor ON patients(doctor_in_charge);
CREATE INDEX IF NOT EXISTS idx_patients_visit_date ON patients(visit_date DESC);

-- Full-text search for infor_users
CREATE INDEX IF NOT EXISTS idx_users_fullname_search ON infor_users USING gin(to_tsvector('english', COALESCE(full_name, '')));
CREATE INDEX IF NOT EXISTS idx_users_phone_search ON infor_users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_card_search ON infor_users(card_id);

-- Appointments search indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient_name ON appointments(patient_name);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_phone ON appointments(patient_phone);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(appointment_date DESC, appointment_time DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_name);

-- Laboratory tests search indexes
CREATE INDEX IF NOT EXISTS idx_lab_tests_code ON laboratory_tests(test_code);
CREATE INDEX IF NOT EXISTS idx_lab_tests_patient_code ON laboratory_tests(patient_code);
CREATE INDEX IF NOT EXISTS idx_lab_tests_patient_name ON laboratory_tests(patient_name);
CREATE INDEX IF NOT EXISTS idx_lab_tests_status ON laboratory_tests(status);
CREATE INDEX IF NOT EXISTS idx_lab_tests_priority ON laboratory_tests(priority);
CREATE INDEX IF NOT EXISTS idx_lab_tests_sample_id ON laboratory_tests(sample_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_received_date ON laboratory_tests(received_date DESC);

-- Test results search indexes
CREATE INDEX IF NOT EXISTS idx_test_results_code ON test_results(test_code);
CREATE INDEX IF NOT EXISTS idx_test_results_patient_code ON test_results(patient_code);
CREATE INDEX IF NOT EXISTS idx_test_results_status ON test_results(status);
CREATE INDEX IF NOT EXISTS idx_test_results_order_date ON test_results(order_date DESC);

-- Expenses indexes
CREATE INDEX IF NOT EXISTS idx_expenses_code ON expenses(expense_code);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_department ON expenses(department);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);

-- Funds indexes
CREATE INDEX IF NOT EXISTS idx_funds_code ON funds(transaction_code);
CREATE INDEX IF NOT EXISTS idx_funds_type ON funds(type);
CREATE INDEX IF NOT EXISTS idx_funds_category ON funds(category);
CREATE INDEX IF NOT EXISTS idx_funds_date ON funds(date DESC);

-- Insurance claims indexes
CREATE INDEX IF NOT EXISTS idx_insurance_claim_code ON insurance_claims(claim_code);
CREATE INDEX IF NOT EXISTS idx_insurance_patient_code ON insurance_claims(patient_code);
CREATE INDEX IF NOT EXISTS idx_insurance_patient_name ON insurance_claims(patient_name);
CREATE INDEX IF NOT EXISTS idx_insurance_status ON insurance_claims(status);
CREATE INDEX IF NOT EXISTS idx_insurance_type ON insurance_claims(insurance_type);
CREATE INDEX IF NOT EXISTS idx_insurance_visit_date ON insurance_claims(visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_insurance_patient_id ON insurance_claims(patient_id);

-- Revenue indexes
CREATE INDEX IF NOT EXISTS idx_revenue_date ON revenue(date DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_month ON revenue(month);
CREATE INDEX IF NOT EXISTS idx_revenue_category ON revenue(category);

-- Lab results indexes
CREATE INDEX IF NOT EXISTS idx_lab_results_user ON lab_results(infor_users_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_test_date ON lab_results(test_date DESC);
CREATE INDEX IF NOT EXISTS idx_lab_results_status ON lab_results(status);

\echo 'Search indexes created successfully.'
\echo ''

-- ============================================
-- STEP 2: Add Composite Indexes for Common Queries
-- ============================================
\echo 'Step 2: Creating composite indexes...'

-- Composite index for patient + user joins
CREATE INDEX IF NOT EXISTS idx_patients_user_composite ON patients(infor_users_id, status, visit_date DESC);

-- Composite index for appointments + user joins
CREATE INDEX IF NOT EXISTS idx_appointments_user_status ON appointments(infor_users_id, status, appointment_date DESC);

-- Composite index for lab tests patient lookup
CREATE INDEX IF NOT EXISTS idx_lab_tests_patient_status ON laboratory_tests(patient_id, status, received_date DESC);

-- Composite index for insurance patient lookup
CREATE INDEX IF NOT EXISTS idx_insurance_patient_status ON insurance_claims(patient_id, status, visit_date DESC);

-- Composite index for expenses filtering
CREATE INDEX IF NOT EXISTS idx_expenses_status_date ON expenses(status, date DESC);

-- Composite index for funds filtering
CREATE INDEX IF NOT EXISTS idx_funds_type_date ON funds(type, date DESC);

\echo 'Composite indexes created successfully.'
\echo ''

-- ============================================
-- STEP 3: Add Partial Indexes for Filtered Queries
-- ============================================
\echo 'Step 3: Creating partial indexes...'

-- Partial indexes for active/pending records only (smaller, faster)
CREATE INDEX IF NOT EXISTS idx_patients_active ON patients(patient_id, visit_date DESC) WHERE status = 'Đang điều trị';
CREATE INDEX IF NOT EXISTS idx_appointments_pending ON appointments(appointment_id, appointment_date) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_expenses_pending ON expenses(expense_id, date) WHERE status = 'Chờ duyệt';
CREATE INDEX IF NOT EXISTS idx_insurance_pending ON insurance_claims(insurance_id, visit_date) WHERE status = 'Chờ duyệt';
CREATE INDEX IF NOT EXISTS idx_lab_tests_pending ON laboratory_tests(lab_test_id, received_date) WHERE status = 'Chờ xử lý';

\echo 'Partial indexes created successfully.'
\echo ''

-- ============================================
-- STEP 4: Add Indexes for Foreign Key Performance
-- ============================================
\echo 'Step 4: Optimizing foreign key indexes...'

-- These might already exist, but ensure they're there
CREATE INDEX IF NOT EXISTS idx_patients_infor_users_fk ON patients(infor_users_id);
CREATE INDEX IF NOT EXISTS idx_appointments_infor_users_fk ON appointments(infor_users_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_infor_users_fk ON lab_results(infor_users_id);
CREATE INDEX IF NOT EXISTS idx_user_medical_info_users_fk ON user_medical_info(infor_users_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_patient_fk ON laboratory_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_test_results_patient_fk ON test_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_patient_fk ON insurance_claims(patient_id);

\echo 'Foreign key indexes optimized.'
\echo ''

-- ============================================
-- STEP 5: Create Materialized View for Statistics
-- ============================================
\echo 'Step 5: Creating materialized views for statistics...'

-- Statistics view for expenses (faster aggregation)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_expense_statistics AS
SELECT
  COUNT(*) as total_count,
  COALESCE(SUM(amount), 0) as total_amount,
  COALESCE(SUM(CASE WHEN status = 'Đã chi' THEN amount ELSE 0 END), 0) as paid_amount,
  COALESCE(SUM(CASE WHEN status = 'Chờ duyệt' THEN amount ELSE 0 END), 0) as pending_amount,
  COUNT(CASE WHEN status = 'Đã chi' THEN 1 END) as paid_count,
  COUNT(CASE WHEN status = 'Chờ duyệt' THEN 1 END) as pending_count
FROM expenses;

-- Statistics view for funds
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_fund_statistics AS
SELECT
  COUNT(*) as transaction_count,
  COALESCE(SUM(CASE WHEN type = 'Thu' THEN amount ELSE 0 END), 0) as total_income,
  COALESCE(SUM(CASE WHEN type = 'Chi' THEN amount ELSE 0 END), 0) as total_expense,
  COALESCE(SUM(CASE WHEN type = 'Thu' THEN amount ELSE -amount END), 0) as balance
FROM funds;

-- Statistics view for insurance
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_insurance_statistics AS
SELECT
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'Đã duyệt' THEN 1 END) as approved,
  COUNT(CASE WHEN status = 'Chờ duyệt' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'Từ chối' THEN 1 END) as rejected,
  COALESCE(SUM(total_amount), 0) as total_amount,
  COALESCE(SUM(insurance_covered), 0) as insurance_covered,
  COALESCE(SUM(patient_pay), 0) as patient_pay
FROM insurance_claims;

-- Statistics view for lab tests
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_lab_test_statistics AS
SELECT
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'Chờ xử lý' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'Đang xét nghiệm' THEN 1 END) as in_progress,
  COUNT(CASE WHEN status = 'Hoàn thành' THEN 1 END) as completed,
  COUNT(CASE WHEN priority = 'Cấp tốc' THEN 1 END) as urgent,
  COUNT(CASE WHEN priority = 'Khẩn cấp' THEN 1 END) as emergency
FROM laboratory_tests;

-- Statistics view for revenue
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_revenue_statistics AS
SELECT
  COUNT(*) as total_records,
  COALESCE(SUM(patient_count), 0) as total_patients,
  COALESCE(SUM(revenue_amount), 0) as total_revenue,
  COALESCE(AVG(CASE WHEN patient_count > 0 THEN revenue_amount / patient_count END), 0) as avg_revenue_per_patient
FROM revenue;

\echo 'Materialized views created successfully.'
\echo ''

-- ============================================
-- STEP 6: Create Function to Refresh Statistics
-- ============================================
\echo 'Step 6: Creating refresh function...'

CREATE OR REPLACE FUNCTION refresh_all_statistics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW mv_expense_statistics;
  REFRESH MATERIALIZED VIEW mv_fund_statistics;
  REFRESH MATERIALIZED VIEW mv_insurance_statistics;
  REFRESH MATERIALIZED VIEW mv_lab_test_statistics;
  REFRESH MATERIALIZED VIEW mv_revenue_statistics;
  RAISE NOTICE 'All statistics materialized views refreshed successfully';
END;
$$ LANGUAGE plpgsql;

\echo 'Refresh function created successfully.'
\echo ''

-- ============================================
-- STEP 7: Analyze Tables for Query Planner
-- ============================================
\echo 'Step 7: Analyzing tables for query optimization...'

ANALYZE infor_users;
ANALYZE infor_employee;
ANALYZE list_department;
ANALYZE list_position;
ANALYZE patients;
ANALYZE appointments;
ANALYZE expenses;
ANALYZE funds;
ANALYZE insurance_claims;
ANALYZE revenue;
ANALYZE laboratory_tests;
ANALYZE test_results;
ANALYZE lab_results;

\echo 'Table analysis completed.'
\echo ''

-- ============================================
-- FINAL VERIFICATION
-- ============================================
\echo '============================================'
\echo 'PERFORMANCE OPTIMIZATION COMPLETED'
\echo '============================================'
\echo ''
\echo 'Created indexes:'
SELECT COUNT(*) as index_count FROM pg_indexes WHERE schemaname = 'public';

\echo ''
\echo 'Created materialized views:'
SELECT COUNT(*) as view_count FROM pg_matviews WHERE schemaname = 'public';

\echo ''
\echo 'To refresh statistics, run: SELECT refresh_all_statistics();'
\echo ''
\echo 'Performance Tips:'
\echo '  1. Run refresh_all_statistics() daily or after bulk data changes'
\echo '  2. Monitor query performance with EXPLAIN ANALYZE'
\echo '  3. Rebuild indexes monthly with REINDEX'
\echo '============================================'
