import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const JOURNAL_SCOPE = [
  'clinical medicine','surgery','cardiology','neurology','oncology',
  'gastroenterology','pulmonology','endocrinology','nephrology',
  'public health','epidemiology','pharmacology','biomedical sciences',
  'microbiology','immunology','genetics','pathology','biochemistry',
  'medical education','bioethics','global health','infectious diseases',
  'nursing','allied health','orthopaedics','anaesthesiology',
  'psychiatry','dermatology','ophthalmology','radiology','pathology',
  'obstetrics','gynaecology','paediatrics','geriatrics','emergency medicine'
];

async function aiScreen(title: string, abstract: string, specialty: string): Promise<{
  decision: 'accept_for_review' | 'desk_reject';
  reason: string;
  summary: string;
  concerns: string[];
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    // Rule-based fallback when no OpenAI key
    const text = (title + ' ' + abstract + ' ' + specialty).toLowerCase();
    const inScope = JOURNAL_SCOPE.some(topic => text.includes(topic));
    const hasAbstract = abstract.trim().length > 150;
    const hasTitle = title.trim().length > 10;
    
    if (inScope && hasAbstract && hasTitle) {
      return {
        decision: 'accept_for_review',
        reason: 'Manuscript appears to fall within the journal scope and meets basic formatting requirements.',
        summary: `Submission on "${title}" in the area of ${specialty}.`,
        concerns: []
      };
    } else {
      const concerns = [];
      if (!inScope) concerns.push('Topic may be outside journal scope');
      if (!hasAbstract) concerns.push('Abstract appears too short or missing');
      if (!hasTitle) concerns.push('Title appears incomplete');
      return {
        decision: 'desk_reject',
        reason: 'Manuscript does not meet basic submission requirements.',
        summary: `Submission on "${title}" could not be verified as in-scope.`,
        concerns
      };
    }
  }

  // Full AI screening with GPT-4o-mini
  const prompt = `You are a senior editor of Medical Vanguard, a peer-reviewed open-access medical journal. 
Your task is to perform an initial desk screening of a submitted manuscript.

JOURNAL SCOPE: Clinical medicine, surgery, biomedical sciences, public health, epidemiology, pharmacology, medical ethics, global health, nursing, and allied health sciences.

MANUSCRIPT DETAILS:
Title: ${title}
Specialty/Field: ${specialty}
Abstract: ${abstract}

SCREENING CRITERIA:
1. Is the topic within the journal scope?
2. Does the abstract describe original research, a review, or a case report (not a commentary on unrelated topics)?
3. Is the abstract structured and informative (background, methods, results, conclusion)?
4. Are there any immediate red flags (duplicate publication, fraudulent claims, clearly unethical research)?

Respond with a JSON object only (no markdown), with these exact fields:
{
  "decision": "accept_for_review" or "desk_reject",
  "reason": "one sentence explanation",
  "summary": "2-sentence neutral summary of the paper for the editor",
  "concerns": ["list of specific concerns if any, empty array if none"]
}`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 400
      })
    });
    
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error('Empty AI response');
    
    // Parse JSON response
    const parsed = JSON.parse(content);
    return parsed;
  } catch (e) {
    // Fallback if AI fails
    return {
      decision: 'accept_for_review',
      reason: 'AI screening unavailable. Manuscript forwarded for manual editorial review.',
      summary: `Submission: "${title}" in ${specialty}.`,
      concerns: ['AI screening failed - please review manually']
    };
  }
}

