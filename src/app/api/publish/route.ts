import { NextRequest, NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  // Auth check - must have valid admin token
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "mv-admin-2025";
  if (!token || token !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { submissionId, doi, volume, issue, pageStart, pageEnd } = body;

    if (!submissionId) {
      return NextResponse.json({ error: 'submissionId is required' }, { status: 400 });
    }

    await initDb();

    // Get submission details
    const rows = await sql`SELECT * FROM submissions WHERE submission_id = ${submissionId}`;
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const sub = rows[0];

    // Insert into articles table
    await sql`
      INSERT INTO articles (submission_id, title, authors, abstract, specialty, manuscript_type, doi, volume, issue, page_start, page_end)
      VALUES (${submissionId}, ${sub.title}, ${sub.author_name}, ${sub.abstract}, ${sub.specialty}, ${sub.manuscript_type}, ${doi || null}, ${volume || null}, ${issue || null}, ${pageStart || null}, ${pageEnd || null})
    `;

    // Update submission status to published
    await sql`UPDATE submissions SET status = 'published', updated_at = NOW() WHERE submission_id = ${submissionId}`;

    return NextResponse.json({ success: true, message: 'Article published successfully' });

  } catch (err) {
    console.error('Publish error:', err);
    return NextResponse.json({ error: 'Failed to publish article' }, { status: 500 });
  }
}
