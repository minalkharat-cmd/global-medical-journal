import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "mv-admin-2025";
  if (!token || token !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, string> = {};
  try {
    body = await request.json();
  } catch (_) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { submissionId, volume, issue, pageStart, pageEnd, doi } = body;
  if (!submissionId) {
    return NextResponse.json({ error: "submissionId is required" }, { status: 400 });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    // Get the submission
    const selectSQL = "SELECT * FROM submissions WHERE submission_id = $1";
    const result = await client.query(selectSQL, [submissionId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const sub = result.rows[0];

    // Update status to published
    const updateSQL = "UPDATE submissions SET status = $1, updated_at = NOW() WHERE submission_id = $2";
    await client.query(updateSQL, ["published", submissionId]);

    // Try to insert into articles/papers table (if it exists)
    try {
      const checkTableSQL = "SELECT to_regclass('public.articles') as exists";
      const tableCheck = await client.query(checkTableSQL);
      if (tableCheck.rows[0].exists) {
        const insertArticleSQL = "INSERT INTO articles (submission_id, title, abstract, authors, specialty, status, published_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) ON CONFLICT (submission_id) DO UPDATE SET status = $6, published_at = NOW()";
        await client.query(insertArticleSQL, [
          submissionId,
          sub.title || "",
          sub.abstract || "",
          sub.authors || "",
          sub.specialty || "",
          "published",
        ]);
      }
    } catch (_) {
      // articles table may not exist, that is ok
    }

    return NextResponse.json({
      success: true,
      message: "Article published successfully",
      submissionId,
      title: sub.title,
    });
  } catch (err) {
    console.error("Publish error:", err);
    return NextResponse.json({ error: "Failed to publish article" }, { status: 500 });
  } finally {
    client.release();
    await pool.end();
  }
}
