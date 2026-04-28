import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();

    const [totalResult, statusResult, articlesResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM submissions`,
      sql`SELECT status, COUNT(*) as count FROM submissions GROUP BY status`,
      sql`SELECT COUNT(*) as count FROM articles`,
    ]);

    const totalSubmissions = parseInt(String(totalResult[0]?.count || '0'));
    const publishedArticles = parseInt(String(articlesResult[0]?.count || '0'));

    const statusCounts: Record<string, number> = {};
    for (const row of statusResult) {
      statusCounts[String(row.status)] = parseInt(String(row.count));
    }

    const pending = (statusCounts['received'] || 0) + (statusCounts['screening'] || 0);
    const underReview = (statusCounts['peer_review'] || 0) + (statusCounts['major_revision'] || 0) + (statusCounts['minor_revision'] || 0);
    const accepted = statusCounts['accepted'] || 0;
    const rejected = statusCounts['rejected'] || 0;

    return NextResponse.json({
      totalSubmissions,
      pending,
      underReview,
      accepted,
      rejected,
      published: publishedArticles,
      breakdown: statusCounts,
    });

  } catch (err) {
    console.error('Stats error:', err);
    // Return zeros gracefully if DB is unavailable
    return NextResponse.json({
      totalSubmissions: 0,
      pending: 0,
      underReview: 0,
      accepted: 0,
      rejected: 0,
      published: 0,
      breakdown: {},
      error: 'Database temporarily unavailable',
    });
  }
}
