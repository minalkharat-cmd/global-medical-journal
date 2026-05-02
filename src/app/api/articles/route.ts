import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const specialty = searchParams.get("specialty") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const offset = (page - 1) * limit;

    const client = await pool.connect();
    try {
        const conditions: string[] = [];
        const params: (string | number)[] = [];
        let paramIdx = 1;

        if (search) {
            conditions.push(`(a.title ILIKE $${paramIdx} OR a.authors ILIKE $${paramIdx} OR a.abstract ILIKE $${paramIdx})`);
            params.push(`%${search}%`);
            paramIdx++;
        }
        if (specialty) {
            conditions.push(`a.specialty ILIKE $${paramIdx}`);
            params.push(`%${specialty}%`);
            paramIdx++;
        }

        const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

        const countSQL = `SELECT COUNT(*) as total FROM articles a ${where}`;
        const countRes = await client.query(countSQL, params);
        const total = parseInt(countRes.rows[0].total);

        const dataSQL = `
            SELECT a.id, a.submission_id, a.title, a.authors, a.abstract,
                   a.specialty, a.manuscript_type, a.doi, a.published_at,
                   a.volume, a.issue, a.page_start, a.page_end,
                   a.status,
                   a.page_start || CASE WHEN a.page_end IS NOT NULL THEN '-' || a.page_end ELSE '' END as pages
            FROM articles a
            ${where}
            ORDER BY a.published_at DESC
            LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
        `;
        const dataRes = await client.query(dataSQL, [...params, limit, offset]);

        const specialtiesSQL = `SELECT DISTINCT specialty FROM articles WHERE specialty IS NOT NULL AND specialty != '' ORDER BY specialty`;
        const specialtiesRes = await client.query(specialtiesSQL);

        const articles = dataRes.rows.map(a => ({
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
            pages: a.page_start ? `${a.page_start}${a.page_end ? '-' + a.page_end : ''}` : null,
            status: a.status,
        }));

        return NextResponse.json({
            success: true,
            articles,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            specialties: specialtiesRes.rows.map(r => r.specialty),
        });
    } catch (err) {
        console.error("Articles error:", err);
        return NextResponse.json({ success: true, articles: [], total: 0, page: 1, limit, totalPages: 0, specialties: [], message: "No articles published yet" });
    } finally {
        client.release();
        await pool.end();
    }
}
