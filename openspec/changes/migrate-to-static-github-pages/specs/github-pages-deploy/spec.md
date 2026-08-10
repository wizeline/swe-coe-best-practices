## ADDED Requirements

### Requirement: Static export build
The project SHALL produce a fully static site via `next build` with `output: 'export'` configured in `next.config.ts`. The build SHALL succeed with zero errors.

#### Scenario: Build produces static output
- **WHEN** `npm run build` is executed
- **THEN** an `out/` directory is generated containing HTML, CSS, and JS assets for all routes with no server-side runtime required

### Requirement: Correct base path for GitHub Pages
All internal routes and assets SHALL be prefixed with `/wz-int-swe-best-practices` to match the GitHub Pages subdirectory hosting path.

#### Scenario: Navigation links resolve under basePath
- **WHEN** a user navigates between `/assessment` and `/dashboard`
- **THEN** all links and redirects resolve correctly under the `/wz-int-swe-best-practices` prefix

### Requirement: Jekyll bypass
The deployed site SHALL include a `.nojekyll` file at the root of the published directory so that GitHub Pages serves the `_next/` asset folder without filtering.

#### Scenario: Static assets load correctly
- **WHEN** the deployed site is opened in a browser
- **THEN** all JavaScript bundles and CSS files from `_next/` load without 404 errors

### Requirement: Automated deploy on push to main
A GitHub Actions workflow SHALL build the static site and deploy it to GitHub Pages on every push to the `main` branch.

#### Scenario: Push to main triggers deploy
- **WHEN** a commit is pushed to the `main` branch
- **THEN** the GitHub Actions workflow runs `npm ci && npm run build` and deploys the `out/` directory to GitHub Pages

#### Scenario: Deploy failure does not break the live site
- **WHEN** the build step fails
- **THEN** the previously deployed version remains live and the workflow reports a failure
