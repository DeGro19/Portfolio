import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site-config";

const isProduction = process.env.NODE_ENV === "production";

/**
 * The client IP, or null when it cannot be determined.
 *
 * Returning a constant placeholder here would be a bug: every visitor would
 * share one bucket, so five submissions from anyone would lock out everyone.
 * Callers decide what to do when it is null instead.
 */
function clientIp(request: Request): string | null {
  // Vercel sets x-forwarded-for; take the first hop, which is the client.
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || real?.trim() || null;
}

const LOOPBACK = new Set(["::1", "127.0.0.1", "::ffff:127.0.0.1"]);

/**
 * `next dev` sets x-forwarded-for to ::1, so every local request shares one
 * bucket. That is technically correct, since it really is one client, but it
 * means a handful of test submissions locks you out of your own form for
 * fifteen minutes. Loopback is exempt in development only; in production a
 * loopback client IP would mean the proxy is misconfigured, so it is still
 * limited there.
 */
function shouldRateLimit(ip: string): boolean {
  return isProduction || !LOOPBACK.has(ip);
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  if (ip && shouldRateLimit(ip)) {
    const { allowed, retryAfterSeconds } = rateLimit(ip);
    if (!allowed) {
      return Response.json(
        { error: "Too many messages. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
      );
    }
  } else if (isProduction) {
    // No client IP in production means the proxy is misconfigured. Fail
    // closed onto a shared bucket rather than dropping the protection.
    console.warn(
      "No client IP header on a contact request; using shared bucket.",
    );
    const { allowed, retryAfterSeconds } = rateLimit("no-ip");
    if (!allowed) {
      return Response.json(
        { error: "Too many messages. Please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
      );
    }
  }
  // Locally there is no proxy and therefore no IP, so rate limiting is
  // skipped entirely. Otherwise every request on localhost would share one
  // bucket and five submissions would block all further local testing.

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

  const { name, email, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (!isProduction) {
      // Local development without a key: log the message so the whole
      // success path stays testable without signing up for anything.
      console.info(
        `[contact] would send to ${siteConfig.email}
  from: ${name} <${email}>
  ${message}`,
      );
      return Response.json({ ok: true });
    }

    // In production this is a misconfiguration: a server problem, not the
    // visitor's fault, and the response must not hint at the internal cause.
    console.error("RESEND_API_KEY is not set; contact form cannot send.");
    return Response.json(
      { error: "Unable to send right now. Please email me directly." },
      { status: 503 },
    );
  }

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
