# Deploying

Nothing here can be done for you: each step needs your GitHub, Vercel or
registrar login.

## 1. Push to GitHub

Create an empty repository (no README, no .gitignore) at
<https://github.com/new>, named e.g. `portfolio`. Then:

```bash
cd C:\Users\User\Projects\portfolio
git remote add origin https://github.com/DeGro19/Portfolio.git
git push -u origin build/portfolio
```

To put the work on `master` instead:

```bash
git checkout master
git merge build/portfolio
git push -u origin master
```

CI runs on push, so check the Actions tab goes green.

## 2. Deploy on Vercel

1. Sign in at <https://vercel.com> with GitHub.
2. **Add New → Project**, import the repository.
3. Framework preset is detected as Next.js. Leave every build setting alone.
4. Before the first deploy, add environment variables (see below), then
   **Deploy**.

You get a `*.vercel.app` URL immediately. Every push redeploys; pull requests
get their own preview URL.

## 3. Environment variables

In **Project → Settings → Environment Variables**, for Production _and_
Preview:

| Name             | Value                                  | Needed for            |
| ---------------- | -------------------------------------- | --------------------- |
| `RESEND_API_KEY` | key from <https://resend.com/api-keys> | Contact form delivery |
| `CONTACT_FROM`   | `Portfolio <noreply@yourdomain.com>`   | Sender address        |

Without `RESEND_API_KEY` the form returns a clear "email me directly" message
rather than failing silently, so the site still works — the form just cannot
deliver.

`CONTACT_FROM` must use a domain verified in Resend. Until you verify one, use
`onboarding@resend.dev`, which only delivers to the address that owns the
Resend account.

## 4. Custom domain

1. Buy a domain. `deongrover.dev` or `.co.uk` reads better on a CV than
   `deon-portfolio-v2.vercel.app`.
2. Vercel → **Settings → Domains → Add**, then follow the DNS records it
   gives you.
3. HTTPS is provisioned automatically.

## 5. Update the canonical URL

`src/lib/site-config.ts` still says `https://example.com`. Change `url` to the
real domain, or the sitemap, Open Graph tags, JSON-LD and `security.txt` will
all point at nothing.

```ts
url: "https://deongrover.dev",
```

Commit and push; Vercel redeploys.

## 6. Verify

- <https://securityheaders.com> — expect A or A+
- <https://pagespeed.web.dev> — Lighthouse scores
- Post the URL into a LinkedIn message box (do not send) to see the Open Graph
  card render
- `curl https://yourdomain/.well-known/security.txt`
