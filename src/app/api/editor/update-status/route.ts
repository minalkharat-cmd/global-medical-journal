import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'mv-admin-2025';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${ADMIN_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const client = await pool.connect();
  try {
    const body = await req.json();
    const { submission_id, status, assigned_reviewer, editor_notes } = body;
    if (!submission_id || !status) {
      return NextResponse.json({ error: 'submission_id and status required' }, { status: 400 });
    }
    const valid = ['pending', 'screening', 'under_review', 'accepted', 'rejected', 'revision_requested', 'published'];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${valid.join(', ')}` }, { status: 400 });
    }

    const setClauses: string[] = ['status = $2'];
    const params: (string | null)[] = [submission_id, status];
    let idx = 3;

    if (assigned_reviewer !== undefined) {
      setClauses.push(`assigned_reviewer = $${idx++}`);
      params.push(assigned_reviewer);
    }
    if (editor_notes !== undefined) {
      try { await client.query(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS editor_notes TEXT`); } catch {}
      setClauses.push(`editor_notes = $${idx++}`);
      params.push(editor_notes);
    }

    await client.query(
      `UPDATE submissions SET ${setClauses.join(', ')} WHERE submission_id = $1`,
      params
    );

    return NextResponse.json({ success: true, message: `Status updated to ${status}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  } finally {
    client.release();
  }
}
