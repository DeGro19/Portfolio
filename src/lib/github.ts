import { cacheLife } from "next/cache";
import { siteConfig } from "./site-config";

export type Repo = {
  name: string;
  description: string | null;
  /** Null for private repos: visitors would only get a GitHub 404. */
  url: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
  isPrivate: boolean;
  isFork: boolean;
  isArchived: boolean;
};

const username = siteConfig.github.replace(/^https:\/\/github\.com\//, "");

type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string | null;
  updated_at: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  owner?: { login?: string };
};

/** Turns GitHub's API response into display data, most recently pushed first. */
export function toRepos(data: unknown): Repo[] {
  if (!Array.isArray(data)) return [];

  return (data as GithubRepo[])
    .filter(
      (repo) =>
        // An authenticated listing can include repos the token's owner
        // collaborates on; only the portfolio owner's own repos belong here.
        !repo.owner?.login ||
        repo.owner.login.toLowerCase() === username.toLowerCase(),
    )
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      url: repo.private ? null : repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      updatedAt: repo.pushed_at ?? repo.updated_at,
      isPrivate: repo.private,
      isFork: repo.fork,
      isArchived: repo.archived,
    }))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

/**
 * Every repository on the GitHub account, forks and archived ones included,
 * newest push first.
 *
 * Without GITHUB_TOKEN only public repos are visible. With a read-only token
 * for the account, private repos are listed too (name, description and
 * language only; they are not linked). The token also raises the rate limit
 * from 60 to 5,000 requests an hour.
 *
 * The result is cached for an hour. Any failure returns an empty array rather
 * than throwing, so a GitHub outage degrades to the section simply not
 * rendering instead of taking the page down.
 */
export async function getRepos(): Promise<Repo[]> {
  "use cache";
  cacheLife("hours");

  const token = process.env.GITHUB_TOKEN;
  const url = token
    ? "https://api.github.com/user/repos?visibility=all&affiliation=owner&sort=pushed&per_page=100"
    : `https://api.github.com/users/${username}/repos?type=owner&sort=pushed&per_page=100`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) return [];

    return toRepos(await response.json());
  } catch {
    return [];
  }
}
