import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function generateSubmissionId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MV-${year}${month}-${rand}`;
}

async function sendEmail(opts: {
  to: string; subject: string; html: string;
}) {
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
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const institution = formData.get("institution") as string;
    const country = formData.get("country") as string;
    const coAuthors = formData.get("coAuthors") as string || "";
    const title = formData.get("title") as string;
    const manuscriptType = formData.get("manuscriptType") as string;
    const specialty = formData.get("specialty") as string;
    const wordCount = formData.get("wordCount") as string;
    const abstract = formData.get("abstract") as string;
    const keywords = formData.get("keywords") as string;

    if (!name || !email || !institution || !title || !abstract || !manuscriptType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const submissionId = generateSubmissionId();
    const submittedAt = new Date().toISOString();

    // Email to editor with full submission details
    const editorEmail = process.env.NOTIFY_EMAIL || "medicalvanguard@zohomail.in";
    await sendEmail({
      to: editorEmail,
      subject: `[NEW SUBMISSION] ${submissionId} — ${title}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto">
          <h2 style="color:#1a3a6b">New Manuscript Submission</h2>
          <p><strong>Submission ID:</strong> <code style="background:#f0f4ff;padding:2px 6px;border-radius:4px">${submissionId}</code></p>
          <p><strong>Submitted:</strong> ${new Date(submittedAt).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})}</p>
          <hr/>
          <h3>Author Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Institution:</strong> ${institution}</p>
          <p><strong>Country:</strong> ${country}</p>
          ${coAuthors ? `<p><strong>Co-Authors:</strong> ${coAuthors}</p>` : ""}
          <hr/>
          <h3>Manuscript Details</h3>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Type:</strong> ${manuscriptType}</p>
          <p><strong>Specialty:</strong> ${specialty}</p>
          <p><strong>Word Count:</strong> ${wordCount}</p>
          <p><strong>Keywords:</strong> ${keywords}</p>
          <h4>Abstract:</h4>
          <div style="background:#f9f9f9;border-left:4px solid #1a3a6b;padding:12px;font-size:14px">${abstract}</div>
          <hr/>
          <p style="font-size:12px;color:#888">Use Submission ID <strong>${submissionId}</strong> in the Editor Dashboard to run AI screening and assign reviewers.</p>
        </div>
      `,
    });

    // Acknowledgement email to author
    await sendEmail({
      to: email,
      subject: `Submission Received — ${submissionId} | Medical Vanguard`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1a3a6b">Submission Received</h2>
          <p>Dear ${name},</p>
          <p>Thank you for submitting your manuscript to <strong>Medical Vanguard</strong>. We have received your submission and it will undergo initial screening within 5–7 business days.</p>
          <div style="background:#f0f4ff;border-radius:8px;padding:16px;margin:16px 0">
            <p style="margin:4px 0"><strong>Submission ID:</strong> <code>${submissionId}</code></p>
            <p style="margin:4px 0"><strong>Title:</strong> ${title}</p>
            <p style="margin:4px 0"><strong>Type:</strong> ${manuscriptType}</p>
            <p style="margin:4px 0"><strong>Specialty:</strong> ${specialty}</p>
          </div>
          <p>Please save your Submission ID — you can use it to track your manuscript status at <a href="https://medical-vanguard.vercel.app/track">medical-vanguard.vercel.app/track</a>.</p>
          <p>If you have any questions, contact us at <a href="mailto:medicalvanguard@zohomail.in">medicalvanguard@zohomail.in</a>.</p>
          <p>Best regards,<br/><strong>Editorial Office</strong><br/>Medical Vanguard</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      submissionId,
      message: "Submission received. You will receive a confirmation email shortly.",
    });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json(
      { error: "Submission failed. Please try again." },
      { status: 500 }
    );
  }
}