async function sendAuthorEmail(
  authorEmail: string,
  authorName: string,
  title: string,
  submissionId: string,
  decision: 'accept_for_review' | 'desk_reject',
  reason: string
) {
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpPass) return; // Skip if not configured

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.in',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SMTP_USER || 'medicalvanguard@zohomail.in',
      pass: smtpPass
    }
  });

  if (decision === 'accept_for_review') {
    await transporter.sendMail({
      from: '"Medical Vanguard Editorial Office" <medicalvanguard@zohomail.in>',
      to: authorEmail,
      subject: `[${submissionId}] Submission Received & Under Editorial Review`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #1a365d; padding: 20px 30px;">
            <h2 style="color: white; margin: 0; font-size: 1.3rem;">Medical Vanguard</h2>
            <p style="color: #90cdf4; margin: 4px 0 0; font-size: 0.85rem;">Editorial Office</p>
          </div>
          <div style="padding: 30px;">
            <p>Dear ${authorName},</p>
            <p>Thank you for submitting your manuscript to <strong>Medical Vanguard</strong>. We are pleased to confirm that your submission has passed our initial editorial screening and has been accepted for peer review.</p>
            <div style="background: #f0fff4; border-left: 4px solid #38a169; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0 0 8px;"><strong>Submission ID:</strong> ${submissionId}</p>
              <p style="margin: 0 0 8px;"><strong>Manuscript Title:</strong> ${title}</p>
              <p style="margin: 0;"><strong>Current Status:</strong> Under Peer Review</p>
            </div>
            <p>Your manuscript has been assigned to expert reviewers in the relevant field. You can track your submission status at any time using your Submission ID at:</p>
            <p style="text-align: center;"><a href="https://medical-vanguard.vercel.app/track" style="background: #2b6cb0; color: white; padding: 10px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Track Your Submission</a></p>
            <p><strong>Expected Timeline:</strong></p>
            <ul>
              <li>Initial editorial decision: 1–3 business days</li>
              <li>Full peer review: 2–4 weeks</li>
              <li>Final decision: Within 6 weeks of submission</li>
            </ul>
            <p>Please do not submit the manuscript elsewhere while it is under review. If you have any questions, please reply to this email quoting your Submission ID.</p>
            <p>Sincerely,<br><strong>Editorial Office</strong><br>Medical Vanguard<br>medicalvanguard@zohomail.in</p>
          </div>
          <div style="background: #f7fafc; padding: 16px 30px; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #718096;">
            <p style="margin: 0;">Medical Vanguard | Open Access Peer-Reviewed Medical Journal | medical-vanguard.vercel.app</p>
          </div>
        </div>
      `
    });
  } else {
    await transporter.sendMail({
      from: '"Medical Vanguard Editorial Office" <medicalvanguard@zohomail.in>',
      to: authorEmail,
      subject: `[${submissionId}] Manuscript Decision: Not Suitable for Review`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #1a365d; padding: 20px 30px;">
            <h2 style="color: white; margin: 0; font-size: 1.3rem;">Medical Vanguard</h2>
            <p style="color: #90cdf4; margin: 4px 0 0; font-size: 0.85rem;">Editorial Office</p>
          </div>
          <div style="padding: 30px;">
            <p>Dear ${authorName},</p>
            <p>Thank you for considering <strong>Medical Vanguard</strong> for your manuscript. After careful editorial review, we regret to inform you that your submission does not meet our current requirements for peer review.</p>
            <div style="background: #fff5f5; border-left: 4px solid #e53e3e; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0 0 8px;"><strong>Submission ID:</strong> ${submissionId}</p>
              <p style="margin: 0 0 8px;"><strong>Manuscript Title:</strong> ${title}</p>
              <p style="margin: 0;"><strong>Decision:</strong> Desk Rejection</p>
            </div>
            <p><strong>Reason:</strong> ${reason}</p>
            <p>This decision does not necessarily reflect the quality of your research. We encourage you to consider revising your manuscript to better align with our <a href="https://medical-vanguard.vercel.app/guidelines" style="color: #2b6cb0;">author guidelines</a> before resubmitting, or to seek publication in a more appropriate journal.</p>
            <p>We appreciate your interest in Medical Vanguard and wish you success in publishing your work.</p>
            <p>Sincerely,<br><strong>Editorial Office</strong><br>Medical Vanguard<br>medicalvanguard@zohomail.in</p>
          </div>
          <div style="background: #f7fafc; padding: 16px 30px; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #718096;">
            <p style="margin: 0;">Medical Vanguard | Open Access Peer-Reviewed Medical Journal | medical-vanguard.vercel.app</p>
          </div>
        </div>
      `
    });
  }
}

