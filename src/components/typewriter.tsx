"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/hooks";

const TYPE_MS = 90;
const DELETE_MS = 45;
const PAUSE_MS = 200;
const HOLD_MS = 1800;

/**
 * Types each word out, pauses, deletes it, moves to the next.
 * Users with `prefers-reduced-motion` get the first word as plain static text.
 */
export function Typewriter({
  words,
  className,
}: {
  words: readonly string[];
  className?: string;
}) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (reducedMotion) return;

    const word = words[wordIndex % words.length];
    const finishedTyping = !deleting && text === word;
    const finishedDeleting = deleting && text === "";

    const delay = finishedTyping
      ? HOLD_MS
      : finishedDeleting
        ? PAUSE_MS
        : deleting
          ? DELETE_MS
          : TYPE_MS;

    const timer = setTimeout(() => {
      if (finishedTyping) {
        setDeleting(true);
      } else if (finishedDeleting) {
        setDeleting(false);
        setWordIndex((index) => index + 1);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, wordIndex, words, reducedMotion]);

  if (reducedMotion) {
    return <span className={className}>{words[0]}</span>;
  }

  return (
    <span className={className}>
      {/* Screen readers get the full list once, not a character at a time. */}
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden>
        {text}
        <span className="animate-pulse font-light">|</span>
      </span>
    </span>
  );
}
