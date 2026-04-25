import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { submittedAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const article = await prisma.article.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
