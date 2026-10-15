import { Suspense } from "react";
import {
  ArrowRight,
  Award,
  ChevronDown,
  Download,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";
import { GithubRepos } from "@/components/github-repos";
import { Pill } from "@/components/pill";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { Typewriter } from "@/components/typewriter";
import {
  about,
  certifications,
  education,
  extracurricular,
  projects,
  skills,
} from "@/lib/cv-data";
import { siteConfig } from "@/lib/site-config";

export default function HomePage() {
  return (
    <>
      <section
        id="home"
        aria-label="Introduction"
        className="relative isolate flex min-h-[calc(100svh-4rem)] scroll-mt-20 items-center overflow-hidden px-4 sm:px-6"
      >
        <div className="mx-auto w-full max-w-3xl py-24 text-center">
          {siteConfig.available && (
            <p className="surface text-muted inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full px-3.5 py-1.5 text-sm backdrop-blur">
              <span className="relative flex size-2 shrink-0">
                <span className="bg-accent absolute inline-flex size-full animate-ping rounded-full opacity-60" />
                <span className="bg-accent relative inline-flex size-2 rounded-full" />
              </span>
              {[...siteConfig.availability, siteConfig.location].join(" · ")}
            </p>
          )}

          <h1 className="from-foreground to-foreground/55 mt-7 bg-gradient-to-br bg-clip-text text-5xl font-bold tracking-tighter text-balance text-transparent sm:text-7xl">
            {siteConfig.name}
          </h1>

          <p className="mt-4 text-2xl font-semibold sm:text-4xl">
            <Typewriter
              words={siteConfig.taglines}
              className="from-accent to-accent-soft bg-gradient-to-r bg-clip-text text-transparent"
            />
          </p>

          <p className="text-muted mx-auto mt-7 max-w-xl text-lg text-pretty">
            {siteConfig.description}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href="#projects"
              className="bg-accent group inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              View my work
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="surface hover:border-accent hover:text-accent inline-flex items-center rounded-full px-6 py-3 font-medium backdrop-blur transition-colors"
            >
              Get in touch
            </a>
          </div>
        </div>

        <a
          href="#about"
          aria-label="Scroll to About"
          className="text-muted hover:text-accent absolute inset-x-0 bottom-8 mx-auto grid size-10 place-items-center transition-colors"
        >
          <ChevronDown className="size-5 animate-bounce" aria-hidden />
        </a>
      </section>

      <Section id="about" title="About" index={1}>
        <div
          className={
            siteConfig.portrait
              ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start"
              : undefined
          }
        >
          <div className="surface text-muted space-y-5 p-6 text-lg text-pretty sm:p-8">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {siteConfig.portrait && (
            <figure className="surface overflow-hidden lg:sticky lg:top-24">
              <Image
                src={siteConfig.portrait}
                alt={`${siteConfig.name}, ${siteConfig.role}`}
                width={544}
                height={680}
                sizes="(min-width: 1024px) 17rem, 100vw"
                className="h-auto w-full object-cover"
                priority={false}
              />
            </figure>
          )}
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {about.highlights.map((highlight) => (
            <li key={highlight.label} className="surface p-5">
              <p className="text-accent text-3xl font-bold tracking-tight">
                {highlight.value}
              </p>
              <p className="mt-1 font-medium">{highlight.label}</p>
              <p className="text-muted mt-1 text-sm text-pretty">
                {highlight.detail}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="resume" title="Resume" index={2}>
        <a
          href={siteConfig.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="surface hover:border-accent hover:text-accent mb-12 inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-colors"
        >
          <Download className="size-4" aria-hidden />
          Download full CV (PDF)
        </a>

        <h3 className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <GraduationCap className="text-accent size-5" aria-hidden />
          Education
        </h3>
        <div className="surface mt-5 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-lg font-semibold">{education.institution}</p>
            <p className="text-muted font-mono text-sm">{education.period}</p>
          </div>
          <p className="text-muted mt-1">{education.degree}</p>
          <p className="text-accent mt-1 font-medium">{education.grade}</p>
          <ul className="text-muted mt-5 space-y-2.5">
            {education.points.map((point) => (
              <li key={point} className="flex gap-3 text-pretty">
                <span
                  aria-hidden
                  className="bg-accent mt-2.5 size-1.5 shrink-0 rounded-full"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <h3 className="mt-14 flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <Award className="text-accent size-5" aria-hidden />
          Certifications
        </h3>
        <div className="mt-5 space-y-4">
          {certifications.map((group) => (
            <div key={group.issuer} className="surface p-6">
              <p className="font-semibold">{group.issuer}</p>
              <ul className="text-muted mt-4 space-y-3">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <p className="text-foreground font-medium">{item.name}</p>
                    {"detail" in item && item.detail && (
                      <p className="mt-1 text-sm text-pretty">{item.detail}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="mt-14 text-xl font-bold tracking-tight">
          Technical skills
        </h3>
        <dl className="mt-5 space-y-6">
          {skills.map((group) => (
            <div key={group.category}>
              <dt className="text-muted mb-3 font-mono text-sm">
                {group.category}
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Pill>{item}</Pill>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-14 text-xl font-bold tracking-tight">
          Beyond the degree
        </h3>
        <ul className="mt-5 space-y-4">
          {extracurricular.map((entry) => (
            <li key={entry.name} className="surface p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{entry.name}</p>
                <p className="text-muted font-mono text-sm">{entry.period}</p>
              </div>
              <p className="text-muted mt-2 text-pretty">{entry.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="projects" title="Projects" index={3}>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <Suspense fallback={null}>
          <GithubRepos />
        </Suspense>
      </Section>
    </>
  );
}
