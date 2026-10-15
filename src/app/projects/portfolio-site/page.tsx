import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Pill } from "@/components/pill";
import { Reveal } from "@/components/reveal";
import { portfolioCaseStudy as study } from "@/lib/portfolio-case-study";

export const metadata: Metadata = {
  title: study.title,
  description: study.summary,
};

export default function PortfolioCaseStudyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link
        href="/#projects"
        className="text-muted hover:text-accent inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to projects
      </Link>

      <header className="mt-8">
        <p className="text-accent font-mono text-sm">{study.subtitle}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tighter text-balance sm:text-5xl">
          {study.title}
        </h1>
        <p className="text-muted mt-6 text-lg text-pretty">{study.summary}</p>

        <a
          href={study.repo}
          target="_blank"
          rel="noreferrer"
          className="border-border hover:border-accent hover:text-accent mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
        >
          <SiGithub className="size-4" aria-hidden />
          Read the source
        </a>
      </header>

      <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {study.headline.map((stat) => (
          <li key={stat.label} className="surface p-5">
            <p className="text-accent text-2xl font-bold tracking-tight">
              {stat.value}
            </p>
            <p className="text-muted mt-1 text-sm text-pretty">{stat.label}</p>
          </li>
        ))}
      </ul>

      <figure className="mt-14">
        {/* Light-background report, so it keeps a white plate in dark mode
            rather than being inverted into something unreadable. */}
        <div className="surface overflow-hidden bg-white p-3">
          <Image
            src={study.scan.src}
            alt={study.scan.alt}
            width={study.scan.width}
            height={study.scan.height}
            sizes="(min-width: 768px) 42rem, 100vw"
            className="h-auto w-full rounded"
            priority
          />
        </div>
        <figcaption className="text-muted mt-4 text-sm text-pretty">
          Scan this site yourself at securityheaders.com. The grade is not a
          claim, it is reproducible.
        </figcaption>
      </figure>

      {study.sections.map((section) => (
        <Reveal key={section.heading}>
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight">
              {section.heading}
            </h2>
            <div className="text-muted mt-5 space-y-4 text-pretty">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        </Reveal>
      ))}

      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight">Stack</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {study.stack.map((item) => (
            <li key={item}>
              <Pill>{item}</Pill>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
