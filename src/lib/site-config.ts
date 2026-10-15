// Single source of truth for everything personal on the site.
// Edit this file rather than hunting through components.

export const siteConfig = {
  name: "Deon Grover",
  role: "CyberSecurity Analyst",
  // Rotated by the hero typewriter.
  taglines: [
    "CyberSecurity Analyst",
    "Offensive Security Researcher",
    "Azure Developer Associate",
  ],
  location: "London, UK",
  available: true,
  // Shown in the hero badge, joined with the location. Add or remove entries
  // here rather than editing the markup.
  availability: ["Open to Security Analyst roles", "Available to relocate"],
  email: "grover.deon@outlook.com",
  resumeUrl: "/resume.pdf",
  // Drop a photo at public/portrait.jpg and set this to "/portrait.jpg" to
  // show it in the About section. Empty string hides the whole block.
  portrait: "",
  github: "https://github.com/DeGro19",
  linkedin: "https://www.linkedin.com/in/deon-grover-447273291",
  // Used for <title>, Open Graph tags and the sitemap.
  url: "https://example.com",
  description:
    "Cybersecurity graduate specialising in vulnerability detection, offensive security tooling and cloud application security.",
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "projects", label: "Projects" },
] as const;
