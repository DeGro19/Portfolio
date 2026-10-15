# Engineering notes

Decisions, trade-offs and things I would do differently. Kept as the site is
built, so I can talk through any part of it in an interview.

## Stack

| Choice                  | Why                                                                                                                                | Alternative considered                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Next.js 15 (App Router) | React Server Components mean the static parts of the page ship zero JS; also the framework most UK job ads name.                   | Astro — faster for pure content, but less React experience to demonstrate. |
| TypeScript              | Catches the whole class of bugs that come from renaming a field and missing a usage.                                               | —                                                                          |
| Tailwind v4             | Styles live next to the markup, so there is no dead CSS. v4 uses native CSS variables, which is what makes the theme switch cheap. | CSS Modules — more boilerplate per component.                              |
| next-themes             | Handles the hard part: setting the theme class before first paint.                                                                 | Hand-rolled — this is where the flash-of-wrong-theme bug comes from.       |

## Decisions worth explaining

### No flash of the wrong theme

The theme lives in `localStorage`, which the server cannot read. A naive
implementation renders light, hydrates, then snaps to dark — a visible flash.
`next-themes` injects a blocking inline script that sets the class on `<html>`
before the browser paints. The cost is a hydration mismatch warning, silenced
with `suppressHydrationWarning` on `<html>` only — not globally, so real
mismatches elsewhere still surface.

### Active nav link via IntersectionObserver

`src/components/sidebar.tsx` watches each section with an IntersectionObserver
using a `-45% 0px -45% 0px` root margin, so a section counts as "active" only
once it reaches the middle band of the viewport. The alternative — a scroll
listener recalculating `getBoundingClientRect()` per frame — forces layout on
every scroll event and janks on mobile.

### Reduced motion is honoured, not ignored

The typewriter in `src/components/typewriter.tsx` checks
`prefers-reduced-motion` and renders static text instead. `globals.css` also
disables smooth scrolling and collapses transitions. Animated text is also
hidden from screen readers (`aria-hidden`) with the full list exposed once via
`sr-only`, so assistive tech is not read one character at a time.

### The hydration mismatch the toggle actually hit

First version gated only the _icon_ on hydration, not the `aria-label`. On the
server `resolvedTheme` is `undefined`, so the label rendered "Switch to dark
theme"; the client resolved dark and rendered "Switch to light theme" — React
flagged the mismatch. Fix: every theme-dependent value, including text, stays
neutral until `mounted` is true. Worth remembering that
`suppressHydrationWarning` on `<html>` does **not** hide mismatches further
down the tree, which is exactly why this one was caught.

### `useSyncExternalStore` instead of mount-guard effects

The usual "has it hydrated yet" trick is `useState(false)` plus
`useEffect(() => setMounted(true))`. React's compiler lint rejects it, rightly:
it triggers a second render pass. `src/lib/hooks.ts` uses
`useSyncExternalStore` instead, which has a dedicated server snapshot — so the
server and client values are correct by construction rather than corrected
after the fact. The same hook shape subscribes to `prefers-reduced-motion`,
which is genuinely an external store.

### Cross-fading the theme instead of snapping

`next-themes` ships `disableTransitionOnChange`, which injects a stylesheet
killing every transition for the duration of the swap. That exists to stop the
_initial_ theme being animated in — but it also makes the deliberate toggle
feel abrupt. Removed it, and declared the transition in `@layer base` instead:
`background-color`, `border-color`, `color`, `fill`, `stroke` over 400ms. The
layer matters — Tailwind's `utilities` layer outranks `base`, so any element
with its own `transition-colors` keeps its snappy 150ms hover while the theme
change still eases. The initial load does not animate because `next-themes`
sets the class before first paint, so there is no "from" value to animate out
of. Wrapped in `prefers-reduced-motion: no-preference`.

### Sticky header border without a scroll listener

The header's border and backdrop blur only appear once the page has moved. The
obvious implementation is an `onScroll` handler, which fires constantly and
reads layout. Instead a one-pixel sentinel sits above the sticky header and an
IntersectionObserver reports when it leaves the viewport — the browser does the
work off the main thread, and the state flips exactly once per direction.

### `new Date()` in a server component

Next 16's Cache Components treat reading the clock during render as dynamic
I/O, so a `© {new Date().getFullYear()}` in the footer failed the production
build — it would have forced the whole route out of static prerendering.
Hoisted to module scope so it is evaluated once at build time.

### Dependency choices

- Dropped `gray-matter` — pulled in a `js-yaml` advisory, and `next-mdx-remote`
  parses frontmatter itself.
- `lucide-react` v1 removed brand icons, so GitHub comes from
  `@icons-pack/react-simple-icons`. LinkedIn was removed from Simple Icons over
  trademark, so it currently uses a generic contact icon.

## Known gaps / next up

- [ ] Project content as MDX, with a detail page per project
- [ ] Live GitHub stats via the API (cache the response; handle rate limits)
- [ ] Contact form: validation, rate limiting, spam protection
- [ ] Tests (Vitest + Testing Library) and a GitHub Actions workflow
- [ ] Lighthouse pass, OG images, sitemap, custom domain
- [ ] `npm audit`: remaining advisories are all in the dev-only ESLint
      toolchain (`micromatch`/`braces`), not in anything shipped to the browser
