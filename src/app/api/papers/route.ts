import { NextRequest, NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    await initDb();

    const rows = status
      ? await sql`SELECT * FROM submissions WHERE status = ${status} ORDER BY created_at DESC`
      : await sql`SELECT * FROM submissions ORDER BY created_at DESC`;

    return NextResponse.json({
      papers: rows.map(r => ({
        submissionId: r.submission_id,
        authorName: r.author_name,
        authorEmail: r.author_email,
        institution: r.institution,
        country: r.country,
        title: r.title,
        manuscriptType: r.manuscript_type,
        specialty: r.specialty,
        wordCount: r.word_count,
        abstract: r.abstract,
        keywords: r.keywords,
        status: r.status,
        editorNote: r.editor_note,
        aiDecision: r.ai_decision,
        submittedAt: r.created_at,
        updatedAt: r.updated_at,
      })),
      total: rows.length,
    });

  } catch (err) {
    console.error('Papers error:', err);
    return NextResponse.json({ papers: [], total: 0, error: 'Database unavailable' });
  }
}
