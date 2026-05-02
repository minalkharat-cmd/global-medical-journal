import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'mv-admin-2025';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${ADMIN_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { submission_id, status, assigned_reviewer, editor_notes } = await req.json();
    if (!submission_id || !status) {
      return NextResponse.json({ error: 'submission_id and status required' }, { status: 400 });
    }
    const valid = ['pending', 'screening', 'under_review', 'accepted', 'rejected', 'revision_requested', 'published'];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${valid.join(', ')}` }, { status: 400 });
    }

    const setClauses = ['status = $2'];
    const params: (string | null)[] = [submission_id, status];
    let idx = 3;

    if (assigned_reviewer !== undefined) {
      setClauses.push(`assigned_reviewer = $${idx++}`);
      params.push(assigned_reviewer);
    }
    if (editor_notes !== undefined) {
      // ensure column exists
      try { await query(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS editor_notes TEXT`); } catch {}
      setClauses.push(`editor_notes = $${idx++}`);
      params.push(editor_notes);
    }

    await query(
      `UPDATE submissions SET ${setClauses.join(', ')} WHERE submission_id = $1`,
      params
    );

    return NextResponse.json({ success: true, message: `Status updated to ${status}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
