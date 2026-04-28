import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Submission ID is required. Use ?id=MV-YYYYMM-XXXXXX" },
      { status: 400 }
    );
  }

  const idPattern = /^MV-\d{6}-[A-Z0-9]{6}$/;
  if (!idPattern.test(id)) {
    return NextResponse.json(
      { error: "Invalid submission ID format", hint: "Submission IDs follow the format: MV-YYYYMM-XXXXXX (e.g., MV-202601-ABC123)" },
      { status: 400 }
    );
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    const selectSQL = "SELECT submission_id, authors, title, status, submitted_at, updated_at FROM submissions WHERE submission_id = $1";
    const result = await client.query(selectSQL, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      success: true,
      submission: {
        submissionId: row.submission_id,
        title: row.title,
        authors: row.authors,
        status: row.status || "pending",
        submittedAt: row.submitted_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json(
      { error: "Unable to retrieve status at this time", submissionId: id },
      { status: 500 }
    );
  } finally {
    client.release();
    await pool.end();
  }
}


export async function POST(request: NextRequest) {
  let body: { id?: string } = {};
  try {
    const text = await request.text();
    if (text) body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const id = body.id;
  if (!id || typeof id !== "string" || id.trim() === "") {
    return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
  }

  const trimmedId = id.trim();
  if (trimmedId.length > 100) {
    return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
  }

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    const selectSQL = "SELECT submission_id, title, authors, status, submitted_at, updated_at FROM submissions WHERE submission_id = $1";
    const result = await client.query(selectSQL, [trimmedId]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      found: true,
      submissionId: row.submission_id,
      title: row.title,
      authors: row.authors,
      status: row.status || "pending",
      submittedAt: row.submitted_at,
      updatedAt: row.updated_at,
    });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json(
      { error: "Unable to retrieve status at this time", submissionId: trimmedId },
      { status: 500 }
    );
  } finally {
    client.release();
    await pool.end();
  }
}
