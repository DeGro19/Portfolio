import { siteConfig } from "@/lib/site-config";

/**
 * RFC 9116 security.txt. Served from a route handler rather than a static file
 * so the canonical URL stays derived from one source of truth.
 */

// RFC 9116 requires an expiry. Roll this forward when it lapses; a stale
// security.txt is worse than none.
const EXPIRES = "2027-10-15T00:00:00.000Z";

// A Response cannot cross a "use cache" boundary, so only the body is cached.
async function buildSecurityTxt(): Promise<string> {
  "use cache";

  return [
    `Contact: mailto:${siteConfig.email}`,
    `Expires: ${EXPIRES}`,
    "Preferred-Languages: en",
    `Canonical: ${siteConfig.url}/.well-known/security.txt`,
    "",
    "# Thanks for taking the time to look. This is a personal portfolio site",
    "# with no user accounts and no data to exfiltrate, but reports of any",
    "# kind are welcome and will get a reply.",
    "",
  ].join("\n");
}

export async function GET() {
  return new Response(await buildSecurityTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
