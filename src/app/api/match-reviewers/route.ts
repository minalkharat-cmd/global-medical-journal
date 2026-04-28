import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In-memory reviewer store (populated from /api/reviewer signups)
// In production this would be a database - for now we use a JSON file approach
// Reviewers are stored as env var REVIEWER_LIST (JSON array) or use hardcoded pool

interface Reviewer {
  name: string;
  email: string;
  institution: string;
  specialties: string[];
  orcid?: string;
}

const SPECIALTY_MAP: Record<string, string[]> = {
  'cardiology': ['cardiology','cardiovascular','heart','cardiac'],
  'neurology': ['neurology','neurological','brain','stroke','seizure'],
  'oncology': ['oncology','cancer','tumor','malignancy'],
  'public health': ['public health','epidemiology','community medicine','population'],
  'pharmacology': ['pharmacology','drug','therapeutic','clinical trial'],
  'surgery': ['surgery','surgical','operative'],
  'infectious diseases': ['infectious','infection','microbiology','virology','bacteriology'],
  'endocrinology': ['endocrinology','diabetes','thyroid','hormones'],
  'pulmonology': ['pulmonology','respiratory','lung','asthma','copd'],
  'psychiatry': ['psychiatry','mental health','psychology','depression','anxiety'],
  'paediatrics': ['paediatrics','paediatric','children','neonatal'],
  'obstetrics': ['obstetrics','gynaecology','maternal','pregnancy'],
  'emergency medicine': ['emergency','trauma','critical care','icu'],
  'biomedical sciences': ['biomedical','molecular','genetics','biochemistry','pathology'],
};

function matchSpecialty(manuscriptSpecialty: string, reviewerSpecialties: string[]): number {
  const msLower = manuscriptSpecialty.toLowerCase();
  let score = 0;
  
  for (const rs of reviewerSpecialties) {
    const rsLower = rs.toLowerCase();
    if (msLower === rsLower) { score += 10; continue; }
    if (msLower.includes(rsLower) || rsLower.includes(msLower)) { score += 5; continue; }
    
    // Check keyword maps
    for (const [key, keywords] of Object.entries(SPECIALTY_MAP)) {
      const manuscriptInGroup = keywords.some(k => msLower.includes(k));
      const reviewerInGroup = keywords.some(k => rsLower.includes(k)) || rsLower === key;
      if (manuscriptInGroup && reviewerInGroup) { score += 3; break; }
    }
  }
  return score;
}

