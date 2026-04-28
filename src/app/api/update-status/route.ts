import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const STATUS_LABELS: Record<string, string> = {
  received: "Received",
  screening: "Under Initial Screening",
  peer_review: "Sent to Peer Review",
  major_revision: "Major Revision Required",
  minor_revision: "Minor Revision Required",
  accepted: "Accepted for Publication",
  rejected: "Rejected",
  published: "Published",
};

const STATUS_COLORS: Record<string, string> = {
  received: "#6c757d",
  screening: "#0d6efd",
  peer_review: "#0dcaf0",
  major_revision: "#fd7e14",
  minor_revision: "#ffc107",
  accepted: "#198754",
  rejected: "#dc3545",
  published: "#6f42c1",
};

async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpPass) return false;
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.in",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true,
      auth: { user: process.env.SMTP_USER || "medicalvanguard@zohomail.in", pass: smtpPass },
    });
    await transporter.sendMail({
      from: '"Medical Vanguard" <medicalvanguard@zohomail.in>',
      ...opts,
    });
    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, authorEmail, authorName, title, status, editorNote } = body;

    if (!submissionId || !authorEmail || !title || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const label = STATUS_LABELS[status] || status;
    const color = STATUS_COLORS[status] || "#1a3a6b";
    const name = authorName || "Author";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1a3a6b;padding:24px;text-align:center">
          <h1 style="color:white;margin:0;font-size:22px">Medical Vanguard</h1>
          <p style="color:#a8c4e0;margin:4px 0 0">Editorial Office Notification</p>
        </div>
        <div style="padding:28px;background:#fafafa;border:1px solid #e0e0e0">
          <p style="font-size:16px">Dear ${name},</p>
          <p>We are writing to inform you of an update regarding your manuscript submission to <strong>Medical Vanguard</strong>.</p>
          <div style="background:white;border-radius:8px;border:2px solid ${color};padding:20px;margin:20px 0;text-align:center">
            <p style="margin:0 0 8px;color:#555;font-size:13px">SUBMISSION ID</p>
            <p style="margin:0 0 16px;font-size:20px;font-weight:bold;font-family:monospace;color:#1a3a6b">${submissionId}</p>
            <p style="margin:0 0 8px;color:#555;font-size:13px">CURRENT STATUS</p>
            <div style="display:inline-block;background:${color};color:white;padding:8px 24px;border-radius:20px;font-size:16px;font-weight:bold">${label}</div>
          </div>
          <p style="color:#444"><strong>Manuscript:</strong> ${title}</p>
          ${editorNote ? `<div style="background:#fff8e1;border-left:4px solid #ffc107;padding:14px;border-radius:4px;margin:16px 0"><p style="margin:0 0 6px;font-weight:bold;color:#555">Note from Editorial Office:</p><p style="margin:0">${editorNote}</p></div>` : ""}
          <p>You can track your manuscript status at any time at:<br/><a href="https://medical-vanguard.vercel.app/track" style="color:#1a3a6b">medical-vanguard.vercel.app/track</a></p>
          <p>For any queries, please contact us at <a href="mailto:medicalvanguard@zohomail.in">medicalvanguard@zohomail.in</a>.</p>
          <p>Best regards,<br/><strong>Editorial Office</strong><br/>Medical Vanguard</p>
        </div>
        <div style="padding:12px;text-align:center;font-size:11px;color:#999">
          Medical Vanguard | 566 College Road, Mahasamund, CG 493445
        </div>
      </div>
    `;

    const sent = await sendEmail({
      to: authorEmail,
      subject: `Manuscript Status Update [${submissionId}]: ${label} | Medical Vanguard`,
      html,
    });

    return NextResponse.json({
      success: true,
      emailSent: sent,
      status: label,
      message: sent
        ? `Status update email sent to ${authorEmail}`
        : "Status recorded. (Email not sent — SMTP not configured)",
    });
  } catch (err) {
    console.error("Status update error:", err);
    return NextResponse.json({ error: "Failed to send status update" }, { status: 500 });
  }
}
