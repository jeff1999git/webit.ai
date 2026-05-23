import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const whatsapp = String(body.whatsapp ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (name.length > 100 || message.length > 5000 || whatsapp.length > 20) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Contact Form <onboarding@resend.dev>",
    to: "jeffdevelop1@gmail.com",
    subject: "WebitAi — New Message",
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      whatsapp ? `WhatsApp: ${whatsapp}` : null,
      ``,
      `Message:`,
      message,
    ]
      .filter((l) => l !== null)
      .join("\n"),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
