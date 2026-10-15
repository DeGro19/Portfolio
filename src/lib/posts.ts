import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & { slug: string };

/**
 * Every slug on disk, drafts included.
 *
 * Cache Components requires `generateStaticParams` to return at least one
 * entry, so this deliberately does not filter drafts: a repo containing only
 * draft posts would otherwise fail the build. Drafts are kept out of
 * production by `getPost` returning null for them, which renders a 404.
 */
export async function getPostSlugs(): Promise<string[]> {
  "use cache";

  try {
    const files = await readdir(POSTS_DIR);
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch {
    // No content directory yet is a normal state, not an error.
    return [];
  }
}

/**
 * Only the raw file read is cached. Compiled MDX returns React elements, which
 * have no business crossing a cache boundary, so compilation happens outside.
 */
async function readPostSource(slug: string): Promise<string | null> {
  "use cache";

  try {
    return await readFile(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
  } catch {
    return null;
  }
}

/** Published posts, newest first. Drafts are visible in dev only. */
export async function getPosts(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const source = await readPostSource(slug);
      if (!source) return null;

      const { frontmatter } = await compileMDX<PostFrontmatter>({
        source,
        options: { parseFrontmatter: true },
      });
      return { ...frontmatter, slug };
    }),
  );

  return posts
    .filter((post): post is PostMeta => post !== null)
    .filter((post) => !(post.draft && process.env.NODE_ENV === "production"))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  // Guard against traversal before the path ever reaches the filesystem.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  const source = await readPostSource(slug);
  if (!source) return null;

  const post = await compileMDX<PostFrontmatter>({
    source,
    options: { parseFrontmatter: true },
  });

  // A draft is unreachable in production even by direct URL.
  if (post.frontmatter.draft && process.env.NODE_ENV === "production") {
    return null;
  }

  return post;
}
