import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    totalSubmissions: 0,
    pending: 0,
    underReview: 0,
    accepted: 0,
    rejected: 0,
    published: 0
  });
}
