import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import nodemailer from "nodemailer";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 3,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 8000,
});

function generateSubmissionId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MV-${year}${month}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
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
      phone,
      coAuthors,
      title,
      manuscriptType,
      specialty,
      abstract,
      keywords,
      wordCount,
      references: refs,
      fundingSource,
      conflictOfInterest,
      ethicsApproval,
      dataAvailability,
    } = body;

    // Validate required fields
    if (!authorName || !authorEmail || !title || !abstract || !specialty || !manuscriptType) {
      return NextResponse.json(
        { error: "Missing required fields: authorName, authorEmail, title, abstract, specialty, manuscriptType" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const submissionId = generateSubmissionId();
    let dbInserted = false;
    let dbError = null;

    // Try DB insert
    try {
      const client = await pool.connect();
      try {
        // Ensure table exists with base schema
        await client.query(`
          CREATE TABLE IF NOT EXISTS submissions (
            id SERIAL PRIMARY KEY,
            submission_id VARCHAR(50) UNIQUE NOT NULL,
            title TEXT NOT NULL,
            abstract TEXT,
            authors TEXT NOT NULL,
            email VARCHAR(255) NOT NULL,
            specialty VARCHAR(100),
            manuscript_type VARCHAR(100),
            keywords TEXT,
            institution TEXT,
            co_authors TEXT,
            country VARCHAR(100),
            phone VARCHAR(50),
            word_count INTEGER,
            refs TEXT,
            funding_source TEXT,
            conflict_of_interest TEXT,
            ethics_approval TEXT,
            data_availability TEXT,
            cover_letter TEXT,
            status VARCHAR(50) DEFAULT 'received',
            submitted_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            editor_note TEXT,
            assigned_reviewer TEXT
          )
        `);

        // Rename legacy 'author' column to 'authors' if needed
        try {
          await client.query("ALTER TABLE submissions RENAME COLUMN author TO authors");
        } catch (_) {}
        try {
          await client.query("ALTER TABLE submissions RENAME COLUMN email TO author_email_legacy");
        } catch (_) {}

        // Add any missing columns (safe migration)
        const alterStatements = [
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS authors TEXT",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS co_authors TEXT",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS country VARCHAR(100)",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS phone VARCHAR(50)",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS word_count INTEGER",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS refs TEXT",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS funding_source TEXT",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS conflict_of_interest TEXT",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ethics_approval TEXT",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS data_availability TEXT",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS cover_letter TEXT",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS institution TEXT",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS editor_note TEXT",
          "ALTER TABLE submissions ADD COLUMN IF NOT EXISTS assigned_reviewer TEXT",
        ];
        for (const stmt of alterStatements) {
          try { await client.query(stmt); } catch (_) {}
        }

        // Insert submission
        await client.query(
          `INSERT INTO submissions (
            submission_id, title, abstract, authors, email, specialty,
            manuscript_type, keywords, institution, co_authors, country,
            phone, word_count, refs, funding_source, conflict_of_interest,
            ethics_approval, data_availability, status
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
          [
            submissionId,
            title,
            abstract || "",
            authorName,
            authorEmail,
            specialty || "",
            manuscriptType || "",
            keywords || "",
            institution || "",
            coAuthors || "",
            country || "",
            phone || "",
            wordCount ? parseInt(wordCount) : null,
            refs || "",
            fundingSource || "",
            conflictOfInterest || "",
            ethicsApproval || "",
            dataAvailability || "",
            "received",
          ]
        );
        dbInserted = true;
      } finally {
        client.release();
      }
    } catch (dbErr: unknown) {
      dbError = dbErr instanceof Error ? dbErr.message : String(dbErr);
      console.error("DB insert error (non-fatal):", dbErr);
    }

    // Send emails if SMTP configured
    let emailSent = false;
    try {
      const smtpPass = process.env.SMTP_PASS || "6rdHWzTG05fp";
      const smtpUser = process.env.SMTP_USER || "medicalvanguard@zohomail.in";

      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.in",
        port: 465,
        secure: true,
        auth: { user: smtpUser, pass: smtpPass },
      });

      // Confirmation to author
      await transporter.sendMail({
        from: `"Medical Vanguard" <${smtpUser}>`,
        to: authorEmail,
        subject: `Manuscript Received - ${submissionId}`,
        html: `
          <h2>Thank you for your submission!</h2>
          <p>Dear ${authorName},</p>
          <p>We have received your manuscript titled: <strong>${title}</strong></p>
          <p>Your Submission ID is: <strong>${submissionId}</strong></p>
          <p>Please save this ID to track your submission at <a href="https://medical-vanguard.vercel.app/track">https://medical-vanguard.vercel.app/track</a></p>
          <p>You will receive updates as your manuscript progresses through peer review.</p>
          <br>
          <p>Best regards,<br>Medical Vanguard Editorial Team<br>medicalvanguard@zohomail.in</p>
        `,
      });

      // Notification to editor
      await transporter.sendMail({
        from: `"Medical Vanguard" <${smtpUser}>`,
        to: smtpUser,
        subject: `New Submission: ${submissionId} - ${specialty}`,
        html: `
          <h2>New Manuscript Submission</h2>
          <p><strong>Submission ID:</strong> ${submissionId}</p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Author:</strong> ${authorName} (${authorEmail})</p>
          <p><strong>Institution:</strong> ${institution || "Not provided"}</p>
          <p><strong>Type:</strong> ${manuscriptType}</p>
          <p><strong>Specialty:</strong> ${specialty}</p>
          <p><strong>Abstract:</strong> ${abstract?.substring(0, 500)}...</p>
          <p><strong>DB Saved:</strong> ${dbInserted ? "Yes" : "No - " + dbError}</p>
        `,
      });

      emailSent = true;
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
    }

    return NextResponse.json({
      success: true,
      submissionId,
      message: "Manuscript submitted successfully. Check your email for confirmation.",
      emailSent,
      dbInserted,
    });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
