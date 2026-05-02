import { NextRequest, NextResponse } from 'next/server';
import pg from 'pg';
const { Pool } = pg;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (token !== "mv-admin-2025") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  const url = new URL(request.url);
  const status = url.searchParams.get('status') || '';
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 3,
    connectionTimeoutMillis: 5000,
  });
  let client;
  try {
    client = await pool.connect();
    let queryText: string;
    let queryParams: string[];
    if (status) {
      queryText = 'SELECT submission_id, title, authors, email, institution, manuscript_type, specialty, status, submitted_at, updated_at FROM submissions WHERE status = $1 ORDER BY submitted_at DESC';
      queryParams = [status];
    } else {
      queryText = 'SELECT submission_id, title, authors, email, institution, manuscript_type, specialty, status, submitted_at, updated_at FROM submissions ORDER BY submitted_at DESC';
      queryParams = [];
    }
    const result = await client.query(queryText, queryParams);
    const rows = result.rows;
    return NextResponse.json({
      success: true,
      papers: rows.map((r: Record<string, unknown>) => ({
        submissionId: r.submission_id,
        title: r.title,
        authors: r.authors,
        email: r.email,
        institution: r.institution,
        manuscriptType: r.manuscript_type,
        specialty: r.specialty,
        status: r.status,
        submittedAt: r.submitted_at,
        updatedAt: r.updated_at,
      })),
      total: rows.length,
    });
  } catch (err) {
    console.error('Papers error:', err);
    return NextResponse.json({ success: false, papers: [], total: 0, error: 'Database unavailable' });
  } finally {
    if (client) client.release();
    await pool.end();
  }
}
