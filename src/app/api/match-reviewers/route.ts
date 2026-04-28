import { NextRequest, NextResponse } from 'next/server';

interface Reviewer {
  name: string;
  email: string;
  specialties: string[];
  institution: string;
  available?: boolean;
}

// Built-in fallback reviewer list
const FALLBACK_REVIEWERS: Reviewer[] = [
  { name: "Dr. Priya Sharma", email: "reviewer1@medicalemail.com", specialties: ["cardiology", "internal medicine", "cardiovascular"], institution: "AIIMS New Delhi", available: true },
  { name: "Dr. Rajesh Kumar", email: "reviewer2@medicalemail.com", specialties: ["neurology", "neuroscience", "psychiatry"], institution: "PGI Chandigarh", available: true },
  { name: "Dr. Ananya Patel", email: "reviewer3@medicalemail.com", specialties: ["oncology", "hematology", "cancer"], institution: "Tata Memorial Hospital", available: true },
  { name: "Dr. Vikram Singh", email: "reviewer4@medicalemail.com", specialties: ["pulmonology", "respiratory medicine", "critical care"], institution: "AIIMS Jodhpur", available: true },
  { name: "Dr. Meena Reddy", email: "reviewer5@medicalemail.com", specialties: ["endocrinology", "diabetes", "metabolism"], institution: "Nizams Institute of Medical Sciences", available: true },
  { name: "Dr. Arjun Gupta", email: "reviewer6@medicalemail.com", specialties: ["gastroenterology", "hepatology", "digestive"], institution: "SGPGI Lucknow", available: true },
  { name: "Dr. Sunita Bose", email: "reviewer7@medicalemail.com", specialties: ["nephrology", "transplant medicine", "renal"], institution: "CMC Vellore", available: true },
  { name: "Dr. Ravi Menon", email: "reviewer8@medicalemail.com", specialties: ["general surgery", "surgical oncology", "surgery"], institution: "JIPMER Puducherry", available: true },
];

function getReviewers(): Reviewer[] {
  const reviewerData = process.env.REVIEWER_LIST;
  if (reviewerData) {
    try {
      const parsed = JSON.parse(reviewerData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Reviewer[];
      }
    } catch {
      // JSON parse failed, use fallback
    }
  }
  return FALLBACK_REVIEWERS;
}

function matchSpecialty(specialty: string, reviewerSpecialties: string[]): number {
  if (!specialty || !Array.isArray(reviewerSpecialties)) return 0;
  const specialtyLower = specialty.toLowerCase();
  let score = 0;
  for (const rs of reviewerSpecialties) {
    const rsLower = (rs || '').toLowerCase();
    if (rsLower === specialtyLower) score += 5;
    else if (rsLower.includes(specialtyLower) || specialtyLower.includes(rsLower)) score += 3;
  }
  return score;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, title, specialty, abstract } = body;

    if (!title || !specialty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const reviewers = getReviewers();

    // Score and sort reviewers
    const scored = reviewers
      .map(r => ({ reviewer: r, score: matchSpecialty(specialty, r.specialties) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // If no specialty matches, return top 3 regardless
    const matches = scored.length > 0 ? scored : reviewers.slice(0, 3).map(r => ({ reviewer: r, score: 0 }));

    // Return the matched reviewers (without sending emails - that requires SMTP)
    return NextResponse.json({
      success: true,
      submissionId,
      reviewers: matches.map(m => ({
        name: m.reviewer.name,
        institution: m.reviewer.institution,
        specialties: m.reviewer.specialties,
        matchScore: m.score,
      })),
      message: `Found ${matches.length} potential reviewers for specialty: ${specialty}`,
    });

  } catch (err) {
    console.error('Reviewer matching error:', err);
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 });
  }
}
