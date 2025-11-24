/**
 * Data Migration Script: V1 Schema → V2 Schema
 *
 * This script migrates data from the old schema to the optimized V2 schema
 *
 * CRITICAL CHANGES:
 * - Merges `accounts` + `infor_users` → `users`
 * - Renames `infor_employee` → `employees`
 * - Updates all foreign key references
 * - Removes duplicate patient data from insurance/lab tables
 *
 * USAGE:
 * 1. Backup your database first!
 * 2. Apply database_schema_v2_optimized.sql in pgAdmin
 * 3. Run: node scripts/migrate-to-v2.js
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'healthcare_db',
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

async function migrateData() {
  const client = await pool.connect();

  try {
    console.log('========================================');
    console.log('🚀 Starting Data Migration to V2 Schema');
    console.log('========================================\n');

    await client.query('BEGIN');

    // Step 1: Check if old tables exist
    console.log('📊 Checking for old schema tables...');
    const oldTablesCheck = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('accounts', 'infor_users', 'infor_employee')
    `);

    if (oldTablesCheck.rows.length === 0) {
      console.log('✅ No old tables found. V2 schema is already in place.');
      console.log('ℹ️  If you have data to migrate, restore from backup first.\n');
      await client.query('COMMIT');
      return;
    }

    console.log(`Found ${oldTablesCheck.rows.length} old tables to migrate\n`);

    // Step 2: Migrate users (merge accounts + infor_users)
    console.log('👥 Migrating users (merging accounts + infor_users)...');

    // First, migrate from infor_users (if exists)
    const inforUsersCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'infor_users'
      )
    `);

    if (inforUsersCheck.rows[0].exists) {
      const inforUsersResult = await client.query(`
        INSERT INTO users (
          phone_number, card_id, password, full_name, date_of_birth,
          gender, email, employee_id, position, department, specialty,
          permanent_address, current_address, role, status, created_at, updated_at
        )
        SELECT
          phone_number, card_id, password, full_name, date_of_birth,
          gender, email, employee_id, position, department, specialty,
          permanent_address, current_address,
          CASE
            WHEN role_user = 'employee' THEN 'employee'
            WHEN role_user = 'users' THEN 'patient'
            ELSE role_user
          END as role,
          'active' as status,
          created_at, updated_at
        FROM infor_users
        ON CONFLICT (phone_number) DO NOTHING
        RETURNING user_id
      `);
      console.log(`✅ Migrated ${inforUsersResult.rowCount} users from infor_users`);
    }

    // Then, migrate from accounts (if not already in users)
    const accountsCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'accounts'
      )
    `);

    if (accountsCheck.rows[0].exists) {
      const accountsResult = await client.query(`
        INSERT INTO users (
          phone_number, card_id, password, full_name, date_of_birth,
          gender, email, employee_id, position, department,
          role, status, created_at, updated_at
        )
        SELECT
          COALESCE(phone, '0' || LPAD(id::text, 9, '0')) as phone_number,
          employee_id as card_id,
          password,
          name as full_name,
          '1990-01-01'::date as date_of_birth,
          'Nam' as gender,
          email,
          employee_id,
          position,
          department,
          CASE
            WHEN role = 'administrator' THEN 'administrator'
            WHEN role = 'staff' THEN 'employee'
            ELSE role
          END as role,
          CASE
            WHEN status = 'active' THEN 'active'
            ELSE 'inactive'
          END as status,
          created_at, updated_at
        FROM accounts
        WHERE employee_id NOT IN (SELECT employee_id FROM users WHERE employee_id IS NOT NULL)
        ON CONFLICT (phone_number) DO NOTHING
        RETURNING user_id
      `);
      console.log(`✅ Migrated ${accountsResult.rowCount} users from accounts`);
    }

    // Step 3: Migrate employees
    console.log('\n💼 Migrating employees (infor_employee → employees)...');

    const inforEmployeeCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'infor_employee'
      )
    `);

    if (inforEmployeeCheck.rows[0].exists) {
      const employeesResult = await client.query(`
        INSERT INTO employees (
          user_id, position_id, department_id, business_description,
          start_date, end_date, salary, coefficient,
          attached_documents, employment_status, created_at, updated_at
        )
        SELECT
          u.user_id,
          ie.position_id,
          ie.department_id,
          ie.business as business_description,
          ie.started_date as start_date,
          NULL as end_date,
          ie.salary,
          ie.coefficient,
          ie.attached as attached_documents,
          CASE
            WHEN ie.status_employee = 'active' THEN 'active'
            ELSE 'inactive'
          END as employment_status,
          ie.created_at, ie.updated_at
        FROM infor_employee ie
        JOIN users u ON u.user_id = ie.infor_users_id
        ON CONFLICT (user_id) DO NOTHING
        RETURNING employee_id
      `);
      console.log(`✅ Migrated ${employeesResult.rowCount} employee records`);
    }

    // Step 4: Update patient records to use new user_id
    console.log('\n🏥 Updating patient records with new user_id references...');
    const patientsUpdate = await client.query(`
      UPDATE patients p
      SET user_id = (
        SELECT u.user_id
        FROM users u
        WHERE u.phone_number = p.patient_code
        OR u.card_id = p.patient_code
        LIMIT 1
      )
      WHERE user_id IS NULL
    `);
    console.log(`✅ Updated ${patientsUpdate.rowCount} patient records`);

    // Step 5: Show migration summary
    console.log('\n========================================');
    console.log('✅ MIGRATION COMPLETE!');
    console.log('========================================\n');

    const summary = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE role IN ('employee', 'administrator', 'doctor', 'nurse', 'receptionist', 'accountant', 'technician')) as employees,
        (SELECT COUNT(*) FROM users WHERE role = 'patient') as patients,
        (SELECT COUNT(*) FROM employees) as employee_records,
        (SELECT COUNT(*) FROM patients) as patient_records,
        (SELECT COUNT(*) FROM appointments) as appointments,
        (SELECT COUNT(*) FROM laboratory_tests) as lab_tests,
        (SELECT COUNT(*) FROM insurance_claims) as insurance_claims
    `);

    const stats = summary.rows[0];
    console.log('📊 Migration Summary:');
    console.log(`  - Total Users: ${stats.total_users}`);
    console.log(`  - Employees: ${stats.employees}`);
    console.log(`  - Patients: ${stats.patients}`);
    console.log(`  - Employee Records: ${stats.employee_records}`);
    console.log(`  - Patient Records: ${stats.patient_records}`);
    console.log(`  - Appointments: ${stats.appointments}`);
    console.log(`  - Lab Tests: ${stats.lab_tests}`);
    console.log(`  - Insurance Claims: ${stats.insurance_claims}`);
    console.log('\n📝 Next Steps:');
    console.log('  1. Review migrated data');
    console.log('  2. Test all API endpoints');
    console.log('  3. Drop old tables if migration successful:');
    console.log('     DROP TABLE IF EXISTS accounts CASCADE;');
    console.log('     DROP TABLE IF EXISTS infor_auth_employee CASCADE;');
    console.log('     DROP TABLE IF EXISTS infor_employee CASCADE;');
    console.log('     DROP TABLE IF EXISTS infor_users CASCADE;');
    console.log('========================================\n');

    await client.query('COMMIT');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Migration failed!');
    console.error('Error:', error.message);
    console.error('\nAll changes have been rolled back.');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrateData()
  .then(() => {
    console.log('✅ Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error);
    process.exit(1);
  });
