import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (token !== "mv-admin-2025") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await pool.connect();
    try {
        const body = await request.json();
        const { submissionId, volume, issue, pageStart, pageEnd, doi } = body;

        if (!submissionId) {
            return NextResponse.json({ error: "submissionId required" }, { status: 400 });
        }

        const subResult = await client.query(
            "SELECT * FROM submissions WHERE submission_id = $1",
            [submissionId]
        );
        if (subResult.rows.length === 0) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }
        const sub = subResult.rows[0];

        await client.query(
            "UPDATE submissions SET status = $1 WHERE submission_id = $2",
            ["published", submissionId]
        );

        try {
            const tableCheck = await client.query("SELECT to_regclass('public.articles') as exists");
            if (tableCheck.rows[0].exists) {
                const sql = `
                    INSERT INTO articles (
                        submission_id, title, abstract, authors, specialty,
                        manuscript_type, doi, volume, issue, page_start, page_end, status
                    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'published')
                    ON CONFLICT (submission_id) DO UPDATE SET
                        manuscript_type = EXCLUDED.manuscript_type,
                        doi = EXCLUDED.doi,
                        volume = EXCLUDED.volume,
                        issue = EXCLUDED.issue,
                        page_start = EXCLUDED.page_start,
                        page_end = EXCLUDED.page_end,
                        status = 'published',
                        published_at = NOW()
                `;
                await client.query(sql, [
                    submissionId,
                    sub.title || "",
                    sub.abstract || "",
                    sub.authors || "",
                    sub.specialty || "",
                    sub.manuscript_type || "original_research",
                    doi || null,
                    volume ? parseInt(volume) : null,
                    issue ? parseInt(issue) : null,
                    pageStart ? parseInt(pageStart) : null,
                    pageEnd ? parseInt(pageEnd) : null,
                ]);
            }
        } catch (_) {
            // articles table may not exist yet
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
