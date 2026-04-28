import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();

    const articles = await sql`
      SELECT id, submission_id, title, authors, abstract, specialty,
             manuscript_type, doi, published_at, volume, issue, page_start, page_end
      FROM articles
      ORDER BY published_at DESC
    `;

    return NextResponse.json({
      articles: articles.map(a => ({
        id: a.id,
        submissionId: a.submission_id,
        title: a.title,
        authors: a.authors,
        abstract: a.abstract,
        specialty: a.specialty,
        type: a.manuscript_type,
        doi: a.doi,
        publishedAt: a.published_at,
        volume: a.volume,
        issue: a.issue,
        pages: a.page_start && a.page_end ? `${a.page_start}-${a.page_end}` : null,
      })),
      total: articles.length,
    });

  } catch (err) {
    console.error('Articles error:', err);
    return NextResponse.json({ success: true, articles: [], total: 0, message: 'No articles published yet' });
  }
}
