import { NextResponse, NextRequest } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const TO_EMAIL = "crypcal@mail.com";
const FROM_EMAIL = "CrypCal Feedback <no-reply@calccrypto.com>";

export async function POST(request: NextRequest) {
  try {
    const { message, email } = (await request.json()) as {
      message?: string;
      email?: string;
    };

    const trimmedMessage = (message ?? "").trim();
    const trimmedEmail = (email ?? "").trim();

    if (!trimmedMessage) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    if (!resend) {
      console.error("[feedback] Missing RESEND_API_KEY");
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 },
      );
    }

    const subject = "CrypCal feedback / calculator idea";

    const bodyLines = [
      trimmedMessage,
      "",
      trimmedEmail ? `Reply email (optional): ${trimmedEmail}` : "",
    ].filter(Boolean);

    const text = bodyLines.join("\n");

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[feedback] Error sending email", error);
    return NextResponse.json(
      { error: "Unable to send feedback right now." },
      { status: 500 },
    );
  }
}

