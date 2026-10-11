import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { addContact } from "@/lib/adminData";

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

    // 1. Instantly persist to admin dashboard store
    try {
      addContact({ name, email, subject: "Portfolio Contact", message });
    } catch (storeErr) {
      console.error("[Contact Form] Failed to save contact to admin store:", storeErr);
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const notifyEmail = process.env.OWNER_NOTIFY_EMAIL || smtpUser || "ajayhasrb123@gmail.com";

    let emailSent = false;

    // 2. Send direct Gmail notification if credentials exist (with strict 6s timeout)
    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          socketTimeout: 5000,
        });

        const htmlBody = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0E0E12; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; overflow: hidden; color: #ECEBE7;">
            <div style="background: linear-gradient(135deg, #FF5500, #FF7A00); padding: 24px 28px;">
              <h2 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700;">📬 New Message from Portfolio</h2>
            </div>
            <div style="padding: 28px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #8B8B95; font-size: 13px; width: 70px;">From:</td>
                  <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #8B8B95; font-size: 13px;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #FF7A00; text-decoration: none; font-size: 14px;">${email}</a></td>
                </tr>
              </table>
              <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 18px;">
                <p style="margin: 0; color: #E0E0E8; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08);">
                <p style="margin: 0; color: #666; font-size: 12px; font-family: monospace;">
                  Received at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
                </p>
              </div>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"Portfolio Contact Form" <${smtpUser}>`,
          to: notifyEmail,
          replyTo: email,
          subject: `💬 New Message from ${name} (${email})`,
          html: htmlBody,
        });

        emailSent = true;
        console.log(`[Contact Form] ✅ Email delivered to ${notifyEmail}`);
      } catch (mailErr) {
        console.error("[Contact Form] ⚠️ Nodemailer delivery error:", mailErr);
      }
    }

    // 3. Non-blocking forward to Render backend (never blocks user response or causes timeout)
    const backendUrl = process.env.BACKEND_API_URL || "https://portfolio-backend-yxfu.onrender.com/api/v1/contact";
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
        signal: controller.signal,
      }).catch(() => {}).finally(() => clearTimeout(timer));
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      emailSent,
      message: `Thank you, ${name}! Your message was successfully received. I typically respond within 24 hours.`,
      data: {
        id: "msg_" + Math.random().toString(36).substring(2, 10),
        receivedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("Contact API Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process message." },
      { status: 500 }
    );
  }
}
