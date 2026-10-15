import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { Pill } from "./pill";

type Project = {
  title: string;
  subtitle: string;
  summary: string;
  points: readonly string[];
  tech: readonly string[];
  repo?: string;
  demo?: string;
  certificate?: string;
  caseStudy?: string;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  // Full-width evidence shot, shown under the summary.
  banner?: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
};

export function ProjectCard({ project }: { project: Project }) {
  const hasLinks =
    project.caseStudy || project.repo || project.demo || project.certificate;

  return (
    <article className="surface hover:border-accent/40 p-6 transition-[transform,border-color,box-shadow] duration-300 motion-safe:hover:-translate-y-1 sm:p-8">
      <header className="flex items-start gap-5">
        <div className="min-w-0 flex-1">
          <p className="text-accent font-mono text-sm">{project.subtitle}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-balance">
            {project.title}
          </h3>
          <p className="text-muted mt-3 text-pretty">{project.summary}</p>
        </div>

        {project.image && (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="128px"
            className="hidden size-28 shrink-0 object-contain sm:block"
          />
        )}
      </header>

      {project.banner && (
        // Light-background report image, so it keeps a white plate in dark
        // mode rather than being inverted into something unreadable.
        <div className="surface mt-6 overflow-hidden bg-white p-2">
          <Image
            src={project.banner.src}
            alt={project.banner.alt}
            width={project.banner.width}
            height={project.banner.height}
            sizes="(min-width: 768px) 40rem, 100vw"
            className="h-auto w-full rounded"
          />
        </div>
      )}

      <ul className="text-muted mt-6 space-y-2.5">
        {project.points.map((point) => (
          <li key={point} className="flex gap-3 text-pretty">
            <span
              aria-hidden
              className="bg-accent mt-2.5 size-1.5 shrink-0 rounded-full"
            />
            {point}
          </li>
        ))}
      </ul>

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tech.map((item) => (
          <li key={item}>
            <Pill>{item}</Pill>
          </li>
        ))}
      </ul>

      {hasLinks && (
        <footer className="mt-7 flex flex-wrap gap-3">
          {project.caseStudy && (
            <Link
              href={project.caseStudy}
              className="bg-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Read the write-up
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="border-border hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            >
              <SiGithub className="size-4" aria-hidden />
              View code
            </a>
          )}
          {project.certificate && (
            <a
              href={project.certificate}
              target="_blank"
              rel="noreferrer"
              className="border-border hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            >
              <Award className="size-4" aria-hidden />
              View certificate
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="border-border hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
            >
              Live demo
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          )}
        </footer>
      )}
    </article>
  );
}
