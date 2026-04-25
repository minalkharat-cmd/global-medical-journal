import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [total, pending, underReview, accepted, rejected] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'SUBMITTED' } }),
      prisma.article.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.article.count({ where: { status: 'ACCEPTED' } }),
      prisma.article.count({ where: { status: 'REJECTED' } }),
    ]);
    return NextResponse.json({ total, pending, underReview, accepted, rejected });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
