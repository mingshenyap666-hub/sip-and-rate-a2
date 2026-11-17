# Sip & Rate

An English coffee-review application for INT1059 Assessments 2 and 3. Built on the lecturer's React + PHP + MariaDB starter and adapted to the team's Sip & Rate Figma design.

## Current status — 17 November 2026

This README records the development work prepared by Ming Shen, explains how teammates can run the current version, and separates completed implementation from remaining deployment and acceptance work.

| Item | Current status |
| --- | --- |
| A3 implementation | Prepared in `feat/a3-account-deployment` |
| Merge into `main` | **Not merged.** Keep A3 separate until team review is complete. |
| Public website | **Not deployed.** Hosting setup is pending; there is no confirmed live testing URL. |
| Backend integration | **140 assertions passed** against real PHP and MariaDB |
| Browser checks | Public-page checks completed; full signed-in browser acceptance remains open |
| Deployment files | PHP-hosting package and production Docker configuration prepared |
| Assessment submission | Report, live demonstration/code viva and final submission still require team preparation |

**Open the [A3 branch](https://github.com/mingshenyap666-hub/sip-and-rate-a2/tree/feat/a3-account-deployment) to see the current work. The default `main` branch does not contain these A3 updates yet.** A branch can be deployed for testing before it is merged. The agreed next step is to publish this branch, let teammates test it, fix reported issues and then merge the accepted version.

## Development work completed, step by step

### 1. Establish the project and design

Started from the lecturer's repository and retained its Git history and React + PHP + MariaDB stack. Prepared the initial Sip & Rate Figma mockup and used the team's design to guide the English interface, colours, typography, coffee imagery and page layout. The original lecturer README and schema remain in `docs/` for attribution and comparison.

### 2. Build the React pages

Implemented Home/Discover, café details, registration/login, My Account, Favourites and the review editor in `src/views/`. Added shared navigation, café cards, status messages and buttons in `src/components/`, plus responsive rules in `src/styles.css`. Included loading, error, empty and missing-page states and labelled form controls.

### 3. Prepare the MariaDB database

Adapted the starter schema for accounts, display names, cafés, images, reviews and favourites, with failed-login tracking. Added eight fictional Melbourne cafés and illustrative reviews. Included the schema, seed and combined `database_export/sip_rate.sql` export. The combined file was imported into an empty disposable database to verify it. Real test accounts are not included in the clean submission SQL.

### 4. Connect the interface to PHP and real data

Implemented routes in `backend/api.php`, shared PDO/session helpers in `backend/bootstrap.php`, and the typed React API client in `src/lib/api.ts`. Added search by café name, suburb or bean origin, coffee-style filters, three random Home cards and Shuffle. Detail pages show coffee metadata, prices, reviews and ratings calculated from database records.

### 5. Implement accounts, favourites and reviews

Added registration, login, logout, remembered sessions and display-name updates. Added private saved cafés and review creation, editing and deletion with Coffee, Atmosphere and Service ratings. Reviews and favourites persist in MariaDB. Users can edit/delete only their own reviews, and duplicate reviews for the same user/café are rejected. Implemented input validation, prepared SQL, password hashing, CSRF checks, session handling, ownership checks and failed-login throttling.

### 6. Preserve the team's merged work

Built the A3 update on `main` commit `d257b41`, which includes [PR #1: review-rating display](https://github.com/mingshenyap666-hub/sip-and-rate-a2/pull/1). Retained the teammate's per-review Coffee, Atmosphere and Service score display. This is an existing team contribution, not a new change attributed to Ming Shen in the A3 update.

### 7. Add A3 email and password settings

Added Change email and Change password forms in `src/views/AccountSecurity.tsx`, displayed within My Account, and the corresponding `PUT /api/account/email` and `PUT /api/account/password` routes. Both operations require the current password. Validation rejects duplicate/invalid emails and invalid password changes. Successful changes preserve the account, reviews and favourites, rotate the current session/CSRF token, and invalidate other sessions for that account. No database schema migration is required for this A3 update.

### 8. Prepare deployment files

Added production Apache routing in `public/.htaccess` so React routes can be opened directly or refreshed. Added `npm run build:hosting` and an explicit packaging allowlist in `scripts/package-hosting.mjs` to exclude local credentials. Added the production `Dockerfile`, `compose.production.yaml` and PHP session configuration. Prepared source and hosting ZIPs, and changed the old A2 footer to `INT1059 · Advanced Web · A3`. These files are prepared; no public deployment has been completed.

### 9. Run checks and record results

| Check | Executed result |
| --- | --- |
| TypeScript, Vite build, hosting packaging and Oxlint | Passed |
| PHP syntax and clean SQL import | Passed |
| Real HTTP API integration | 140 assertions passed using PHP 8.4.27, Apache and MariaDB 11.8.6 |
| Public browser flows | Checked Home, Shuffle, search, empty results, Cold brew filtering, details, rating display, guest login redirects, required fields and missing-page recovery |
| Narrow public-page layouts | Checked actual pages in 390 px and 768 px frames; no page overflow on the covered pages |

The API suite covers accounts, reviews, favourites, email/password changes, session invalidation, CSRF, ownership and throttling against a real database. **Still unverified:** complete signed-in browser journeys, logged-in account-form layout/keyboard feedback, physical mobile devices, the configured PHP 8.3/MariaDB 10.11 Docker stack, and an actual public HTTPS deployment. Passing API checks does not mean all browser acceptance cases have passed.

See [QA results](docs/QA-RESULTS.md) and [verification history](docs/VERIFICATION.md). Further local browser testing was paused so the next acceptance round can be performed by teammates on the hosted branch.

### 10. Prepare the team handover

Uploaded the A3 implementation, deployment instructions and test results to the A3 branch. Added the [19-case team checklist](docs/TEAM-TESTING.md) with expected results and an issue-report template. Hosting registration has been explored, but no host, database or public URL is confirmed as configured. The remaining deployment and team tasks are listed below.

## What works

- A live MariaDB collection of eight fictional Melbourne cafés.
- Home displays three randomly selected records; Shuffle requests another selection.
- Search by café name, suburb or bean origin; filter by coffee style.
- Detail pages with images, descriptions, coffee metadata and calculated ratings.
- Registration, login, logout, remembered sessions, and editable display names, email addresses and passwords.
- Private saved cafés, plus creation, editing and deletion of your own reviews.
- Responsive English UI, loading/error/empty states and accessible form labels.

This is a working application with a real database, not a static Figma export. The café listings, sample prices and sample reviews are fictional educational content. There are no preconfigured public login credentials: register a new test account.

## Get the correct version

For a new checkout:

```sh
git clone --branch feat/a3-account-deployment https://github.com/mingshenyap666-hub/sip-and-rate-a2.git
cd sip-and-rate-a2
```

If you already have a checkout, save or commit your own work before switching branches:

```sh
git fetch origin
git switch feat/a3-account-deployment
git pull --ff-only origin feat/a3-account-deployment
```

If Git refuses the pull or reports conflicts, preserve your local work and resolve the branch state before continuing; do not force-reset your changes.

Choose **one** setup method below. Docker runs PHP and MariaDB for you; the local method requires those programs separately.

## Start with Docker

Install Node.js 22.12+ and Docker Desktop / Docker Compose v2. Start Docker, then open a terminal in this project folder:

```sh
npm run setup
docker compose up --build
```

Open **http://localhost:5173** after the frontend reports that Vite is ready. The first launch downloads dependencies and imports `database_export/sip_rate.sql` automatically. PHP runs in its own container and MariaDB in another. Only the frontend port is exposed to your computer.

`npm run setup` creates an ignored `.env` with new random database passwords. It preserves an existing `.env`. Keep it private and keep the database password unchanged when reusing an existing database volume.

Stop with Ctrl+C, then `docker compose down`. The database remains in a named volume. Do **not** add `--volumes` unless you intend to erase all registered accounts, favourites and reviews. The SQL seed is imported only when the database volume is empty.

Docker configuration is included but was not executed in the authoring environment, which had no Docker engine. The latest A3 API run used a direct PHP 8.4.27/MariaDB 11.8.6 runtime. Earlier A2 results are recorded separately in [VERIFICATION.md](docs/VERIFICATION.md).

## Start with local PHP and MariaDB

Requirements: Node.js 22.12+, PHP 8.3+ with `pdo_mysql` and `mbstring`, and MariaDB 10.11. PHP sessions must have a writable save directory. No Composer packages are required by this API.

```sh
npm ci
npm run setup
```

Edit `.env` to match your MariaDB connection. The `DB_ROOT_PASSWORD` variable is used only by Docker; it does not change the password of an existing local database server.

Create an empty database and a development user using a database administrator account. Replace the password below with your chosen `DB_PASSWORD` from `.env`:

```sql
CREATE DATABASE sip_rate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sip_rate'@'127.0.0.1' IDENTIFIED BY 'YOUR_DB_PASSWORD';
GRANT ALL PRIVILEGES ON sip_rate.* TO 'sip_rate'@'127.0.0.1';
USE sip_rate;
SOURCE /absolute/path/to/project/database_export/sip_rate.sql;
```

Use the actual absolute SQL file path, with forward slashes. You may instead import that file into the empty `sip_rate` database using a database GUI. Import the combined file **once**; do not also import `schema.sql` and `seed.sql`.

```sh
npm run dev:all
```

This starts PHP at `127.0.0.1:8080` and Vite at `localhost:5173`. Open the Vite address. If your PHP executable is not on PATH, set `PHP_BIN` in your local `.env` to its executable path. PHP errors are logged in the terminal.

`npm run dev` starts only React/Vite. Use it when PHP is already running separately. `API_TARGET` can point Vite at another PHP server. The frontend always uses relative `/api` requests, so no separate browser API URL or permissive CORS policy is needed.

## VS Code Dev Container / Codespaces

The included dev container uses the same Compose services and opens `/workspace`. Select the A3 branch when creating a Codespace, or switch to it in an existing checkout. After creation, run `npm run dev` in its terminal and open forwarded port 5173. PHP and MariaDB are started by Compose. Node must be available to the host initialization command that creates `.env`; Codespaces supplies Node. This path is provided but has not been tested in this QA run.

## Build and test

```sh
npm run build
npm run lint
```

The build writes `dist/`. That is the frontend build output; it still requires the PHP API and MariaDB. GitHub Pages alone cannot run PHP or MariaDB. Do not upload a folder containing `.env` as a static site.

For integration checks against a **disposable development database containing the clean eight-café seed**, start the full application and run:

```sh
python scripts/test-api.py
```

Python 3 is required; no pip packages are used. The default endpoint is `http://127.0.0.1:8080/api`. For Docker, use the frontend's API proxy. In PowerShell:

```powershell
$env:API_BASE = "http://localhost:5173/api"
python scripts/test-api.py
```

Or in Bash:

```sh
API_BASE=http://localhost:5173/api python3 scripts/test-api.py
```

The script creates two unique test accounts and removes its own reviews/favourites; the accounts remain. It expects the supplied seed, including an initially unreviewed café. Do not run it against a production database or a shared database containing team acceptance data.

## How teammates should test

Once a hosted URL is available, teammates can test in their browsers without installing development tools. Until then, use a local setup above.

1. Record the branch/commit, URL, date, browser and device.
2. Browse, search and filter cafés; open a detail page and refresh it.
3. Register a disposable account, log out and log in again.
4. Save a café, refresh and log out/in to check persistence; then remove it.
5. Create a review with three ratings, edit it and delete it; check the displayed text and averages.
6. Change the display name, email and password. Check invalid inputs and confirm that updated credentials work while the old ones do not.
7. Check a second account, another browser session and a narrow/mobile layout using the full checklist.
8. Report issues with the page, reproduction steps, expected/actual results and a screenshot. Do not include passwords or private database credentials.

Use [TEAM-TESTING.md](docs/TEAM-TESTING.md) to record actual outcomes. A blank result is pending, not a pass.

## Deploy the A3 branch — still pending

Build from `feat/a3-account-deployment` and record the deployed commit. Deployment does not require merging first. A PHP-hosting deployment follows these steps:

1. Obtain hosting with PHP 8.3+, `pdo_mysql`, `mbstring`, Apache rewrite support, MariaDB and HTTPS.
2. Prepare the package from the A3 checkout:

   ```sh
   npm ci
   npm run build:hosting
   ```

3. Create an empty database and import the packaged `hosting/sip_rate.sql` once.
4. Upload the contents of `hosting/public_html/` as the web root. Place `hosting/backend/` outside that public directory, as its sibling.
5. Copy `hosting/.env.example` to a private `.env` beside `backend/`, enter the host's database settings and use `SECURE_COOKIES=1` for HTTPS. Keep credentials, SQL and source archives outside the public web root.
6. Enable HTTPS, check `/api/health`, and verify direct navigation/refresh of `/account` and `/cafes/1`.
7. Share the actual HTTPS URL with teammates and run acceptance checks before recording deployment as complete.

The packaging script rebuilds `hosting/`; keep host credentials outside that generated directory. Full directory requirements, the production Docker option and troubleshooting are in [DEPLOYMENT.md](docs/DEPLOYMENT.md). Production Docker needs an existing server and HTTPS reverse proxy and has not been deployed.

## Team branch and merge workflow

For additional work, create a separate feature branch from the current A3 branch:

```sh
git switch feat/a3-account-deployment
git switch -c feature/your-change
```

Commit and push your work, then open a pull request targeting `feat/a3-account-deployment` while A3 is being assembled. Explain what changed and how it was checked. After hosted testing and fixes, open the final A3 pull request to `main` and agree on a reviewer/merger within the team. The deployed version and `main` are not automatically the same version.

## Export the database

The included `database_export/sip_rate.sql` contains the full schema and clean demonstration content. To export your own Docker database after adding data, use a Bash-compatible terminal from the project root:

```sh
sh scripts/export-db.sh
```

This creates `database_export/sip_rate-current.sql`. Inspect your export before including it in a public repository: live user emails and password hashes are sensitive. The supplied clean export contains only inactive fictional demonstration accounts.

## Project structure

| Path                    | Purpose                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| `src/views/`            | Discovery, details, authentication, account, favourites, review editor |
| `src/components/`       | Shared navigation, cards, status messages and footer                   |
| `src/lib/`              | Typed API client, request state and authentication context             |
| `src/styles.css`        | Figma colours, typography, layout and responsive rules                 |
| `backend/api.php`       | HTTP routes, input validation and ownership checks                     |
| `backend/bootstrap.php` | Environment, PDO, sessions and shared query helpers                    |
| `public/`               | Original coffee photos, exported icons and Apache API entry point      |
| `database_export/`      | Schema, seed and combined SQL export                                   |
| `compose.yaml`          | React, PHP and MariaDB development services                            |
| `Dockerfile` / `compose.production.yaml` | Prepared production container configuration                  |
| `scripts/package-hosting.mjs` | Creates the PHP-hosting package from an explicit file allowlist          |
| `scripts/test-api.py` | Real HTTP API integration checks                                          |
| `docs/`                 | Architecture, demo, submission and verification notes                  |

## Public GitHub repository

The project is published at https://github.com/mingshenyap666-hub/sip-and-rate-a2.
It is a public fork of the lecturer starter and includes the original commit history.
Use this project URL in the assessment report.

Use the branch-specific commands in **Get the correct version** above for the latest A3 work.

The repository excludes local passwords, installed dependencies and disposable test accounts. The clean SQL export is included in `database_export/sip_rate.sql`. Keep each group member's changes in Git so actual contributions remain traceable.

## Before submission

The team still needs to:

1. Confirm a stable hosted HTTPS URL and record the exact accepted Git commit.
2. Test the hosted branch, fix reported issues and merge the accepted A3 version into `main`.
3. Prepare the **full source ZIP**, clean SQL and README. Include source, configuration and assets, not only `dist/` or `hosting/`. Exclude `.env`, installed dependencies and disposable QA files.
4. Complete the required **450–550-word English PDF report** with team names/IDs, actual contributions, the website URL and the public GitHub repository link.
5. Prepare the live demonstration and each member's explanation of the code. Confirm the final deadline and submission instructions in the assessment brief and Canvas.

Follow [TEAM-TESTING.md](docs/TEAM-TESTING.md) and [DEPLOYMENT.md](docs/DEPLOYMENT.md). The older `docs/DEMO-AND-SUBMISSION.md` records the A2 walkthrough. See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for attribution and scope. Email verification, forgotten-password email recovery, café administration, payments and food ordering are not implemented; authenticated email/password changes are implemented.

The implementation and documentation were prepared with AI assistance. Each member should review and understand the code they present and follow the course's disclosure requirements. This README records project progress; it does not mean the assessment has been submitted.

Starter: https://github.com/johannesmx/AW-project-26T3

Design: https://www.figma.com/design/1NODjdh6W3yms4VBdvi6fP?node-id=14-64
