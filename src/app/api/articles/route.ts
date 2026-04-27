import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ articles: [], message: 'No articles published yet' });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const authorName = formData.get('authorName') as string;
    const authorEmail = formData.get('authorEmail') as string;
    const institution = formData.get('institution') as string;
    const country = formData.get('country') as string;
    const coAuthors = formData.get('coAuthors') as string || '';
    const title = formData.get('title') as string;
    const abstract = formData.get('abstract') as string;
    const keywords = formData.get('keywords') as string;
    const manuscriptType = formData.get('manuscriptType') as string;
    const specialty = formData.get('specialty') as string;
    const wordCount = formData.get('wordCount') as string || '0';
    const conflictOfInterest = formData.get('conflictOfInterest') as string || '';
    const fundingSource = formData.get('fundingSource') as string || '';
    const dataAvailability = formData.get('dataAvailability') as string || '';

    // Validate required fields
    if (!authorName || !authorEmail || !institution || !country || !title || !abstract || !keywords || !manuscriptType || !specialty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate submission ID
    const submissionId = 'MV-' + Date.now().toString(36).toUpperCase().slice(-8);
    const submittedAt = new Date().toISOString();

    // Send notification email via Zoho SMTP
    const emailBody = `
NEW MANUSCRIPT SUBMISSION
=========================
Submission ID: ${submissionId}
Submitted: ${submittedAt}

AUTHOR INFORMATION
------------------
Name: ${authorName}
Email: ${authorEmail}
Institution: ${institution}
Country: ${country}
Co-Authors: ${coAuthors || 'None'}

MANUSCRIPT DETAILS
------------------
Title: ${title}
Type: ${manuscriptType}
Specialty: ${specialty}
Word Count: ${wordCount}
Keywords: ${keywords}

ABSTRACT
--------
${abstract}

DECLARATIONS
------------
Conflict of Interest: ${conflictOfInterest || 'None declared'}
Funding Source: ${fundingSource || 'None'}
Data Availability: ${dataAvailability || 'Available on reasonable request'}

=========================
Please log into the admin panel to review this submission.
    `.trim();

    // Use Zoho SMTP to send email notification
    const smtpHost = process.env.SMTP_HOST || 'smtp.zoho.in';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465');
    const smtpUser = process.env.SMTP_USER || 'medicalvanguard@zohomail.in';
    const smtpPass = process.env.SMTP_PASS || '';
    const notifyEmail = process.env.NOTIFY_EMAIL || 'medicalvanguard@zohomail.in';

    // Try to send email if SMTP credentials are available
    if (smtpPass) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: true,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: smtpUser,
          to: notifyEmail,
          subject: `New Submission [${submissionId}]: ${title.substring(0, 60)}`,
          text: emailBody,
        });
      } catch (emailErr) {
        console.error('Email send failed:', emailErr);
        // Don't fail the submission if email fails
      }
    }

    // Return success with submission ID
    return NextResponse.json(
      { 
        id: submissionId, 
        message: 'Manuscript submitted successfully. You will receive a confirmation email within 24 hours.',
        submittedAt
      }, 
      { status: 201 }
    );

  } catch (err) {
    console.error('Submission error:', err);
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 });
  }
}
