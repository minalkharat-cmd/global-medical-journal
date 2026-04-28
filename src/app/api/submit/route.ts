import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const title = (body.title || '').trim();
    const manuscriptType = body.manuscriptType || '';
    const specialty = body.specialty || '';
    const wordCount = parseInt(body.wordCount || '0') || 0;
    const abstract = (body.abstract || '').trim();
    const keywords = body.keywords || '';
    const authors = body.authorName || '';
    const email = body.authorEmail || '';
    const institution = body.institution || '';
    const coAuthors = body.coAuthors || '';
    const country = body.country || '';
    const phone = body.phone || '';
    const references = body.references || '';
    const fundingSource = body.fundingSource || '';
    const conflictOfInterest = body.conflictOfInterest || '';
    const ethicsApproval = body.ethicsApproval || '';
    const dataAvailability = body.dataAvailability || '';
    const coverLetter = body.coverLetter || '';

    if (!title || !abstract || !authors || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: title, abstract, authorName, authorEmail' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Generate submission ID
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const submissionId = `MV-${dateStr}-${randomSuffix}`;

    // Try to store in database
    let dbInserted = false;
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS submissions (
          id SERIAL PRIMARY KEY,
          submission_id VARCHAR(50) UNIQUE NOT NULL,
          title TEXT NOT NULL,
          abstract TEXT NOT NULL,
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
          references_text TEXT,
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
      `;

      await sql`
        INSERT INTO submissions (
          submission_id, title, abstract, authors, email, specialty,
          manuscript_type, keywords, institution, co_authors, country,
          phone, word_count, references_text, funding_source,
          conflict_of_interest, ethics_approval, data_availability, cover_letter
        ) VALUES (
          ${submissionId}, ${title}, ${abstract}, ${authors}, ${email},
          ${specialty}, ${manuscriptType}, ${keywords}, ${institution},
          ${coAuthors}, ${country}, ${phone}, ${wordCount}, ${references},
          ${fundingSource}, ${conflictOfInterest}, ${ethicsApproval},
          ${dataAvailability}, ${coverLetter}
        )
      `;
      dbInserted = true;
    } catch (dbErr) {
      console.error('DB insert error (non-fatal):', dbErr);
    }

    // Send emails if SMTP configured
    let emailSent = false;
    if (process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.zoho.in',
          port: 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER || 'medicalvanguard@zohomail.in',
            pass: process.env.SMTP_PASS,
          },
        });

        // Confirmation to author
        await transporter.sendMail({
          from: `"Medical Vanguard" <${process.env.SMTP_USER || 'medicalvanguard@zohomail.in'}>`,
          to: email,
          subject: `Manuscript Received: ${submissionId}`,
          html: `
            <h2>Thank you for your submission!</h2>
            <p>Dear ${authors},</p>
            <p>We have received your manuscript "<strong>${title}</strong>".</p>
            <p>Your submission ID is: <strong>${submissionId}</strong></p>
            <p>You can track your submission status at: <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://medical-vanguard.vercel.app'}/track">Track Submission</a></p>
            <p>We will review your manuscript and get back to you within 4 weeks.</p>
            <br>
            <p>Best regards,<br>Editorial Team<br>Medical Vanguard</p>
          `,
        });

        // Notification to editor
        const editorEmail = process.env.SMTP_USER || 'medicalvanguard@zohomail.in';
        await transporter.sendMail({
          from: `"Medical Vanguard System" <${editorEmail}>`,
          to: editorEmail,
          subject: `New Submission: ${submissionId} - ${title}`,
          html: `
            <h2>New Manuscript Submission</h2>
            <p><strong>ID:</strong> ${submissionId}</p>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Author:</strong> ${authors} (${email})</p>
            <p><strong>Specialty:</strong> ${specialty}</p>
            <p><strong>Type:</strong> ${manuscriptType}</p>
            <p><strong>Word Count:</strong> ${wordCount}</p>
            <p><strong>Institution:</strong> ${institution}</p>
          `,
        });

        emailSent = true;
      } catch (emailErr) {
        console.error('Email send error:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      submissionId,
      message: 'Manuscript submitted successfully',
      emailSent,
      dbInserted,
    });

  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
