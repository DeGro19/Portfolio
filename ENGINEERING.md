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

## Security

### CSP without nonces, and why

A nonce-based CSP is stricter, but nonces must be generated per request, which
forces dynamic rendering and is explicitly incompatible with Partial
Prerendering. This site is statically prerendered, and React's hydration
payload plus the next-themes pre-paint script are both inline, so `script-src`
keeps `'unsafe-inline'`. Everything else is locked down: `default-src 'self'`,
`object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`,
`form-action 'self'`. `'unsafe-eval'` is added in development only, where
React uses `eval` for better error stacks.

The upgrade path is Next's experimental SRI support, which hashes scripts at
build time and keeps static generation. Not adopted yet because it is
experimental and the next-themes script is injected outside Next's control.

### Contact form threat model

Three independent layers, because any one of them alone is weak:

1. **Validation** with a Zod schema shared by the client and the route. The
   client copy is a convenience; the server re-validates because anything a
   browser sends can be forged.
2. **A honeypot field**, hidden from users and assistive tech. Critically, the
   schema _accepts_ a filled honeypot rather than rejecting it: returning a
   400 would tell a bot the field is a trap. The route returns `{ ok: true }`
   and discards the message. (This was caught by testing the endpoint with
   curl, not by reading the code.)
3. **Rate limiting** before validation, so malformed floods are also counted.
   Fixed window, 5 requests per 15 minutes per IP.

Known limitation: the limiter is in-process memory, so on serverless the limit
is per instance rather than global. Adequate for a portfolio contact form;
anything with real abuse exposure needs shared state in Redis or Vercel KV.

Failure responses never distinguish "no API key configured" from "upstream
rejected it" — the visitor sees one message and the detail goes to the server
log.

### GitHub API rate limits

Unauthenticated requests are capped at 60 per hour per IP, so the repository
list is cached for an hour via `cacheLife("hours")`. Without that, a page
getting any traffic would exhaust the quota in minutes and start rendering an
empty list. All failures return an empty array, so a GitHub outage degrades to
the section not rendering rather than a broken page.

## Cache Components constraints hit along the way

Next 16's Cache Components treats several things as dynamic that are easy to
write by accident:

- `new Date()` during render. Hoisted to module scope in the footer and
  sitemap so it is evaluated once at build.
- Filesystem reads. `readdir`/`readFile` for posts live in `"use cache"`
  functions. Only the raw file _string_ is cached, never the compiled MDX,
  since React elements have no business crossing a cache boundary.
- `generateStaticParams` must return at least one entry. With a content
  directory holding only drafts it would return none, so slug collection
  deliberately ignores draft status and `getPost` does the filtering instead.
  That also means drafts 404 in production even if the URL is guessed, while
  staying previewable in development.
- Route handlers cannot return a cached `Response`; the body string is cached
  and the `Response` constructed outside.

## Known gaps / next up

- [ ] Deploy to Vercel and point a custom domain at it
- [ ] Set RESEND_API_KEY so the contact form can actually deliver
- [ ] Write a real post; content/posts/hello-world.mdx is a draft template
- [ ] Lighthouse and axe pass once deployed
- [ ] Reconcile the dissertation headline figure (see below)

## Open question: which dissertation figure is correct?

The CV says "+9% improvement in detection rate". The repository README says
"+218% increase in detected SQLi vulnerabilities". Both appear to be true but
measure different things:

- **+218%** is the detection _count_: 388 reflected detections against 122
  from the default payload set.
- **~+9%** matches the payload _reflection rate_: 27.2% against 18.7%, which
  is 8.5 percentage points, not a 9% relative improvement.

The site currently leads with the counts. The CV should probably be updated to
match, and "detection rate" relabelled, because an interviewer comparing the
two documents will notice.

- [ ] `npm audit`: remaining advisories are all in the dev-only ESLint
      toolchain (`micromatch`/`braces`), not in anything shipped to the browser
