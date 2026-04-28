import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { sql, initDb } from '@/lib/db';

function generateSubmissionId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `MV-${year}${month}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const authorName = formData.get('authorName') as string;
    const authorEmail = formData.get('authorEmail') as string;
    const institution = (formData.get('institution') as string) || '';
    const country = (formData.get('country') as string) || '';
    const coAuthors = (formData.get('coAuthors') as string) || '';
    const title = formData.get('title') as string;
    const manuscriptType = (formData.get('manuscriptType') as string) || '';
    const specialty = (formData.get('specialty') as string) || '';
    const wordCount = parseInt((formData.get('wordCount') as string) || '0') || 0;
    const abstract = (formData.get('abstract') as string) || '';
    const keywords = (formData.get('keywords') as string) || '';

    if (!authorName || !authorEmail || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: authorName, authorEmail, title' },
        { status: 400 }
      );
    }

    const submissionId = generateSubmissionId();

    // Store in database
    await initDb();
    try {
      await sql`
        INSERT INTO submissions (
          submission_id, author_name, author_email, institution, country,
          co_authors, title, manuscript_type, specialty, word_count,
          abstract, keywords, status
        ) VALUES (
          ${submissionId}, ${authorName}, ${authorEmail}, ${institution}, ${country},
          ${coAuthors}, ${title}, ${manuscriptType}, ${specialty}, ${wordCount},
          ${abstract}, ${keywords}, 'received'
        )
      `;
    } catch (dbErr) {
      console.error('DB insert error (non-fatal):', dbErr);
    }

    // Send emails if SMTP configured
    let emailSent = false;
    if (process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.zoho.in',
          port: parseInt(process.env.SMTP_PORT || '465'),
          secure: true,
          auth: {
            user: process.env.SMTP_USER || 'medicalvanguard@zohomail.in',
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Medical Vanguard" <${process.env.SMTP_USER || 'medicalvanguard@zohomail.in'}>`,
          to: process.env.NOTIFY_EMAIL || 'medicalvanguard@zohomail.in',
          subject: `[New Submission] ${submissionId}: ${title.substring(0, 60)}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:700px">
              <h2 style="color:#1e40af">New Manuscript Submission</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">Submission ID</td><td style="padding:8px">${submissionId}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">Title</td><td style="padding:8px">${title}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">Author</td><td style="padding:8px">${authorName} &lt;${authorEmail}&gt;</td></tr>
                <tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">Institution</td><td style="padding:8px">${institution}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">Country</td><td style="padding:8px">${country}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">Type</td><td style="padding:8px">${manuscriptType}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">Specialty</td><td style="padding:8px">${specialty}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;background:#f1f5f9">Word Count</td><td style="padding:8px">${wordCount}</td></tr>
              </table>
              <h3>Abstract</h3>
              <p style="background:#f9fafb;padding:12px;border-left:4px solid #3b82f6">${abstract}</p>
            </div>
          `,
        });

        await transporter.sendMail({
          from: `"Medical Vanguard" <${process.env.SMTP_USER || 'medicalvanguard@zohomail.in'}>`,
          to: authorEmail,
          subject: `Submission Received \u2014 ${submissionId}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px">
              <h2 style="color:#1e40af">Thank You for Your Submission</h2>
              <p>Dear ${authorName},</p>
              <p>We have received your manuscript <strong>\u201c${title}\u201d</strong>.</p>
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px;border-radius:8px;margin:20px 0">
                <p style="margin:0;font-size:18px">Your Submission ID: <strong style="color:#15803d">${submissionId}</strong></p>
              </div>
              <p>Track your submission at <a href="https://medical-vanguard.vercel.app/track">medical-vanguard.vercel.app/track</a></p>
              <p>Our editorial team will review your manuscript and contact you within 2-3 weeks.</p>
              <p>Best regards,<br>Editorial Team, Medical Vanguard</p>
            </div>
          `,
        });

        emailSent = true;
      } catch (emailErr) {
        console.error('Email error (non-fatal):', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      submissionId,
      message: 'Submission received successfully',
      emailSent,
    });

  } catch (err) {
    console.error('Submit error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
