import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(req: NextRequest): string {
  return req.headers.get('x-forwarded-for') ?? 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    const ip = getRateLimitKey(req);
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxAttempts = 5;

    const current = rateLimitMap.get(ip);
    if (current) {
      if (now < current.resetTime) {
        if (current.count >= maxAttempts) {
          return NextResponse.json(
            { error: 'Too many attempts. Try again in 15 minutes.' },
            { status: 429 }
          );
        }
        rateLimitMap.set(ip, { count: current.count + 1, resetTime: current.resetTime });
      } else {
        rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    }

    const body = await req.json();
    const { password } = body as { password: string };
    const adminPassword = process.env.ADMIN_PASSWORD || 'mv-admin-2025';

    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    rateLimitMap.delete(ip);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
