"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Hairline progress bar pinned to the very top of the viewport.
 * Driven by a spring so it trails the scroll slightly instead of snapping,
 * unless the user has asked for reduced motion, in which case it tracks
 * scroll position exactly.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: reducedMotion ? scrollYProgress : smoothed }}
      className="from-accent to-accent-soft fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-gradient-to-r"
    />
  );
}
