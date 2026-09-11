# German Site Architecture

## Decision

Keep the Estonian/English site and the German site in this repository, but build
and deploy them as separate site variants.

The German site may have its own landing page, navigation, routes, content model,
SEO metadata, and visual composition. Shared infrastructure and genuinely reusable
components can remain common to both variants.

## Repository Shape

The German composition remains in `src/GermanSite.jsx` and is selected at the
application entry point. The normal production build serves it under `/de/`,
while the German build mode serves the same composition from `/` for the demo
and a future dedicated German domain.

If the German site grows into several page modules, use this structure:

```text
src/
  sites/
    main/       Estonian and English site composition
    de/         German site composition
  shared/       Reusable primitives, forms, analytics, and utilities
```

Do not move code into `shared/` speculatively. Extract it when both site variants
actually use it.

## URLs And Deployment

- The existing domain serves the Estonian and English site plus the separate
  German composition under `/de/`.
- The normal production build deploys all three languages together for now.
- The dedicated German build remains available for the demo and a future German
  domain, where it will serve the German composition from `/`.
- Domain names and deployment credentials stay in environment variables and
  repository secrets, not application source.

Suggested build-time configuration:

```text
VITE_SITE_VARIANT=main|de
VITE_PUBLIC_ORIGIN=https://www.example.com
VITE_MAIN_SITE_ORIGIN=https://www.example.com
VITE_GERMAN_SITE_ORIGIN=https://www.example.de
```

The German site is German-only and does not show a language selector. The main
site keeps its original Estonian/English selector and does not advertise German
as a third in-place language.

## SEO Rules

- Canonical URLs must use the public origin of the active site variant.
- Estonian, English, and German equivalents should reference one another with
  `hreflang` links, even when they live on different domains.
- Add `x-default` for the preferred international landing page.
- Each deployment publishes only the sitemap for routes available on that domain.
- Do not duplicate the old German `/de/` pages on the main production domain after
  the dedicated German domain launches; redirect them to their closest German URL.

## Delivery Sequence

1. Agree the German audience, offer, page map, and domain.
2. Build the German site variant on `german-site-redesign` and review it locally and on the German-only GitHub Pages demo.
3. Publish the German composition under `/de/` in the normal production build.
4. Configure a second deployment target if a German domain is selected.
5. Update cross-domain canonicals, `hreflang`, sitemaps, and redirects before moving `/de/` to that domain.

## When To Split Repositories

Revisit a second repository only if the German site gains a different owner or
agency, technology stack, release schedule, backend, compliance boundary, or brand.
Different pages and a different domain alone do not require a repository split.
