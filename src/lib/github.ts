import { unstable_cacheLife as cacheLife } from "next/cache";
import { siteConfig } from "./site-config";

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  updatedAt: string;
};

const username = siteConfig.github.replace(/^https:\/\/github\.com\//, "");

/**
 * Public repositories, newest first.
 *
 * Unauthenticated GitHub requests are limited to 60 per hour per IP, so the
 * result is cached for an hour: a popular page would otherwise burn the whole
 * quota in minutes and start serving an empty list. Any failure returns an
 * empty array rather than throwing, so a GitHub outage degrades to the section
 * simply not rendering instead of taking the page down.
 */
export async function getRepos(limit = 4): Promise<Repo[]> {
  "use cache";
  cacheLife("hours");

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!response.ok) return [];

    const data: unknown = await response.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter((repo) => !repo.fork && !repo.archived)
      .slice(0, limit)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        updatedAt: repo.pushed_at,
      }));
  } catch {
    return [];
  }
}
