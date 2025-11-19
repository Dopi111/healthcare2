import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration(migrationFile) {
  try {
    const migrationPath = path.join(__dirname, '..', 'src', 'migrations', migrationFile);
    console.log(`📄 Reading migration file: ${migrationFile}`);

    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log(`🔄 Running migration: ${migrationFile}`);
    await pool.query(sql);

    console.log(`✅ Migration completed successfully: ${migrationFile}`);
  } catch (error) {
    console.error(`❌ Error running migration ${migrationFile}:`, error.message);
    throw error;
  }
}

async function main() {
  const migrationFile = process.argv[2];

  if (!migrationFile) {
    console.error('❌ Please specify a migration file');
    console.log('Usage: node scripts/run-migration.js <migration-file>');
    console.log('Example: node scripts/run-migration.js 006_add_employee_fields.sql');
    process.exit(1);
  }

  try {
    await runMigration(migrationFile);
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

main();
