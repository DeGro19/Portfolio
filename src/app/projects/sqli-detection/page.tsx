import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Reveal } from "@/components/reveal";
import { sqliCaseStudy as study } from "@/lib/sqli-case-study";

export const metadata: Metadata = {
  title: study.title,
  description: study.summary,
};

export default function SqliCaseStudyPage() {
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
          Repository and raw results
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

      <section className="mt-16" aria-labelledby="method">
        <h2 id="method" className="text-2xl font-bold tracking-tight">
          Method
        </h2>
        <ul className="text-muted mt-6 space-y-3">
          {study.method.map((item) => (
            <li key={item} className="flex gap-3 text-pretty">
              <span
                aria-hidden
                className="bg-accent mt-2.5 size-1.5 shrink-0 rounded-full"
              />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="results">
        <h2 id="results" className="text-2xl font-bold tracking-tight">
          Results
        </h2>
        <div className="mt-6 space-y-10">
          {study.charts.map((chart) => (
            <Reveal key={chart.src}>
              <figure>
                <h3 className="text-lg font-semibold">{chart.title}</h3>
                {/* The charts are dark text on white, so they keep a white
                    plate in dark mode rather than being inverted. */}
                <div className="surface mt-4 overflow-hidden bg-white p-4">
                  <Image
                    src={chart.src}
                    alt={chart.alt}
                    width={600}
                    height={500}
                    sizes="(min-width: 768px) 42rem, 100vw"
                    className="mx-auto h-auto w-full max-w-xl"
                  />
                </div>
                <figcaption className="text-muted mt-4 text-pretty">
                  {chart.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="outcomes">
        <h2 id="outcomes" className="text-2xl font-bold tracking-tight">
          Outcomes
        </h2>
        <ul className="text-muted mt-6 space-y-3">
          {study.outcomes.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden
                className="bg-accent mt-2.5 size-1.5 shrink-0 rounded-full"
              />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <aside className="surface mt-16 p-6">
        <h2 className="flex items-center gap-2.5 font-semibold">
          <ShieldAlert className="text-accent size-5" aria-hidden />
          Scope and authorisation
        </h2>
        <p className="text-muted mt-3 text-pretty">
          Every scan in this project ran against an isolated WebGoat container
          built for the purpose. Fuzzing a system you do not own, without
          written authorisation covering scope, dates and targets, risks
          prosecution under the Computer Misuse Act 1990. The repository ships
          with the rules of engagement that were followed.
        </p>
      </aside>
    </article>
  );
}
