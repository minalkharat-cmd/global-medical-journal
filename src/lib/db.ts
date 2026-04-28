import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Correct tagged template literal implementation
export async function sql(strings: TemplateStringsArray, ...values: unknown[]): Promise<Record<string, unknown>[]> {
  // Build query: interleave strings and $N placeholders
  let text = strings[0];
  const params: unknown[] = [];
  
  for (let i = 0; i < values.length; i++) {
    params.push(values[i]);
    text += `$${params.length}${strings[i + 1]}`;
  }

  const client = await pool.connect();
  try {
    const result = await client.query(text.trim(), params);
    return result.rows as Record<string, unknown>[];
  } finally {
    client.release();
  }
}

export async function initDb(): Promise<boolean> {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        submission_id VARCHAR(20) UNIQUE NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        author_email VARCHAR(255) NOT NULL,
        institution VARCHAR(500),
        country VARCHAR(100),
        co_authors TEXT,
        title TEXT NOT NULL,
        manuscript_type VARCHAR(100),
        specialty VARCHAR(100),
        word_count INTEGER,
        abstract TEXT,
        keywords TEXT,
        status VARCHAR(50) DEFAULT 'received',
        editor_note TEXT,
        ai_decision VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        submission_id VARCHAR(20),
        title TEXT NOT NULL,
        authors TEXT NOT NULL,
        abstract TEXT,
        specialty VARCHAR(100),
        manuscript_type VARCHAR(100),
        doi VARCHAR(255),
        published_at TIMESTAMP DEFAULT NOW(),
        volume INTEGER,
        issue INTEGER,
        page_start INTEGER,
        page_end INTEGER
      )
    `;
    return true;
  } catch (err) {
    console.error('DB init error:', err);
    return false;
  }
}
