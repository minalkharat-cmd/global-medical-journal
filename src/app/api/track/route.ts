import { NextRequest, NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Submission ID is required. Use ?id=MV-YYYYMM-XXXXXX' }, { status: 400 });
  }

  const idPattern = /^MV-\d{6}-[A-Z0-9]{6}$/;
  if (!idPattern.test(id)) {
    return NextResponse.json({
      error: 'Invalid submission ID format',
      hint: 'Submission IDs follow the format: MV-YYYYMM-XXXXXX (e.g., MV-202601-ABC123)',
    }, { status: 404 });
  }

  try {
    await initDb();
    const rows = await sql`
      SELECT submission_id, author_name, title, status, editor_note, created_at, updated_at
      FROM submissions
      WHERE submission_id = ${id}
    `;

    if (rows.length === 0) {
      return NextResponse.json({
        error: 'Submission not found',
        submissionId: id,
        hint: 'Please verify your submission ID. If you submitted recently, it may take a few minutes to appear.',
      }, { status: 404 });
    }

    const row = rows[0];
    const statusLabels: Record<string, string> = {
      received: 'Received — Awaiting Initial Review',
      screening: 'Under Editorial Screening',
      peer_review: 'Under Peer Review',
      major_revision: 'Major Revision Required',
      minor_revision: 'Minor Revision Required',
      accepted: 'Accepted for Publication',
      rejected: 'Not Accepted',
      published: 'Published',
    };

    return NextResponse.json({
      found: true,
      submissionId: row.submission_id,
      title: row.title,
      status: row.status,
      statusLabel: statusLabels[row.status] || row.status,
      editorNote: row.editor_note || null,
      submittedAt: row.created_at,
      lastUpdated: row.updated_at,
    });

  } catch (err) {
    console.error('Track error:', err);
    return NextResponse.json({
      error: 'Unable to retrieve status at this time',
      submissionId: id,
      hint: 'Please try again or contact medicalvanguard@zohomail.in',
    }, { status: 500 });
  }
}
