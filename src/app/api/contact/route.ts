import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch (_) {
    return NextResponse.json({ error: "Invalid or empty request body" }, { status: 400 });
  }
    const { name, email, subject, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Try to send email notification
    const smtpPass = process.env.SMTP_PASS || '';
    if (smtpPass) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          host: process.env.SMTP_HOST || 'smtp.zoho.in',
          port: parseInt(process.env.SMTP_PORT || '465'),
          secure: true,
          auth: { user: 'medicalvanguard@zohomail.in', pass: smtpPass },
        });
        await transporter.sendMail({
          from: 'medicalvanguard@zohomail.in',
          to: 'medicalvanguard@zohomail.in',
          subject: `Contact Form: ${subject || 'New Message'} from ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
        });
      } catch (e) {
        console.error('Email failed:', e);
      }
    }

    return NextResponse.json({ success: true, message: 'Message received. We will respond within 3 business days.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
