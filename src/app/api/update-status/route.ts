import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { sql, initDb } from '@/lib/db';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  received: { label: 'Received', color: '#6b7280' },
  screening: { label: 'Under Screening', color: '#f59e0b' },
  peer_review: { label: 'Under Peer Review', color: '#3b82f6' },
  major_revision: { label: 'Major Revision Required', color: '#f97316' },
  minor_revision: { label: 'Minor Revision Required', color: '#eab308' },
  accepted: { label: 'Accepted', color: '#22c55e' },
  rejected: { label: 'Rejected', color: '#ef4444' },
  published: { label: 'Published', color: '#8b5cf6' },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, authorEmail, authorName, title, status, editorNote } = body;

    if (!submissionId || !status) {
      return NextResponse.json({ error: 'submissionId and status are required' }, { status: 400 });
    }

    const statusInfo = STATUS_LABELS[status] || { label: status, color: '#6b7280' };

    // Update DB
    await initDb();
    try {
      await sql`
        UPDATE submissions
        SET status = ${status}, editor_note = ${editorNote || ''}, updated_at = NOW()
        WHERE submission_id = ${submissionId}
      `;
    } catch (dbErr) {
      console.error('DB update error (non-fatal):', dbErr);
    }

    let emailSent = false;
    if (authorEmail && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.zoho.in',
          port: parseInt(process.env.SMTP_PORT || '465'),
          secure: true,
          auth: {
            user: process.env.SMTP_USER || 'medicalvanguard@zohomail.in',
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Medical Vanguard Editorial Office" <${process.env.SMTP_USER || 'medicalvanguard@zohomail.in'}>`,
          to: authorEmail,
          subject: `Submission Status Update: ${submissionId} — ${statusInfo.label}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <div style="background:#1e40af;padding:20px;text-align:center">
                <h1 style="color:white;margin:0;font-size:20px">Medical Vanguard</h1>
                <p style="color:#bfdbfe;margin:4px 0 0">Submission Status Update</p>
              </div>
              <div style="padding:24px">
                <p>Dear ${authorName || 'Author'},</p>
                <p>Your manuscript submission <strong>${submissionId}</strong> has a status update:</p>
                ${title ? `<p style="color:#374151"><em>"${title}"</em></p>` : ''}
                <div style="background:#f8fafc;border-radius:8px;padding:20px;margin:20px 0;text-align:center">
                  <p style="margin:0;font-size:14px;color:#6b7280">Current Status</p>
                  <p style="margin:8px 0 0;font-size:24px;font-weight:bold;color:${statusInfo.color}">${statusInfo.label}</p>
                </div>
                ${editorNote ? `<div style="background:#fff8f0;border-left:4px solid #f59e0b;padding:12px;margin:16px 0"><p style="margin:0;font-weight:bold;color:#92400e">Editor's Note:</p><p style="margin:8px 0 0;color:#374151">${editorNote}</p></div>` : ''}
                <p>If you have any questions, please reply to this email or contact us at <a href="mailto:medicalvanguard@zohomail.in">medicalvanguard@zohomail.in</a></p>
                <p>Best regards,<br><strong>Editorial Team</strong><br>Medical Vanguard</p>
              </div>
            </div>
          `,
        });
        emailSent = true;
      } catch (emailErr) {
        console.error('Email error (non-fatal):', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      emailSent,
      status,
      message: `Status updated to: ${statusInfo.label}`,
    });

  } catch (err) {
    console.error('update-status error:', err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
