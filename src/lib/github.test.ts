import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ cacheLife: () => {} }));

const { toRepos } = await import("./github");

const base = {
  description: null,
  language: null,
  stargazers_count: 0,
  updated_at: "2026-01-01T00:00:00Z",
  private: false,
  fork: false,
  archived: false,
  owner: { login: "DeGro19" },
};

describe("toRepos", () => {
  it("keeps forks, archived and private repos, newest push first", () => {
    const repos = toRepos([
      {
        ...base,
        name: "old-fork",
        html_url: "https://github.com/x/old-fork",
        fork: true,
        pushed_at: "2025-11-03T00:00:00Z",
      },
      {
        ...base,
        name: "secret",
        html_url: "https://github.com/x/secret",
        private: true,
        pushed_at: "2026-11-10T00:00:00Z",
      },
      {
        ...base,
        name: "shelved",
        html_url: "https://github.com/x/shelved",
        archived: true,
        pushed_at: "2026-09-17T00:00:00Z",
      },
    ]);

    expect(repos.map((r) => r.name)).toEqual(["secret", "shelved", "old-fork"]);
    expect(repos[0]).toMatchObject({ isPrivate: true, url: null });
    expect(repos[1]).toMatchObject({
      isArchived: true,
      url: "https://github.com/x/shelved",
    });
    expect(repos[2]).toMatchObject({ isFork: true });
  });

  it("drops repos owned by someone else", () => {
    const repos = toRepos([
      {
        ...base,
        name: "theirs",
        html_url: "u",
        pushed_at: null,
        owner: { login: "someone-else" },
      },
    ]);
    expect(repos).toEqual([]);
  });

  it("returns an empty list for a non-array response", () => {
    expect(toRepos({ message: "API rate limit exceeded" })).toEqual([]);
  });
});
