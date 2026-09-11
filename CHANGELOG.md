# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.1] - 2026-09-11

### Changed
- Replaced the German DACH contact placeholders with Peter J. Fischer's confirmed name, role, telephone number, and Factory Simulation email address.

### Added
- Added Triinu Strandberg as Vertrags- und Dokumentenmanagerin to the German team section with a temporary portrait placeholder.

## [1.4.0] - 2026-09-11

### Added
- Added draft German Impressum and legal-notice pages with access from every German footer.
- Added a German legal-content review sheet for partner and counsel approval.
- Added a reusable DACH contact-person panel to the German landing page and every German footer.

### Changed
- Redesigned the German footer with distinct brand, DACH contact, social-media, and information areas.
- Kept the German header visible after visitors scroll beyond its initial position.
- Reduced German contact-form padding and added localized field placeholders.

### Fixed
- Corrected the company postal code from `4660` to `46607` in all privacy-policy translations.

## [1.3.1] - 2026-09-11

### Added
- Added localized consent controls with separate choices for Google Analytics and Google Ads conversion measurement.
- Added complete ET/EN/DE privacy disclosures for measurement data, purposes, legal bases, providers, retention, transfers, and withdrawal.

### Changed
- Removed sitemap priority and change-frequency hints so language-market importance is not represented by unsupported ranking signals.
- Blocked Google measurement scripts and lead-conversion events until the relevant consent is granted.
- Self-hosted Space Grotesk so typography no longer creates an unconditional request to Google Fonts.
- Moved the persistent privacy-settings control into the shared footer.

## [1.3.0] - 2026-09-11

### Added
- Added the standalone German presentation to the normal production site under `/de/`, including its FAQ and privacy routes.
- Added German production URLs and route-specific language alternatives for search engines.

### Changed
- Kept the German-only build mode available for the demo and a future dedicated domain while allowing ET, EN, and German to deploy together.
- Updated German social metadata to match the active German page.
- Aligned the main header action heights, moved the language selector to the rightmost position, and changed the German contact fields to white.

## [1.2.0] - 2026-09-10

### Added
- Added a standalone German-market site variant with its own header, responsive hero video, contact form, privacy route, and dedicated build mode.
- Added German-only local and production build commands while retaining the existing translated services, software, clients, team, partners, and FAQ content.

### Changed
- Restored the main site language selector to Estonian and English only.
- Configured the GitHub Pages demo workflow to publish the standalone German site.
- Reused the original footer across the main and German site variants.

### Removed
- Removed the Wheel.me page, reseller section, and sitemap entry from the German site.

## [1.1.0] - 2026-09-09

### Added
- Added German as a third supported site language with localized home, services, Wheel.me, FAQ, blog, privacy, search, contact form, metadata, sitemap, and contact-email copy.
- Added a compact three-language header selector with Estonian, English, and German flag options.
- Added `german-translations.md` as a proofing sheet for the German copy.

## [1.0.7] - 2026-09-07

### Added
- Added a reusable brand identity package with logo assets, guidance, CSS variables, and design tokens.
- Added an unlinked public brand sheet at `/brand`.

## [1.0.6] - 2026-09-01

### Added
- Added the app version to the footer metadata line.
- Documented the release workflow for SemVer bump decisions, commit message review, and version tags.

## [1.0.5] - 2026-09-01

### Added
- Added the Plastotec logo to the client carousel.
- Documented the repeat workflow for adding future client carousel logos.

## [1.0.4] - 2026-08-17

### Changed
- Added long-lived cache headers for static production assets.
- Made the Google Fonts stylesheet load without blocking initial render.
- Added smaller responsive service comparison image variants.

## [1.0.3] - 2026-08-17

### Changed
- Optimized public raster media to WebP and removed unused large originals from the production asset set.
- Added responsive desktop and mobile homepage hero video variants.
- Added responsive and lazy-loading hints for page media.

## [1.0.2] - 2026-08-07

### Changed
- Replaced the homepage hero video with `hero.webm`.

## [1.0.1] - 2026-08-06

### Changed
- Updated homepage hero and services copy in Estonian and English.
- Reordered services and added Offline robot programming with service imagery.
- Replaced the Virtual commissioning animated visual with a static service image.
- Removed an outdated World Cup 2026 reference from the factory simulation FAQ.
- Removed the homepage Projects section and project navigation item.
- Simplified the factory simulation FAQ teaser on the homepage.
- Updated the Services section header to use a plain black background.
- Added Isaac Sim to the NVIDIA Omniverse tool description.
- Added new client carousel logos for Ecopress Waste System OÜ, Upgreat OÜ and Sark Robotics OÜ.
- Added localized contact form placeholders.
- Removed client carousel hyperlinks to preserve drag interaction.
- Removed the Factory digitalization service.
