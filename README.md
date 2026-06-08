# Factory Simulation Homepage

## Deployment

This repo has two remotes:

- `origin` - live production repo: `factorysimulationestonia/fs-home`
- `demo` - GitHub Pages demo repo: `hansojuhan/fs-home-demo`

### Push to demo

Use this when testing the current branch on GitHub Pages:

```bash
git push demo services-update:main
```

Demo URL:

```text
https://hansojuhan.github.io/fs-home-demo/
```

The demo workflow builds with `BASE_PATH=/fs-home-demo/` and copies `dist/index.html` to `dist/404.html` so clean routes like `/et/` work on GitHub Pages.

### Push live

Merge the work into `main`, then push `main` to `origin`:

```bash
git checkout main
git merge services-update
git push origin main
```

The Zone deploy workflow is guarded to run only in `factorysimulationestonia/fs-home`, so it will not deploy from the demo repo.
