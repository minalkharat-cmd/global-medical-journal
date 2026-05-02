import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const client = await pool.connect();
try {
  // Show current state
  const before = await client.query('SELECT COUNT(*) as total FROM articles');
  const subsBefore = await client.query("SELECT COUNT(*) as total FROM submissions WHERE title LIKE '%DROP TABLE%' OR title LIKE '%script%' OR title LIKE '%xss%' OR title LIKE '%LIVE-TEST%'");
  console.log('Articles before cleanup:', before.rows[0].total);
  console.log('Test/malicious submissions before cleanup:', subsBefore.rows[0].total);

  // FIX: Delete duplicate articles (keep only id=1 which is the real editorial, delete 2,3,4 duplicates)
  const dupArticles = await client.query(`
    DELETE FROM articles 
    WHERE id NOT IN (
      SELECT MIN(id) FROM articles GROUP BY submission_id
    )
    RETURNING id, title
  `);
  console.log('Deleted duplicate articles:', dupArticles.rowCount, dupArticles.rows.map(r => r.id));

  // FIX: Delete test/malicious submissions (SQL injection + XSS test entries + LIVE-TEST entries)
  const delSubs = await client.query(`
    DELETE FROM submissions
    WHERE title LIKE '%DROP TABLE%'
       OR title LIKE '%<script>%'
       OR title LIKE '%xss%'
       OR title LIKE 'LIVE-TEST%'
       OR title = '; DROP TABLE; --'
    RETURNING submission_id, title
  `);
  console.log('Deleted test/malicious submissions:', delSubs.rowCount);
  delSubs.rows.forEach(r => console.log('  -', r.submission_id, '|', r.title));

  // FIX: Delete test articles whose source submission was deleted
  const orphanArticles = await client.query(`
    DELETE FROM articles
    WHERE submission_id NOT IN (SELECT submission_id FROM submissions)
    RETURNING id, title
  `);
  console.log('Deleted orphaned articles:', orphanArticles.rowCount);

  const after = await client.query('SELECT COUNT(*) as total FROM articles');
  const subsAfter = await client.query('SELECT COUNT(*) as total FROM submissions');
  console.log('\nAfter cleanup:');
  console.log('  Articles:', after.rows[0].total);
  console.log('  Submissions:', subsAfter.rows[0].total);

  const remaining = await client.query('SELECT id, submission_id, title FROM articles ORDER BY id');
  console.log('\nRemaining articles:');
  remaining.rows.forEach(r => console.log('  id=' + r.id, r.submission_id, '|', r.title));
} finally {
  client.release();
  await pool.end();
}
