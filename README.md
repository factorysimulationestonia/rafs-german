# Factory Simulation Homepage

## Local development

### Contact form testing

The live site sends contact messages through a small PHP endpoint and Zone's local SMTP relay. No SMTP credentials are exposed to the browser.

To test the contact forms locally:

1. Start Mailpit with SMTP on `127.0.0.1:1025` and its inbox on `http://127.0.0.1:8025`.
2. Start the contact API in one terminal:

   ```bash
   npm run dev:contact-api
   ```

3. Start Vite in another terminal:

   ```bash
   npm run dev
   ```

Vite proxies `/api` to the local PHP server on port `8787`. On Windows, the launcher uses `.tools/php/php.exe` when present; otherwise, it uses `php` from `PATH`.

## Deployment

This repository has two remotes:

- `origin` — live production repository: `factorysimulationestonia/fs-home`
- `demo` — GitHub Pages demo repository: `hansojuhan/fs-home-demo`

### Push to demo

Use this when testing the current branch on GitHub Pages:

```bash
git push demo services-update:main
```

Demo URL: <https://hansojuhan.github.io/fs-home-demo/>

The demo workflow builds with `BASE_PATH=/fs-home-demo/` and copies `dist/index.html` to `dist/404.html`, allowing clean routes such as `/et/` to work on GitHub Pages.

Because GitHub Pages cannot run PHP, the demo contact form retains the `mailto:` fallback.

### Push live

Merge the work into `main`, then push `main` to `origin`:

```bash
git checkout main
git merge services-update
git push origin main
```

The Zone deployment workflow runs `npm run build:zone`. This adds `server/api/contact.php` to `dist/api/contact.php` and configures the frontend to use it. In production, the endpoint sends email through Zone's `localhost:25` SMTP relay.

The workflow is guarded so it only deploys from `factorysimulationestonia/fs-home`, not from the demo repository.

## Email system

### How it works

#### Local development

```text
React contact form
    ↓ POST /api/contact.php
Vite proxy
    ↓ http://127.0.0.1:8787
PHP development server
    ↓ SMTP 127.0.0.1:1025
Mailpit
    ↓
Mailpit inbox at http://127.0.0.1:8025
```

#### Live website

```text
React contact form
    ↓ POST /api/contact.php
Zone web server runs contact.php
    ↓ SMTP localhost:25
Zone mail relay
    ↓
info@factorysimulation.eu
```

### Form sources

Each request records where it originated. The delivered email contains a `Vormi allikas` or `Form source` line with one of these values:

- Main page contact form
- Wheel.me page contact form
- Search page contact form

### New files

#### [`server/api/contact.php`](server/api/contact.php)

This is the backend endpoint. PHP runs on the server, unlike React, which runs in the visitor's browser.

It:

- Accepts contact requests as JSON.
- Validates the name, email, message length, language, and form source.
- Rejects oversized or malformed requests.
- Checks that requests come from an allowed website origin.
- Includes a hidden honeypot field for basic bot filtering.
- Limits repeated submissions:
  - At least five seconds globally.
  - At least 30 seconds per IP.
  - Maximum five requests per IP per hour.
- Constructs the email subject and body.
- Records which website form submitted the request.
- Uses the visitor's email as `Reply-To`.
- Sends from `website@factorysimulation.eu`.
- Delivers to `info@factorysimulation.eu`.
- Connects directly to an SMTP server without an external library.

Automatic SMTP configuration:

| Environment | SMTP server | Port |
| --- | --- | ---: |
| Local | `127.0.0.1` | `1025` |
| Zone | `localhost` | `25` |

A browser `GET` request acts as a health check:

<https://factorysimulation.eu/api/contact.php>

Expected response:

```json
{"ok":true,"service":"contact"}
```

#### [`scripts/dev-contact-api.mjs`](scripts/dev-contact-api.mjs)

This starts PHP locally:

```bash
npm run dev:contact-api
```

The script:

- Looks for the portable PHP installation in `.tools/php`.
- Falls back to a system-wide PHP installation.
- Starts PHP on `127.0.0.1:8787`.
- Points PHP at the `server/` directory.
- Enables development mode.
- Disables rate limiting during local testing.

This script is only a local convenience and is not uploaded to the public website.

#### [`scripts/build-zone.mjs`](scripts/build-zone.mjs)

This creates the production package for Zone:

```bash
npm run build:zone
```

It:

1. Builds the React website with `VITE_CONTACT_ENDPOINT=/api/contact.php`.
2. Copies `server/api/contact.php` to `dist/api/contact.php`.

The final `dist/` directory therefore contains both the static React website and the PHP endpoint.

### Modified files

#### [`src/main.jsx`](src/main.jsx)

The contact forms now:

- Send JSON to `/api/contact.php`.
- Record whether the request came from the main, Wheel.me, or search form.
- Validate fields and display bilingual errors.
- Show a spinner for at least two seconds.
- Turn green after successful delivery.
- Remain locked until the page is refreshed.
- Fall back to the visitor's email application when no backend endpoint is configured.
- Include a hidden spam honeypot.

The main and Wheel.me pages share the same `ContactForm` component.

#### [`vite.config.js`](vite.config.js)

During local development, Vite cannot execute PHP. The development proxy forwards `/api` requests to:

```text
http://127.0.0.1:8787
```

The browser can therefore use the same `/api/contact.php` URL locally and in production.

#### [`package.json`](package.json)

Two commands support the email system:

```bash
npm run dev:contact-api
npm run build:zone
```

The first starts the local PHP server. The second produces the complete Zone deployment.

#### [`.github/workflows/deploy-zone.yml`](.github/workflows/deploy-zone.yml)

The production workflow runs:

```bash
npm run build:zone
```

GitHub Actions then uploads everything in `dist/` to Zone over FTPS, including `dist/api/contact.php`.

#### [`.gitignore`](.gitignore)

`.tools/` is ignored because the portable local PHP runtime is a large, machine-specific development tool. Zone already provides PHP, so this runtime is neither committed nor uploaded.

### GitHub Pages demo

The GitHub Pages demo runs:

```bash
npm run build
```

It does not include PHP because GitHub Pages cannot execute it. The demo therefore retains the `mailto:` behavior. Only the Zone workflow runs `npm run build:zone`.