async function notifyEditor(
  submissionId: string,
  title: string,
  authorName: string,
  specialty: string,
  decision: 'accept_for_review' | 'desk_reject',
  summary: string,
  concerns: string[]
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

  const statusColor = decision === 'accept_for_review' ? '#38a169' : '#e53e3e';
  const statusLabel = decision === 'accept_for_review' ? '✅ ACCEPTED FOR REVIEW' : '❌ DESK REJECTED';

  await transporter.sendMail({
    from: '"Medical Vanguard AI Screener" <medicalvanguard@zohomail.in>',
    to: process.env.NOTIFY_EMAIL || 'minalkharat@gmail.com',
    subject: `[AI Screener] ${submissionId} — ${decision === 'accept_for_review' ? 'Sent to Review' : 'Desk Rejected'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a365d; padding: 16px 24px;">
          <h3 style="color: white; margin: 0;">🤖 AI Screener Report — Medical Vanguard</h3>
        </div>
        <div style="padding: 24px; border: 1px solid #e2e8f0;">
          <div style="background: ${statusColor}15; border-left: 4px solid ${statusColor}; padding: 12px; margin-bottom: 20px; border-radius: 4px;">
            <strong style="color: ${statusColor}; font-size: 1.1rem;">${statusLabel}</strong>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 6px 0; color: #718096; width: 40%;">Submission ID</td><td style="padding: 6px 0; font-weight: bold;">${submissionId}</td></tr>
            <tr><td style="padding: 6px 0; color: #718096;">Title</td><td style="padding: 6px 0;">${title}</td></tr>
            <tr><td style="padding: 6px 0; color: #718096;">Author</td><td style="padding: 6px 0;">${authorName}</td></tr>
            <tr><td style="padding: 6px 0; color: #718096;">Specialty</td><td style="padding: 6px 0;">${specialty}</td></tr>
          </table>
          <div style="background: #f7fafc; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
            <strong style="color: #2d3748;">AI Summary:</strong>
            <p style="margin: 8px 0 0; color: #4a5568;">${summary}</p>
          </div>
          ${concerns.length > 0 ? `
          <div style="background: #fff5f5; padding: 16px; border-radius: 6px;">
            <strong style="color: #c53030;">Concerns Flagged:</strong>
            <ul style="margin: 8px 0 0; padding-left: 20px; color: #4a5568;">
              ${concerns.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>` : ''}
          <p style="margin-top: 20px; color: #718096; font-size: 0.85rem;">
            The author has been automatically notified of this decision. 
            You can override this decision at any time from your 
            <a href="https://medical-vanguard.vercel.app/admin">editor dashboard</a>.
          </p>
        </div>
      </div>
    `
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, title, abstract, authorName, authorEmail, specialty } = body;
    
    if (!submissionId || !title || !abstract || !authorEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Run AI screening
    const screening = await aiScreen(title, abstract, specialty || 'General Medicine');
    
    // Send email to author
    await sendAuthorEmail(
      authorEmail, authorName, title, submissionId,
      screening.decision, screening.reason
    );
    
    // Notify editor with AI report
    await notifyEditor(
      submissionId, title, authorName, specialty,
      screening.decision, screening.summary, screening.concerns
    );

    return NextResponse.json({
      success: true,
      decision: screening.decision,
      summary: screening.summary
    });
  } catch (err) {
    console.error('Screening error:', err);
    return NextResponse.json({ error: 'Screening failed' }, { status: 500 });
  }
}
