import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (token !== "mv-admin-2025") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  try {
    const data = await request.json();
    const smtpPass = process.env.SMTP_PASS;
    if (smtpPass) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.zoho.in",
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: true,
        auth: { user: process.env.SMTP_USER, pass: smtpPass },
      });
      await transporter.sendMail({
        from: `"Medical Vanguard" <${process.env.SMTP_USER}>`,
        to: process.env.NOTIFY_EMAIL,
        subject: `New Reviewer Application: ${data.name} — ${data.specialties?.join(", ")}`,
        text: `NEW REVIEWER APPLICATION\n${"=".repeat(40)}\nName: ${data.name}\nEmail: ${data.email}\nInstitution: ${data.institution}\nCountry: ${data.country}\nDegree: ${data.degree}\nExperience: ${data.experience}\nORCID: ${data.orcid || "Not provided"}\nSpecialties: ${data.specialties?.join(", ")}\nAvailability: ${data.availability}\nMotivation:\n${data.motivation}\n${"=".repeat(40)}`,
      });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: true }, { status: 201 });
  }
}
