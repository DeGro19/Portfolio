import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site-config";

function clientKey(request: Request): string {
  // Vercel sets x-forwarded-for; take the first hop, which is the client.
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const { allowed, retryAfterSeconds } = rateLimit(clientKey(request));
  if (!allowed) {
    return Response.json(
      { error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  // Honeypot tripped. Return success so the bot has no signal to learn from.
  if (parsed.data.website) {
    return Response.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Misconfiguration is a server problem, not the visitor's fault, and the
    // response must not hint at the internal cause.
    console.error("RESEND_API_KEY is not set; contact form cannot send.");
    return Response.json(
      { error: "Unable to send right now. Please email me directly." },
      { status: 503 },
    );
  }

  const { name, email, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: siteConfig.email,
      replyTo: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    if (error) {
      console.error("Resend rejected the message:", error);
      return Response.json(
        { error: "Unable to send right now. Please email me directly." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch (cause) {
    console.error("Contact form failed:", cause);
    return Response.json(
      { error: "Unable to send right now. Please email me directly." },
      { status: 500 },
    );
  }
}
