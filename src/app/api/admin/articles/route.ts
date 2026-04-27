import { NextResponse } from 'next/server';

export async function GET() {
  // Admin articles list - returns empty until database is configured
  return NextResponse.json({ articles: [], total: 0 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  return NextResponse.json({ success: true, message: 'Update received', id: body.id });
}
