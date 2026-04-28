import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Validates MV-YYYYMM-XXXXXX format
function isValidId(id: string): boolean {
  return /^MV-\d{6}-[A-Z0-9]{6}$/.test(id.trim().toUpperCase());
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const submissionId = searchParams.get("id")?.trim().toUpperCase();

  if (!submissionId) {
    return NextResponse.json(
      { error: "Please provide a submission ID (e.g. ?id=MV-202604-XXXXXX)" },
      { status: 400 }
    );
  }

  if (!isValidId(submissionId)) {
    return NextResponse.json(
      {
        error: "Invalid submission ID format.",
        hint: "Submission IDs follow the format MV-YYYYMM-XXXXXX (e.g. MV-202604-AB12CD). Check your acknowledgement email.",
      },
      { status: 404 }
    );
  }

  // Since we have no persistent DB on Vercel free tier, we confirm the ID
  // format is valid and direct authors to contact the editorial office.
  // The editor receives full submission details by email on every submission.
  return NextResponse.json({
    submissionId,
    status: "received",
    statusLabel: "Received — Under Editorial Review",
    message:
      "Your submission has been received by Medical Vanguard. The editorial office will contact you by email as your manuscript progresses through review. If you have not received an acknowledgement email within 24 hours, please contact medicalvanguard@zohomail.in with your Submission ID.",
    contact: "medicalvanguard@zohomail.in",
    expectedTimeline: {
      initialScreening: "5–7 business days",
      peerReview: "4–8 weeks",
      finalDecision: "8–12 weeks",
    },
  });
}
