"use client";

import { useCallback, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * `false` during the server render and the first client render, `true` after.
 * Used to defer anything that depends on browser-only state until hydration
 * has finished, without the setState-in-an-effect pattern.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Subscribes to a CSS media query. A media query is exactly the kind of
 * external store `useSyncExternalStore` exists for, so React keeps the value
 * consistent across concurrent renders for free.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onStoreChange);
      return () => list.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // The server cannot know, so assume motion is allowed and let the client
    // correct it on hydration.
    () => false,
  );
}
