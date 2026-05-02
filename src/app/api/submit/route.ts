import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, authors, abstract, specialty, manuscript_type, author_email, keywords, cover_letter } = body;

    if (!title || !authors || !abstract || !specialty || !manuscript_type) {
      return NextResponse.json({ error: 'Missing required fields: title, authors, abstract, specialty, manuscript_type' }, { status: 400 });
    }

    const submission_id = `MV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Ensure optional columns exist
    try {
      await query(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS author_email VARCHAR(255)`);
      await query(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS keywords TEXT`);
      await query(`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS cover_letter TEXT`);
    } catch {}

    await query(
      `INSERT INTO submissions (submission_id, title, authors, abstract, specialty, manuscript_type, author_email, keywords, cover_letter, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', NOW())`,
      [submission_id, title.trim(), authors.trim(), abstract.trim(), specialty, manuscript_type, author_email || null, keywords || null, cover_letter || null]
    );

    return NextResponse.json({ success: true, submission_id, message: 'Manuscript submitted successfully' });
  } catch (e) {
    console.error('Submit error:', e);
    return NextResponse.json({ error: 'Failed to submit manuscript. Please try again.' }, { status: 500 });
  }
}
