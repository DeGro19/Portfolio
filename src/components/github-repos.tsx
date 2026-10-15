import { ArrowUpRight, Star } from "lucide-react";
import { getRepos } from "@/lib/github";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
});

export async function GithubRepos() {
  const repos = await getRepos();

  // A GitHub outage or rate limit degrades to nothing rendering at all.
  if (repos.length === 0) return null;

  return (
    <div className="mt-14">
      <h3 className="text-xl font-bold tracking-tight">Recent repositories</h3>
      <p className="text-muted mt-2 text-sm">Pulled live from GitHub.</p>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {repos.map((repo) => (
          <li key={repo.name}>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="surface hover:border-accent/40 group flex h-full flex-col p-5 transition-colors"
            >
              <p className="group-hover:text-accent flex items-start gap-2 font-medium break-words transition-colors">
                {repo.name}
                <ArrowUpRight
                  className="mt-1 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </p>
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
                <span>
                  Updated {dateFormatter.format(new Date(repo.updatedAt))}
                </span>
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