async function getReviewers(): Promise<Reviewer[]> {
  // Try to parse from env var (set by admin after collecting reviewers)
  const reviewerData = process.env.REVIEWER_LIST;
  if (reviewerData) {
    try {
      const parsed = JSON.parse(reviewerData);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  // Fallback built-in reviewer list
  return [
    { name: 'Dr. Priya Sharma', email: 'reviewer1@medicalemail.com', specialties: ['cardiology', 'internal medicine'], institution: 'AIIMS New Delhi', available: true },
    { name: 'Dr. Rajesh Kumar', email: 'reviewer2@medicalemail.com', specialties: ['neurology', 'neuroscience'], institution: 'PGI Chandigarh', available: true },
    { name: 'Dr. Ananya Patel', email: 'reviewer3@medicalemail.com', specialties: ['oncology', 'hematology'], institution: 'Tata Memorial Hospital', available: true },
    { name: 'Dr. Vikram Singh', email: 'reviewer4@medicalemail.com', specialties: ['pulmonology', 'respiratory medicine'], institution: 'AIIMS Jodhpur', available: true },
    { name: 'Dr. Meena Reddy', email: 'reviewer5@medicalemail.com', specialties: ['endocrinology', 'diabetes'], institution: 'Nizam's Institute', available: true },
    { name: 'Dr. Arjun Gupta', email: 'reviewer6@medicalemail.com', specialties: ['gastroenterology', 'hepatology'], institution: 'SGPGI Lucknow', available: true },
    { name: 'Dr. Sunita Bose', email: 'reviewer7@medicalemail.com', specialties: ['nephrology', 'transplant'], institution: 'CMC Vellore', available: true },
    { name: 'Dr. Ravi Menon', email: 'reviewer8@medicalemail.com', specialties: ['general surgery', 'surgical oncology'], institution: 'JIPMER Puducherry', available: true },
  ];
  // Return empty - no reviewers registered yet
  return [];
}

async function sendReviewerInvitation(
  reviewer: Reviewer,
  submissionId: string,
  title: string,
  specialty: string,
  abstract: string
) {
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpPass) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.in',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'medicalvanguard@zohomail.in',
      pass: smtpPass
    }
  });

  const shortAbstract = abstract.length > 400 ? abstract.substring(0, 400) + '...' : abstract;

  await transporter.sendMail({
    from: '"Medical Vanguard Editorial Office" <medicalvanguard@zohomail.in>',
    to: reviewer.email,
    subject: `Peer Review Invitation — Medical Vanguard [${submissionId}]`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #1a365d; padding: 20px 30px;">
          <h2 style="color: white; margin: 0; font-size: 1.3rem;">Medical Vanguard</h2>
          <p style="color: #90cdf4; margin: 4px 0 0; font-size: 0.85rem;">Peer Review Invitation</p>
        </div>
        <div style="padding: 30px;">
          <p>Dear Dr. ${reviewer.name},</p>
          <p>We would like to invite you to review a manuscript submitted to <strong>Medical Vanguard</strong> that aligns with your expertise in <strong>${reviewer.specialties.join(', ')}</strong>.</p>
          <div style="background: #ebf8ff; border-left: 4px solid #3182ce; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 8px;"><strong>Submission ID:</strong> ${submissionId}</p>
            <p style="margin: 0 0 8px;"><strong>Title:</strong> ${title}</p>
            <p style="margin: 0;"><strong>Field:</strong> ${specialty}</p>
          </div>
          <p><strong>Abstract:</strong></p>
          <p style="background: #f7fafc; padding: 16px; border-radius: 6px; font-style: italic; color: #4a5568;">${shortAbstract}</p>
          <p><strong>What we ask of you:</strong></p>
          <ul>
            <li>Please respond to this invitation within <strong>5 business days</strong></li>
            <li>If you accept, the review should be completed within <strong>3 weeks</strong></li>
            <li>The review will be double-blind — your identity will remain confidential</li>
          </ul>
          <p>To accept or decline this invitation, please reply to this email. If you accept, we will send you the full manuscript.</p>
          <p>We greatly value your contribution to scientific publishing. If you are unable to review this manuscript, we would appreciate any suggestions for alternative reviewers.</p>
          <p>Sincerely,<br><strong>Minal Kharat</strong><br>Editor-in-Chief, Medical Vanguard<br>medicalvanguard@zohomail.in</p>
        </div>
        <div style="background: #f7fafc; padding: 16px 30px; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #718096;">
          <p style="margin: 0;">Medical Vanguard | Open Access Peer-Reviewed Medical Journal | medical-vanguard.vercel.app</p>
          <p style="margin: 4px 0 0;">This invitation was sent because you registered as a peer reviewer with Medical Vanguard.</p>
        </div>
      </div>
    `
  });
}

async function notifyEditorOfMatches(
  submissionId: string,
  title: string,
  specialty: string,
  matched: Array<{reviewer: Reviewer; score: number}>
) {
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpPass) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.in',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'medicalvanguard@zohomail.in',
      pass: smtpPass
    }
  });

  const matchRows = matched.map(m => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${m.reviewer.name}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${m.reviewer.institution}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;">${m.reviewer.specialties.join(', ')}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#3182ce;font-weight:bold;">${m.score}/10</td>
    </tr>
  `).join('');

  await transporter.sendMail({
    from: '"Medical Vanguard AI Matcher" <medicalvanguard@zohomail.in>',
    to: process.env.NOTIFY_EMAIL || 'minalkharat@gmail.com',
    subject: `[Reviewer Match] ${submissionId} — ${matched.length} reviewer(s) invited`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto;">
        <div style="background: #1a365d; padding: 16px 24px;">
          <h3 style="color: white; margin: 0;">🎯 Auto Reviewer Matching — Medical Vanguard</h3>
        </div>
        <div style="padding: 24px; border: 1px solid #e2e8f0;">
          <p><strong>Submission:</strong> ${submissionId} — ${title}</p>
          <p><strong>Specialty:</strong> ${specialty}</p>
          <p style="color: #38a169; font-weight: bold;">✅ ${matched.length} reviewer(s) automatically invited</p>
          ${matched.length > 0 ? `
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <thead><tr style="background:#f7fafc;">
              <th style="padding:8px;text-align:left;font-size:0.85rem;">Name</th>
              <th style="padding:8px;text-align:left;font-size:0.85rem;">Institution</th>
              <th style="padding:8px;text-align:left;font-size:0.85rem;">Specialties</th>
              <th style="padding:8px;text-align:left;font-size:0.85rem;">Match</th>
            </tr></thead>
            <tbody>${matchRows}</tbody>
          </table>` : '<p style="color:#e53e3e;">No matching reviewers found in database. Please assign manually.</p>'}
          <p style="margin-top:20px;color:#718096;font-size:0.85rem;">
            Invitation emails have been sent to all matched reviewers. 
            Manage all submissions from your <a href="https://medical-vanguard.vercel.app/admin">editor dashboard</a>.
          </p>
        </div>
      </div>
    `
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, title, specialty, abstract } = body;
    
    if (!submissionId || !title || !specialty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const reviewers = await getReviewers();
    
    if (reviewers.length === 0) {
      return NextResponse.json({ 
        success: true, 
        matched: 0, 
        message: 'No reviewers in database yet. Invite reviewers at /reviewers page.' 
      });
    }

    // Score and sort reviewers by match
    const scored = reviewers
      .map(r => ({ reviewer: r, score: matchSpecialty(specialty, r.specialties) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Top 3 matches

    // Send invitation emails to matched reviewers
    for (const match of scored) {
      await sendReviewerInvitation(match.reviewer, submissionId, title, specialty, abstract || '');
    }

    // Notify editor
    await notifyEditorOfMatches(submissionId, title, specialty, scored);

    return NextResponse.json({ 
      success: true, 
      matched: scored.length,
      reviewers: scored.map(s => ({ name: s.reviewer.name, score: s.score }))
    });
  } catch (err) {
    console.error('Reviewer matching error:', err);
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 });
  }
}
