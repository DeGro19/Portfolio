import { getPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

// Minimal XML escaping. Post titles are ours, but an unescaped ampersand
// still produces an invalid feed.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = await getPosts();
  const feedUrl = `${siteConfig.url}/writing/rss.xml`;

  const items = posts
    .map((post) =>
      [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${siteConfig.url}/writing/${post.slug}</link>`,
        `      <guid isPermaLink="true">${siteConfig.url}/writing/${post.slug}</guid>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        "    </item>",
      ].join("\n"),
    )
    .join("\n");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(`${siteConfig.name} - Writing`)}</title>`,
    `    <link>${siteConfig.url}/writing</link>`,
    `    <description>${escapeXml(siteConfig.description)}</description>`,
    "    <language>en-GB</language>",
    `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
