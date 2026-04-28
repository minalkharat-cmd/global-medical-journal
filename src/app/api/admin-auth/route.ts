import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

export async function POST(request: NextRequest) {
  let body: Record<string, string> = {};
  try {
    const text = await request.text();
    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }
    body = JSON.parse(text);
  } catch (_) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { password } = body;
  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "mv-admin-2025";
  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    token: adminPassword,
    message: "Authentication successful",
  });
}
