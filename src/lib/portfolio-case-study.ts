// The site itself, written up as a project. Figures here are verifiable by
// anyone: rescan the URL, or read the repository.

export const portfolioCaseStudy = {
  title: "Interactive CV Website",
  subtitle: "This site",
  repo: "https://github.com/DeGro19/portfolio",
  summary:
    "The site you are reading. Built from scratch rather than from a template, so that it works as a demonstration instead of a description: the headers are hardened, the contact form is defended, the decisions are documented, and the code is public.",
  headline: [
    { value: "A", label: "securityheaders.com grade" },
    { value: "7", label: "Hardened response headers" },
    { value: "14", label: "Tests, run on every push" },
    { value: "0", label: "Templates used" },
  ],
  scan: {
    src: "/projects/portfolio/security-headers-scan.png",
    width: 1104,
    height: 447,
    alt: "securityheaders.com report showing grade A with Content-Security-Policy, Permissions-Policy, Referrer-Policy, Strict-Transport-Security, X-Content-Type-Options and X-Frame-Options all present",
  },
  sections: [
    {
      heading: "Why it is an A and not an A+",
      body: [
        "The single warning on that report is 'unsafe-inline' in the script-src directive. That is a deliberate trade, not an oversight.",
        "An A+ requires a nonce-based Content Security Policy, where every inline script carries a fresh random token. Nonces must be generated per request, which forces dynamic rendering. This site uses Partial Prerendering and is served as static HTML, and Next.js documents the two as incompatible. React's hydration payload and the theme script that runs before first paint are both inline, so the choice was a faster site at grade A or a slower site at A+.",
        "The upgrade path is hash-based CSP using Subresource Integrity, which keeps static generation by hashing scripts at build time. It is still marked experimental, so it is not in production.",
      ],
    },
    {
      heading: "Defending the contact form",
      body: [
        "Three independent layers, because any one alone is weak. A Zod schema shared by the browser and the server, so the two cannot disagree; the server revalidates because anything a browser sends can be forged. A honeypot field hidden from users and assistive technology. Rate limiting, applied before validation so malformed floods are counted too.",
        "The honeypot detail matters more than it looks. The schema deliberately accepts a filled honeypot rather than rejecting it: returning a validation error would tell a bot the field is a trap. The route returns success and discards the message instead. That bug was caught by testing the endpoint with curl, not by reading the code.",
        "The limiter holds state in process memory, so on serverless the limit is per instance rather than global. That is honest about its ceiling: adequate for a portfolio, inadequate for anything with real abuse exposure, which needs shared state in Redis or Vercel KV.",
      ],
    },
    {
      heading: "A bug that only CI could find",
      body: [
        "Next generates route types into a build directory. Local development had already created them, so typechecking passed on my machine and failed on a clean checkout with 'Cannot find name PageProps'. The pipeline caught it on the first push.",
        "Fixed by generating types as part of the typecheck script, and verified by deleting the build directory to reproduce a clean checkout. It is a small bug, but it is the precise answer to why continuous integration is worth it on a one-person project.",
      ],
    },
    {
      heading: "Accessibility and motion",
      body: [
        "Semantic landmarks, a skip link, visible focus rings, and aria-current on the active navigation item. The animated hero text is hidden from screen readers with the full list exposed once, so assistive technology is not read one character at a time.",
        "Every animation checks prefers-reduced-motion. The typewriter renders static text, scroll-triggered reveals are skipped, smooth scrolling is disabled and transitions collapse.",
      ],
    },
  ],
  stack: [
    "Next.js 16 (App Router)",
    "TypeScript",
    "Tailwind CSS v4",
    "React",
    "Zod",
    "Vitest",
    "GitHub Actions",
    "Vercel",
  ],
} as const;
