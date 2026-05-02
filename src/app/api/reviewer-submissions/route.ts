import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const REVIEWER_LIST = process.env.REVIEWER_LIST || '';

function getReviewer(token: string) {
  const reviewers = REVIEWER_LIST.split(',').map(r => {
    const parts = r.trim().split(':');
    return { name: parts[0], email: parts[1], token: parts[2] };
  });
  return reviewers.find(r => r.token === token);
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const reviewer = getReviewer(token);
  if (!reviewer) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = await pool.connect();
  try {
    let result;
    try {
      result = await client.query(
        `SELECT s.id, s.submission_id, s.title, s.authors, s.abstract, s.specialty, s.manuscript_type, s.status, s.submitted_at,
                r.id as review_id, r.recommendation, r.comments, r.submitted_at as review_date
         FROM submissions s
         LEFT JOIN reviews r ON r.submission_id = s.submission_id AND r.reviewer_email = $1
         WHERE s.assigned_reviewer = $2 OR s.assigned_reviewer = $3
         ORDER BY s.submitted_at DESC`,
        [reviewer.email, reviewer.email, reviewer.name]
      );
    } catch {
      result = await client.query(
        `SELECT id, submission_id, title, authors, abstract, specialty, manuscript_type, status, submitted_at
         FROM submissions WHERE assigned_reviewer = $1 OR assigned_reviewer = $2 ORDER BY submitted_at DESC`,
        [reviewer.email, reviewer.name]
      );
    }
    return NextResponse.json({ submissions: result.rows, reviewer: { name: reviewer.name, email: reviewer.email } });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  } finally {
    client.release();
  }
}
