import { NextRequest, NextResponse } from 'next/server';

const REVIEWER_LIST = process.env.REVIEWER_LIST || '';

export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json();
    if (!email || !token) {
      return NextResponse.json({ error: 'Email and token required' }, { status: 400 });
    }
    // Parse reviewer list: "name:email:token,name2:email2:token2"
    const reviewers = REVIEWER_LIST.split(',').map(r => {
      const parts = r.trim().split(':');
      return { name: parts[0], email: parts[1], token: parts[2] };
    });
    const reviewer = reviewers.find(r => r.email === email.trim() && r.token === token.trim());
    if (!reviewer) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ success: true, name: reviewer.name, email: reviewer.email, token: reviewer.token });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
