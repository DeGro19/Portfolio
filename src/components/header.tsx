"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Contact, Mail, Menu, X } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { navItems, siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [active, setActive] = useState<string>(navItems[0].id);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Highlight whichever section currently sits in the middle band of the
  // viewport. Cheaper and smoother than a scroll listener recalculating
  // offsets on every frame.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const topmost = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (topmost) setActive(topmost.target.id);
      },
      { rootMargin: "-50% 0px -45% 0px", threshold: [0, 0.3, 0.6, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // A one-pixel sentinel above the sticky header tells us whether the page has
  // moved at all, again without a scroll listener.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      <header className="sticky top-0 z-50">
        {/* The backdrop is a separate layer that overhangs the header and is
            masked to fade out at the bottom. A plain `border-b` with a solid
            fill cut a hard line straight across the dot pattern; this lets the
            page dissolve under the bar instead of hitting an edge. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-[calc(100%+2.5rem)] transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="bg-background/75 absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0,black_58%,transparent_100%)] backdrop-blur-xl" />
          {/* Hairline that fades out towards both ends rather than running
              edge to edge. */}
          <div className="via-border absolute inset-x-0 top-16 h-px bg-gradient-to-r from-transparent to-transparent" />
        </div>

        <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
          <Link
            href="#home"
            className="group flex items-baseline gap-1.5 text-lg font-bold tracking-tight"
          >
            {siteConfig.name.split(" ")[0]}
            <span className="bg-accent size-1.5 rounded-full transition-transform duration-300 group-hover:scale-150" />
          </Link>

          <nav aria-label="Sections" className="ml-8 hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <NavLink
                    id={item.id}
                    label={item.label}
                    isActive={active === item.id}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <IconLink href={`mailto:${siteConfig.email}`} label="Email">
                <Mail className="size-[18px]" aria-hidden />
              </IconLink>
              <IconLink href={siteConfig.github} label="GitHub">
                <SiGithub className="size-[18px]" aria-hidden />
              </IconLink>
              <IconLink href={siteConfig.linkedin} label="LinkedIn">
                <Contact className="size-[18px]" aria-hidden />
              </IconLink>
            </div>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="border-border bg-card hover:border-accent hover:text-accent grid size-9 place-items-center rounded-full border transition-colors md:hidden"
            >
              {menuOpen ? (
                <X className="size-[18px]" aria-hidden />
              ) : (
                <Menu className="size-[18px]" aria-hidden />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label="Sections"
            className="border-border bg-background/95 relative border-t backdrop-blur-xl md:hidden"
          >
            <ul className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active === item.id ? "true" : undefined}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      active === item.id
                        ? "text-accent bg-accent/10"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}

function NavLink({
  id,
  label,
  isActive,
}: {
  id: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={`#${id}`}
      aria-current={isActive ? "true" : undefined}
      className={`relative rounded-lg px-3 py-2 text-sm font-medium ${
        isActive ? "text-foreground" : "text-muted hover:text-foreground"
      }`}
    >
      {label}
      <span
        aria-hidden
        className={`bg-accent absolute inset-x-3 -bottom-px h-px origin-left transition-transform duration-300 ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="text-muted hover:border-accent hover:text-accent border-border grid size-9 place-items-center rounded-full border transition-colors"
    >
      {children}
    </a>
  );
}
