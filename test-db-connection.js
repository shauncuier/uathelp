const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:3QL8Q4iXYqXYJQul@db.zpvnmfxoxjfbcjtoehka.supabase.co:5432/postgres'
});

pool.query('SELECT NOW(), version()', (err, res) => {
  if (err) {
    console.log('❌ Database connection FAILED');
    console.log('Error:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Database connection SUCCESS');
    console.log('Current time:', res.rows[0].now);
    console.log('PostgreSQL version:', res.rows[0].version);
    
    // Test if we can see tables
    pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `, (err, res) => {
      if (err) {
        console.log('❌ Failed to fetch tables');
        process.exit(1);
      } else {
        console.log('\n✅ Database tables found:');
        res.rows.forEach(row => console.log('  - ' + row.table_name));
        process.exit(0);
      }
    });
  }
});

pool.on('error', (err) => {
  console.log('❌ Pool error:', err.message);
  process.exit(1);
});

setTimeout(() => {
  console.log('⏱️ Connection timeout');
  process.exit(1);
}, 10000);
