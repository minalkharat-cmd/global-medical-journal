import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (token !== "mv-admin-2025") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 3 });
  const client = await pool.connect();
  const log: string[] = [];
  try {
    const before = await client.query("SELECT COUNT(*) as c FROM articles");
    const sbefore = await client.query("SELECT COUNT(*) as c FROM submissions");
    log.push(`Before: ${before.rows[0].c} articles, ${sbefore.rows[0].c} submissions`);
    const dup = await client.query("DELETE FROM articles WHERE id NOT IN (SELECT MIN(id) FROM articles GROUP BY submission_id) RETURNING id");
    log.push(`Deleted ${dup.rowCount} duplicate articles: ids ${dup.rows.map((r:{id:number})=>r.id).join(",")}`);
    const bad = await client.query("DELETE FROM submissions WHERE title LIKE '%DROP TABLE%' OR title LIKE '%<script>%' OR title LIKE '%xss%' OR title LIKE 'LIVE-TEST%' RETURNING submission_id,title");
    log.push(`Deleted ${bad.rowCount} test submissions`);
    bad.rows.forEach((r:{submission_id:string,title:string})=>log.push(`  - ${r.submission_id}: ${r.title}`));
    const orp = await client.query("DELETE FROM articles WHERE submission_id NOT IN (SELECT submission_id FROM submissions) RETURNING id,title");
    log.push(`Deleted ${orp.rowCount} orphaned articles`);
    const after = await client.query("SELECT COUNT(*) as c FROM articles");
    const safter = await client.query("SELECT COUNT(*) as c FROM submissions");
    log.push(`After: ${after.rows[0].c} articles, ${safter.rows[0].c} submissions`);
    const rem = await client.query("SELECT id,submission_id,title FROM articles ORDER BY id");
    rem.rows.forEach((r:{id:number,submission_id:string,title:string})=>log.push(`  Article ${r.id}: ${r.title}`));
    return NextResponse.json({ success: true, log });
  } catch(err) {
    return NextResponse.json({ success: false, error: String(err), log }, { status: 500 });
  } finally {
    client.release();
    await pool.end();
  }
}
