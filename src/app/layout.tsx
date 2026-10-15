import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { ScrollProgress } from "@/components/scroll-progress";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

// Evaluated once when the module loads at build time. Calling `new Date()`
// inside the component instead makes the page dynamic under Next 16's Cache
// Components, which would opt the whole route out of static prerendering.
const buildYear = new Date().getFullYear();

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.role}`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.role}`,
    description: siteConfig.description,
    url: siteConfig.url,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes sets the class on <html> before paint, which the server
    // render can't predict, so this tells React not to warn about it.
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">
        <JsonLd />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <a
            href="#home"
            className="focus:bg-card sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          {/* The wash starts at the very top of the document rather than
              inside the hero, so it sits behind the sticky header instead of
              beginning underneath it with a visible seam. */}
          <div
            aria-hidden
            className="bg-hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[75vh]"
          />
          {/* Barely-there film grain so the large flat areas are not dead
              pixels. Fixed and non-interactive, costs nothing to paint. */}
          <div
            aria-hidden
            className="bg-grain pointer-events-none fixed inset-0 z-100 opacity-[0.025] mix-blend-overlay"
          />
          <ScrollProgress />
          <Header />
          <main>{children}</main>
          <footer className="border-border border-t px-4 py-10 sm:px-6">
            <div className="text-muted mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-sm">
              <p>
                © {buildYear} {siteConfig.name}
              </p>
              <p>Built with Next.js & Tailwind CSS</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
