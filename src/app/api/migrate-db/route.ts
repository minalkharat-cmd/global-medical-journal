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
    const log: string[] = [];
    try {
        await client.query(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published'`);
        log.push("status column added (or already existed)");
        const backfill = await client.query(`UPDATE articles SET status = 'published' WHERE status IS NULL`);
        log.push(`Backfilled ${backfill.rowCount} rows`);
        const dupes = await client.query(`DELETE FROM articles WHERE id NOT IN (SELECT MIN(id) FROM articles GROUP BY submission_id) RETURNING id`);
        log.push(`Removed ${dupes.rowCount || 0} duplicate rows`);
        const ck = await client.query(`SELECT constraint_name FROM information_schema.table_constraints WHERE table_name='articles' AND constraint_type='UNIQUE' AND constraint_name='articles_submission_id_key'`);
        if (ck.rows.length === 0) {
            await client.query(`ALTER TABLE articles ADD CONSTRAINT articles_submission_id_key UNIQUE (submission_id)`);
            log.push("Unique constraint added on submission_id");
        } else {
            log.push("Unique constraint already exists");
        }
        const stats = await client.query(`SELECT COUNT(*) as total, COUNT(DISTINCT submission_id) as uniq FROM articles`);
        log.push(`Table: ${stats.rows[0].total} rows, ${stats.rows[0].uniq} unique submissions`);
        return NextResponse.json({ success: true, log });
    } catch (err) {
        log.push("Error: " + String(err));
        return NextResponse.json({ success: false, log, error: String(err) }, { status: 500 });
    } finally {
        client.release();
        await pool.end();
    }
}
