import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Pill } from "@/components/pill";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on offensive security tooling, cloud security and whatever I am currently taking apart.",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function WritingIndexPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <Link
        href="/"
        className="text-muted hover:text-accent inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back home
      </Link>

      <h1 className="mt-8 text-4xl font-bold tracking-tighter sm:text-5xl">
        Writing
      </h1>
      <p className="text-muted mt-5 text-lg text-pretty">
        {metadata.description}
      </p>

      {posts.length === 0 ? (
        <p className="surface text-muted mt-12 p-6 text-pretty">
          Nothing published yet. Drop an <code className="font-mono">.mdx</code>{" "}
          file into <code className="font-mono">content/posts/</code> and it
          will appear here.
        </p>
      ) : (
        <ul className="mt-12 space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/writing/${post.slug}`}
                className="surface hover:border-accent/40 group block p-6 transition-colors"
              >
                <p className="text-muted font-mono text-sm">
                  {dateFormatter.format(new Date(post.date))}
                  {post.draft && " · draft"}
                </p>
                <p className="group-hover:text-accent mt-2 flex items-start gap-2 text-xl font-bold tracking-tight transition-colors">
                  {post.title}
                  <ArrowUpRight
                    className="mt-1.5 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden
                  />
                </p>
                <p className="text-muted mt-2 text-pretty">
                  {post.description}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <li key={tag}>
                        <Pill>{tag}</Pill>
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
