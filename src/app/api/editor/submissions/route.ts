import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'mv-admin-2025';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${ADMIN_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const client = await pool.connect();
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || '';
    const specialty = url.searchParams.get('specialty') || '';
    const search = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: (string | number)[] = [];
    let idx = 1;
    if (status) { conditions.push(`s.status = $${idx++}`); params.push(status); }
    if (specialty) { conditions.push(`s.specialty = $${idx++}`); params.push(specialty); }
    if (search) { conditions.push(`(s.title ILIKE $${idx} OR s.authors ILIKE $${idx} OR s.submission_id ILIKE $${idx})`); params.push(`%${search}%`); idx++; }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await client.query(`SELECT COUNT(*) FROM submissions s ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    let reviewJoin = '';
    try {
      reviewJoin = `(SELECT COUNT(*) FROM reviews r WHERE r.submission_id = s.submission_id) as review_count,
       (SELECT STRING_AGG(r.recommendation, ', ') FROM reviews r WHERE r.submission_id = s.submission_id) as recommendations,`;
    } catch { reviewJoin = ''; }

    const result = await client.query(
      `SELECT s.*, ${reviewJoin} s.id as _id FROM submissions s ${where} ORDER BY s.submitted_at DESC LIMIT $${idx} OFFSET $${idx+1}`,
      [...params, limit, offset]
    );

    return NextResponse.json({ submissions: result.rows, total, page, pages: Math.ceil(total / limit) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  } finally {
    client.release();
  }
}
