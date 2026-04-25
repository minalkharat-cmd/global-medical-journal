import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { submittedAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
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
    const wordCount = parseInt(formData.get('wordCount') as string) || 0;
    const conflictOfInterest = formData.get('conflictOfInterest') as string || '';
    const fundingSource = formData.get('fundingSource') as string || '';

    // Handle manuscript file
    let manuscriptPath = '';
    const manuscriptFile = formData.get('manuscript') as File | null;
    if (manuscriptFile && manuscriptFile.size > 0) {
      const uploadDir = path.join(process.cwd(), 'uploads', 'manuscripts');
      await mkdir(uploadDir, { recursive: true });
      const filename = `${Date.now()}-${manuscriptFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const bytes = await manuscriptFile.arrayBuffer();
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
      manuscriptPath = filename;
    }

    const article = await prisma.article.create({
      data: {
        title,
        abstract,
        keywords: keywords.split(',').map((k: string) => k.trim()).join(', '),
        authors: coAuthors ? `${authorName}; ${coAuthors}` : authorName,
        authorEmail,
        institution,
        country,
        manuscriptType,
        specialty,
        wordCount,
        conflictOfInterest,
        fundingSource,
        manuscriptFile: manuscriptPath,
        status: 'SUBMITTED',
      },
    });

    return NextResponse.json({ id: `GMJ-${article.id.slice(-8).toUpperCase()}`, articleId: article.id }, { status: 201 });
  } catch (err) {
    console.error('Submission error:', err);
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 });
  }
}
