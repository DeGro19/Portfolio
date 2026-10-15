import { afterEach, describe, expect, it, vi } from "vitest";
import { rateLimit } from "./rate-limit";

const WINDOW_MS = 15 * 60 * 1000;

afterEach(() => {
  vi.useRealTimers();
});

describe("rateLimit", () => {
  it("allows the first five requests from a key and blocks the sixth", () => {
    const key = "test-allow-five";

    for (let i = 0; i < 5; i += 1) {
      expect(rateLimit(key).allowed, `request ${i + 1}`).toBe(true);
    }

    const blocked = rateLimit(key);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks keys independently", () => {
    const busy = "test-busy";
    for (let i = 0; i < 6; i += 1) rateLimit(busy);

    expect(rateLimit(busy).allowed).toBe(false);
    expect(rateLimit("test-quiet").allowed).toBe(true);
  });

  it("lets a blocked key through again once the window expires", () => {
    vi.useFakeTimers();
    const key = "test-window";

    for (let i = 0; i < 6; i += 1) rateLimit(key);
    expect(rateLimit(key).allowed).toBe(false);

    vi.advanceTimersByTime(WINDOW_MS + 1000);
    expect(rateLimit(key).allowed).toBe(true);
  });
});
