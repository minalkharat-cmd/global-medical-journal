import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  let body: Record<string, string> = {};
  try {
    body = await request.json();
  } catch (_) {
    return NextResponse.json({ error: "Invalid or empty request body" }, { status: 400 });
  }

  const {
    authorName,
    authorEmail,
    institution,
    country,
    title,
    manuscriptType,
    specialty,
    abstract,
    keywords,
    coverLetter,
    declaration,
  } = body;

  if (!authorName || !authorEmail || !title || !abstract) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(authorEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const submissionId = "MV-" + new Date().toISOString().slice(2, 7).replace("-", "") + "-" + crypto.randomBytes(3).toString("hex").toUpperCase();

  let dbInserted = false;
  let emailSent = false;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    let needsRecreate = false;
    try {
      await client.query("SELECT email FROM submissions LIMIT 0");
    } catch (_) {
      needsRecreate = true;
    }

    if (needsRecreate) {
      await client.query("DROP TABLE IF EXISTS submissions CASCADE");
    }

    const createSQL = "CREATE TABLE IF NOT EXISTS submissions (" +
      "id SERIAL PRIMARY KEY," +
      "submission_id VARCHAR(50) UNIQUE NOT NULL," +
      "title TEXT NOT NULL," +
      "abstract TEXT," +
      "authors TEXT NOT NULL," +
      "email VARCHAR(255) NOT NULL," +
      "institution TEXT," +
      "country TEXT," +
      "manuscript_type VARCHAR(100)," +
      "specialty VARCHAR(100)," +
      "keywords TEXT," +
      "cover_letter TEXT," +
      "declaration TEXT," +
      "status VARCHAR(50) DEFAULT 'pending'," +
      "submitted_at TIMESTAMP DEFAULT NOW()," +
      "updated_at TIMESTAMP DEFAULT NOW()" +
    ")";
    await client.query(createSQL);

    const alterStatements = [
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS authors TEXT",
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS email VARCHAR(255)",
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS institution TEXT",
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS country TEXT",
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS manuscript_type VARCHAR(100)",
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS specialty VARCHAR(100)",
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS keywords TEXT",
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS cover_letter TEXT",
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS declaration TEXT",
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending'",
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP DEFAULT NOW()",
      "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()",
    ];

    for (const stmt of alterStatements) {
      try { await client.query(stmt); } catch (_) {}
    }

    const insertSQL = "INSERT INTO submissions " +
      "(submission_id, title, abstract, authors, email, institution, country, manuscript_type, specialty, keywords, cover_letter, declaration) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";

    await client.query(insertSQL, [
      submissionId,
      title,
      abstract || "",
      authorName,
      authorEmail,
      institution || "",
      country || "",
      manuscriptType || "",
      specialty || "",
      keywords || "",
      coverLetter || "",
      declaration || "",
    ]);

    dbInserted = true;
  } catch (err) {
    console.error("DB insert error:", err);
  } finally {
    client.release();
    await pool.end();
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: {
        user: "medicalvanguard@zohomail.in",
        pass: process.env.ZOHO_PASS || "6rdHWzTG05fp",
      },
    });

    await transporter.sendMail({
      from: "Medical Vanguard <medicalvanguard@zohomail.in>",
      to: authorEmail,
      subject: "Submission Received - " + submissionId,
      html: "<p>Dear " + authorName + ",</p><p>Your submission ID: <strong>" + submissionId + "</strong></p>",
    });

    emailSent = true;
  } catch (err) {
    console.error("Email error:", err);
  }

  return NextResponse.json({
    success: true,
    submissionId,
    dbInserted,
    emailSent,
  });
}
