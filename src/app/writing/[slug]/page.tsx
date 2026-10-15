import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost, getPostSlugs } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateStaticParams() {
  const slugs = await getPostSlugs();

  // Cache Components rejects an empty result, so an empty content directory
  // still yields one param. That slug has no file behind it and 404s.
  if (slugs.length === 0) return [{ slug: "no-posts-yet" }];

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

export default async function PostPage({
  params,
}: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { content, frontmatter } = post;

  return (
    <article className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <Link
        href="/writing"
        className="text-muted hover:text-accent inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All writing
      </Link>

      <header className="mt-8">
        <p className="text-muted font-mono text-sm">
          {dateFormatter.format(new Date(frontmatter.date))}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tighter text-balance sm:text-5xl">
          {frontmatter.title}
        </h1>
        <p className="text-muted mt-5 text-lg text-pretty">
          {frontmatter.description}
        </p>
      </header>

      {/* Prose styling lives here rather than in the MDX, so posts stay plain
          markdown and never carry layout concerns. */}
      <div className="[&_a]:text-accent [&_blockquote]:border-accent [&_blockquote]:text-muted [&_code]:bg-card [&_li]:text-muted [&_p]:text-muted [&_pre]:surface mt-12 space-y-5 leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:pl-5 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:text-pretty [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {content}
      </div>
    </article>
  );
}
