import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token !== "mv-admin-2025") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    let total = 0, pending = 0, underReview = 0, accepted = 0, rejected = 0, published = 0;
    try {
      const totalResult = await client.query("SELECT COUNT(*) as count FROM submissions");
      total = parseInt(totalResult.rows[0].count) || 0;
      const pendingResult = await client.query("SELECT COUNT(*) as count FROM submissions WHERE status = $1", ["pending"]);
      pending = parseInt(pendingResult.rows[0].count) || 0;
      const reviewResult = await client.query("SELECT COUNT(*) as count FROM submissions WHERE status = $1", ["under_review"]);
      underReview = parseInt(reviewResult.rows[0].count) || 0;
      const acceptedResult = await client.query("SELECT COUNT(*) as count FROM submissions WHERE status = $1", ["accepted"]);
      accepted = parseInt(acceptedResult.rows[0].count) || 0;
      const rejectedResult = await client.query("SELECT COUNT(*) as count FROM submissions WHERE status = $1", ["rejected"]);
      rejected = parseInt(rejectedResult.rows[0].count) || 0;
      const publishedResult = await client.query("SELECT COUNT(*) as count FROM submissions WHERE status = $1", ["published"]);
      published = parseInt(publishedResult.rows[0].count) || 0;
    } catch (_) {
      // Table may not exist yet
    }

    return NextResponse.json({
      success: true,
      stats: {
        total,
        pending,
        underReview,
        accepted,
        rejected,
        published,
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Failed to retrieve stats" }, { status: 500 });
  } finally {
    client.release();
    await pool.end();
  }
}
