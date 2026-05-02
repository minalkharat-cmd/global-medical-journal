import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const REVIEWER_LIST = process.env.REVIEWER_LIST || '';

function getReviewer(token: string) {
  const reviewers = REVIEWER_LIST.split(',').map(r => {
    const parts = r.trim().split(':');
    return { name: parts[0], email: parts[1], token: parts[2] };
  });
  return reviewers.find(r => r.token === token);
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const reviewer = getReviewer(token);
  if (!reviewer) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { submission_id, recommendation, comments, score } = await req.json();
    if (!submission_id || !recommendation || !comments) {
      return NextResponse.json({ error: 'submission_id, recommendation, and comments are required' }, { status: 400 });
    }

    // Ensure reviews table exists
    await query(`CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      submission_id VARCHAR(255) NOT NULL,
      reviewer_email VARCHAR(255) NOT NULL,
      reviewer_name VARCHAR(255),
      recommendation VARCHAR(50) NOT NULL,
      comments TEXT NOT NULL,
      score INTEGER,
      submitted_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(submission_id, reviewer_email)
    )`);

    await query(
      `INSERT INTO reviews (submission_id, reviewer_email, reviewer_name, recommendation, comments, score)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (submission_id, reviewer_email) DO UPDATE SET
         recommendation = EXCLUDED.recommendation,
         comments = EXCLUDED.comments,
         score = EXCLUDED.score,
         submitted_at = NOW()`,
      [submission_id, reviewer.email, reviewer.name, recommendation, comments, score || null]
    );

    // Update submission status to under_review if it was pending
    await query(
      `UPDATE submissions SET status = 'under_review' WHERE submission_id = $1 AND status = 'pending'`,
      [submission_id]
    );

    return NextResponse.json({ success: true, message: 'Review submitted successfully' });
  } catch (e) {
    console.error('Review submit error:', e);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
