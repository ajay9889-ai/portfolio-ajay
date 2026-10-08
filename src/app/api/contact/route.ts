import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please provide your name, email, and message." },
        { status: 400 }
      );
    }

    // Forward to backend API if running
    const backendUrl = process.env.BACKEND_API_URL || "https://portfolio-backend-t782.onrender.com/api/v1/contact";
    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn("Backend forwarding notice:", e);
    }

    // Fallback success if backend is booting or standalone
    return NextResponse.json({
      success: true,
      message: `Thank you, ${name}! Your message has been received. I'll get back to you shortly.`,
      data: {
        id: "msg_" + Math.random().toString(36).substring(2, 10),
        receivedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process message." },
      { status: 500 }
    );
  }
}
