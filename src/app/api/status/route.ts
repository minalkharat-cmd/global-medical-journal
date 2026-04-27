import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const STATUS_DETAILS: Record<string, { label: string; color: string; message: string; nextSteps: string }> = {
  'under_review': {
    label: 'Under Peer Review',
    color: '#3182ce',
    message: 'Your manuscript has been assigned to expert peer reviewers and is currently under evaluation.',
    nextSteps: 'The review process typically takes 2–4 weeks. You will be notified once a decision has been reached.'
  },
  'revision_required': {
    label: 'Major Revision Required',
    color: '#d69e2e',
    message: 'Our peer reviewers have completed their evaluation and have recommended major revisions to your manuscript.',
    nextSteps: 'Please address all reviewer comments carefully and resubmit within 30 days. A point-by-point response letter must accompany your revised manuscript.'
  },
  'minor_revision': {
    label: 'Minor Revision Required',
    color: '#ed8936',
    message: 'Our peer reviewers have completed their evaluation and have recommended minor revisions to your manuscript.',
    nextSteps: 'Please address the reviewer comments and resubmit within 14 days.'
  },
  'accepted': {
    label: 'Manuscript Accepted',
    color: '#38a169',
    message: 'Congratulations! We are delighted to inform you that your manuscript has been accepted for publication in Medical Vanguard.',
    nextSteps: 'Your manuscript will now proceed to copy-editing and typesetting. You will receive proofs for approval before final publication. Please ensure your contact details are current.'
  },
  'rejected': {
    label: 'Manuscript Not Accepted',
    color: '#e53e3e',
    message: 'After careful consideration by our editorial team and peer reviewers, we regret that we are unable to accept your manuscript for publication in Medical Vanguard.',
    nextSteps: 'We appreciate your interest in our journal. We encourage you to revise your manuscript based on the reviewer feedback and consider submission to another appropriate journal.'
  },
  'published': {
    label: 'Published Online',
    color: '#805ad5',
    message: 'Your manuscript has been published online in Medical Vanguard and is now freely accessible to readers worldwide.',
    nextSteps: 'Your article is now citable. Please share it with your network and on academic platforms to maximise its impact.'
  }
};

export async function POST(request: NextRequest) {
  try {
    // Simple admin auth check
    const adminKey = request.headers.get('x-admin-key');
    const expectedKey = process.env.ADMIN_KEY || 'mv-admin-2025';
    if (adminKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId, authorEmail, authorName, title, status, customNote } = body;

    if (!submissionId || !authorEmail || !title || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const statusInfo = STATUS_DETAILS[status];
    if (!statusInfo) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const smtpPass = process.env.SMTP_PASS;
    if (!smtpPass) {
      return NextResponse.json({ success: true, message: 'SMTP not configured - email not sent' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.zoho.in',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'medicalvanguard@zohomail.in',
        pass: smtpPass
      }
    });

    await transporter.sendMail({
      from: '"Medical Vanguard Editorial Office" <medicalvanguard@zohomail.in>',
      to: authorEmail,
      subject: `[${submissionId}] Manuscript Status Update — ${statusInfo.label}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #1a365d; padding: 20px 30px;">
            <h2 style="color: white; margin: 0; font-size: 1.3rem;">Medical Vanguard</h2>
            <p style="color: #90cdf4; margin: 4px 0 0; font-size: 0.85rem;">Manuscript Status Update</p>
          </div>
          <div style="padding: 30px;">
            <p>Dear ${authorName || 'Author'},</p>
            <p>We are writing to update you on the status of your manuscript submitted to <strong>Medical Vanguard</strong>.</p>
            <div style="background: ${statusInfo.color}15; border-left: 4px solid ${statusInfo.color}; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0 0 8px;"><strong>Submission ID:</strong> ${submissionId}</p>
              <p style="margin: 0 0 8px;"><strong>Title:</strong> ${title}</p>
              <p style="margin: 0;"><strong>Status:</strong> <span style="color: ${statusInfo.color}; font-weight: bold;">${statusInfo.label}</span></p>
            </div>
            <p>${statusInfo.message}</p>
            ${customNote ? `<div style="background:#f7fafc;padding:16px;border-radius:6px;margin:16px 0;"><strong>Editor's Note:</strong><p style="margin:8px 0 0;color:#4a5568;">${customNote}</p></div>` : ''}
            <p><strong>Next Steps:</strong> ${statusInfo.nextSteps}</p>
            <p style="text-align:center;margin:24px 0;">
              <a href="https://medical-vanguard.vercel.app/track" style="background:${statusInfo.color};color:white;padding:10px 24px;text-decoration:none;border-radius:6px;display:inline-block;">Track Your Submission</a>
            </p>
            <p>If you have any questions, please reply to this email quoting your Submission ID <strong>${submissionId}</strong>.</p>
            <p>Sincerely,<br><strong>Minal Kharat</strong><br>Editor-in-Chief, Medical Vanguard<br>medicalvanguard@zohomail.in</p>
          </div>
          <div style="background:#f7fafc;padding:16px 30px;border-top:1px solid #e2e8f0;font-size:0.8rem;color:#718096;">
            <p style="margin:0;">Medical Vanguard | Open Access Peer-Reviewed Medical Journal | medical-vanguard.vercel.app</p>
          </div>
        </div>
      `
    });

    return NextResponse.json({ success: true, status: statusInfo.label });
  } catch (err) {
    console.error('Status update error:', err);
    return NextResponse.json({ error: 'Failed to send status update' }, { status: 500 });
  }
}
