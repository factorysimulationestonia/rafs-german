# Factory Simulation Website

## Project

- This is a bilingual Estonian/English React 19 + Vite + Tailwind CSS v4 website.
- Most application code and localized content live in `src/main.jsx`.
- Shared CSS, theme tokens, and custom animations live in `src/styles.css`.
- Static media and brand assets live under `public/`.
- Use `assetPath()` for public asset URLs so GitHub Pages base paths continue to work.

## Content

- Keep Estonian and English content aligned. When changing copy in one language, update the corresponding translation unless the user explicitly asks otherwise.
- Preserve the existing practical, engineering-focused tone. Emphasize production decisions, risk reduction, validation, simulation, automation, and measurable outcomes.
- Use the terminology already established in nearby content.
- Do not silently rewrite user-provided copy beyond the requested scope.

## Design

- Preserve the dark industrial visual language, Space Grotesk typography, gold accent (`#e2ab19`), and restrained purple result accent (`#8f83d8`).
- The reusable company brand identity package lives in `brand-identity/`; keep it aligned with future changes to logo usage, colors, typography, voice, or core messaging.
- The public brand sheet is available at `/brand`; it is intentionally unlinked from main navigation but should stay aligned with `brand-identity/`.
- Follow existing Tailwind patterns before adding custom CSS.
- Keep operational sections structured and readable rather than decorative or card-heavy.
- Use transparent logo assets on dark backgrounds. Do not add white logo tiles unless explicitly requested.
- Treat 375px-wide phones as a required responsive target. Text, grids, headers, service navigation, and media must not create horizontal overflow.
- Preserve the custom header breakpoints and compact desktop behavior unless the request specifically concerns them.
- Keep in mind that user is not a graphic design expert, so even if they offer a design idea, consider it critically before executing and offer a better alternative if one exists (also considering what other websites have created or 'industry standards').

## Implementation

- Keep edits closely scoped. Do not split the large `src/main.jsx` file or introduce new dependencies unless the change clearly requires it.
- Reuse existing components, localized data structures, and utility classes.
- Ensure flex and grid text children can shrink with `min-w-0`; use explicit wrapping for long Estonian text where needed.
- Respect reduced-motion preferences for animated UI.
- Do not overwrite or remove user assets or unrelated working-tree changes.

## Workflow

- The user normally runs `npm run dev` and reviews changes live. Do not start another server or repeatedly perform browser verification unless asked.
- Do not run `npm run build` after every edit. Run it before committing/pushing, when explicitly requested, or when a risky structural change needs validation.
- Before committing, inspect `git status` and include only intended source and asset changes.
- Do not push or deploy unless explicitly requested.
- Follow `README.md` for demo and production deployment. Confirm whether the target is `demo` or live `origin` when the request is ambiguous.
- If an important change has been made to the project; or the user has provided some specific information that will be important context for future changes, update this AGENTS.md file with the new information and inform the user that you did so.
- Contact forms on the main and Wheel.me pages (also search results page) share the `ContactForm` component in `src/main.jsx` and submit through `server/api/contact.php`. Requests include a `source` value (`main`, `wheelme`, or `search`) that is shown in the email body. Production must use `npm run build:zone`; the GitHub Pages demo uses the frontend-only build and retains the `mailto:` fallback.
- The site has a bilingual factory simulation FAQ route at `/et/factory-simulation-faq` and `/en/factory-simulation-faq`, supported by a short homepage teaser immediately after Services. Keep this SEO cluster aligned in both languages and preserve the full FAQ answers as visible content rather than collapsed-only accordion content.
- English is the default language for visitors without an explicit language path or saved language preference, because most traffic comes from outside Estonia. Explicit `/et/...` routes and user-selected language preferences should continue to work.
- Public media used by the site should stay optimized for production: prefer WebP for raster page imagery, keep the responsive `hero-desktop.webm` / `hero-mobile.webm` split, and avoid leaving unused large originals in `public/` because Vite copies the full directory into `dist`.
- Static production assets are intentionally served with long-lived immutable cache headers from `public/.htaccess`. When an asset must be invalidated, change its filename/path or rely on Vite's hashed build assets; keep `index.html` revalidatable so deploys can point visitors at the new files.
- When asked to add a client logo to the carousel, look for the supplied source file in the project root, convert it to WebP with `ffmpeg`, adapt dark/black logo parts to white for visibility on the dark carousel background (use an all-white transparent logo when that matches the client's own website/logo usage), place the optimized file in `public/kliendid/` using the existing `*_transparent_carousel.webp` naming pattern, remove the unused root source asset after conversion, and add the client to the `clientLogos` array in `src/main.jsx`.
- Before each push goes out, decide the correct SemVer bump: patch for small fixes/content/assets, minor for backward-compatible feature additions or meaningful new sections/capabilities, and major only for breaking or fundamentally disruptive changes. Update `CHANGELOG.md` with all included changes following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), update the app version in `package.json`, and keep `package-lock.json` aligned. After writing the commit message and before committing, open the commit message in the user's editor window as a normal `git commit` would, so the user can review and optionally edit it. After committing the release changes, create an annotated git tag for the same version using the `vX.Y.Z` format (for example, `git tag -a v1.0.6 -m "Release v1.0.6"`) and push both `origin/main` and the tag unless the user explicitly asks not to tag.
