import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in-memory, resets on redeploy)
const attempts: Map<string, { count: number; resetAt: number }> = new Map();

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();

  // Rate limit: max 5 attempts per 15 minutes per IP
  const record = attempts.get(ip);
  if (record) {
    if (now < record.resetAt) {
      if (record.count >= 5) {
        return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
      }
      record.count++;
    } else {
      attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    }
  } else {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
  }

  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'mv-admin-2025';

    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Clear attempts on success
    attempts.delete(ip);
    return NextResponse.json({ success: true, token: adminPassword });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
