import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'healthcare_db',
  password: '1231234',
  port: 5433,
});

console.log('🔍 Testing connection...');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connection FAILED:');
    console.error('Error:', err.message);
    console.error('\n💡 Possible solutions:');
    console.error('1. Check if PostgreSQL is running');
    console.error('2. Verify password is correct: 1231234');
    console.error('3. Verify port is correct: 5433');
    console.error('4. Check if database "healthcare_db" exists');
  } else {
    console.log('✅ Connection SUCCESSFUL!');
    console.log('⏰ Server time:', res.rows[0].now);
  }
  pool.end();
});