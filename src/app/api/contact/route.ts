import { NextResponse } from 'next/server';


// Simple in-memory rate limiter (per serverless instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max 5 requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true; // allowed
  }
  if (entry.count >= RATE_LIMIT) {
    return false; // rate limited
  }
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    let body: Record<string, unknown> = {};
  try {
    body = await req.json();
    // Rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  } catch (_) {
    return NextResponse.json({ error: "Invalid or empty request body" }, { status: 400 });
  }
    const { name, email, subject, message } = body;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
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
