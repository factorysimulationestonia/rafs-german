# German Site Architecture

## Decision

Keep the Estonian/English site and the German site in this repository, but build
and deploy them as separate site variants.

The German site may have its own landing page, navigation, routes, content model,
SEO metadata, and visual composition. Shared infrastructure and genuinely reusable
components can remain common to both variants.

## Repository Shape

The intended structure is:

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

- The existing domain continues to serve the Estonian and English site.
- A separate German domain serves the German site from its root URL.
- Each site variant gets its own build and deployment target.
- Domain names and deployment credentials stay in environment variables and
  repository secrets, not application source.
- Until the German redesign is ready, `/de/` on the demo remains the reviewable
  translation of the current site.

Suggested build-time configuration:

```text
VITE_SITE_VARIANT=main|de
VITE_PUBLIC_ORIGIN=https://www.example.com
VITE_MAIN_SITE_ORIGIN=https://www.example.com
VITE_GERMAN_SITE_ORIGIN=https://www.example.de
```

The language switcher should use full cross-domain URLs once the German domain is
configured. It should link to an equivalent page where one exists and otherwise
fall back to the destination site's home page.

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
2. Build the German site variant on `german-site-redesign` and review it on demo.
3. Configure the second deployment target and domain.
4. Add cross-domain language links, canonicals, `hreflang`, sitemaps, and redirects.
5. Launch the German domain without changing the Estonian/English production site.

## When To Split Repositories

Revisit a second repository only if the German site gains a different owner or
agency, technology stack, release schedule, backend, compliance boundary, or brand.
Different pages and a different domain alone do not require a repository split.
