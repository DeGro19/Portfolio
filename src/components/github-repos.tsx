import { ArrowUpRight, Lock, Star } from "lucide-react";
import { getRepos, type Repo } from "@/lib/github";
import { siteConfig } from "@/lib/site-config";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
});

function badges(repo: Repo) {
  return [
    repo.isPrivate && "Private",
    repo.isFork && "Fork",
    repo.isArchived && "Archived",
  ].filter((label): label is string => Boolean(label));
}

function RepoCardBody({ repo }: { repo: Repo }) {
  return (
    <>
      <p className="group-hover:text-accent flex items-start gap-2 font-medium break-words transition-colors">
        {repo.isPrivate && (
          <Lock className="mt-1 size-4 shrink-0" aria-label="Private" />
        )}
        {repo.name}
        {repo.url && (
          <ArrowUpRight
            className="mt-1 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        )}
      </p>
      {badges(repo).length > 0 && (
        <p className="mt-2 flex flex-wrap gap-1.5">
          {badges(repo).map((label) => (
            <span
              key={label}
              className="text-muted rounded-full border px-2 py-0.5 font-mono text-[0.7rem]"
            >
              {label}
            </span>
          ))}
        </p>
      )}
      {repo.description && (
        <p className="text-muted mt-2 line-clamp-3 text-sm text-pretty">
          {repo.description}
        </p>
      )}
      <p className="text-muted mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-4 font-mono text-xs">
        {repo.language && <span>{repo.language}</span>}
        {repo.stars > 0 && (
          <span className="flex items-center gap-1">
            <Star className="size-3" aria-hidden />
            {repo.stars}
          </span>
        )}
        <span>Updated {dateFormatter.format(new Date(repo.updatedAt))}</span>
      </p>
    </>
  );
}

/** How many of the most recently pushed repos to show on the page. */
const VISIBLE_REPOS = 4;

export async function GithubRepos() {
  const repos = (await getRepos()).slice(0, VISIBLE_REPOS);

  // A GitHub outage or rate limit degrades to nothing rendering at all.
  if (repos.length === 0) return null;

  return (
    <div className="mt-14">
      <h3 className="text-xl font-bold tracking-tight">Recent repositories</h3>
      <p className="text-muted mt-2 text-sm">Pulled live from GitHub.</p>

      {/* auto-rows-fr gives every row the height of the tallest card, and the
          equal columns give every card the same width. */}
      <ul className="mt-5 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
        {repos.map((repo) => (
          <li key={repo.name} className="min-w-0">
            {repo.url ? (
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="surface hover:border-accent/40 group flex h-full flex-col p-5 transition-colors"
              >
                <RepoCardBody repo={repo} />
              </a>
            ) : (
              <div className="surface flex h-full flex-col p-5">
                <RepoCardBody repo={repo} />
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-center">
        <a
          href={`${siteConfig.github}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="border-border hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded-full border px-6 py-3 font-medium transition-colors"
        >
          View all repositories
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
