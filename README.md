# Sip & Rate

An English coffee-review application for INT1059 Assessment 2. Built on the lecturer's React + PHP + MariaDB starter and adapted to the team's Sip & Rate Figma design.

## What works

- A live MariaDB collection of eight fictional Melbourne cafés.
- Home displays three randomly selected records; Shuffle requests another selection.
- Search by café name, suburb or bean origin; filter by coffee style.
- Detail pages with images, descriptions, coffee metadata and calculated ratings.
- Registration, login, logout, remembered sessions and editable display names.
- Private saved cafés, plus creation, editing and deletion of your own reviews.
- Responsive English UI, loading/error/empty states and accessible form labels.

This is a working application with a real database, not a static Figma export. The café listings, sample prices and sample reviews are fictional educational content. There are no preconfigured public login credentials: register a new test account.

## Start with Docker (recommended for a consistent team setup)

Install Node.js 22.12+ and Docker Desktop / Docker Compose v2. Start Docker, then open a terminal in this project folder:

```sh
npm run setup
docker compose up --build
```

Open **http://localhost:5173** after the frontend reports that Vite is ready. The first launch downloads dependencies and imports `database_export/sip_rate.sql` automatically. PHP runs in its own container and MariaDB in another. Only the frontend port is exposed to your computer.

`npm run setup` creates an ignored `.env` with new random database passwords. It preserves an existing `.env`. Keep it private and keep the database password unchanged when reusing an existing database volume.

Stop with Ctrl+C, then `docker compose down`. The database remains in a named volume. Do **not** add `--volumes` unless you intend to erase all registered accounts, favourites and reviews. The SQL seed is imported only when the database volume is empty.

Docker configuration is included but was not executed in the authoring environment, which had no Docker engine. The PHP API and SQL were tested directly against PHP 8.3 and MariaDB 10.11; see `docs/VERIFICATION.md`.

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

The included dev container uses the same Compose services and opens `/workspace`. After creation, run `npm run dev` in its terminal and open the forwarded port 5173. The PHP service and database are already started by Compose. Node must be available to the host initialization command that creates `.env`; Codespaces supplies Node. This path is provided but has not been tested here.

## Build and test

```sh
npm run build
npm run lint
```

The build writes `dist/`. That is the frontend build output; it still requires the PHP API and MariaDB. GitHub Pages alone cannot run PHP or MariaDB. Do not upload a folder containing `.env` as a static site.

For integration checks against a **disposable development database**, start the full application and run:

```sh
python scripts/test-api.py
```

Python 3 is required; no pip packages are used. The default endpoint is `http://127.0.0.1:8080/api`. For Docker, set `API_BASE` to `http://localhost:5173/api` in the terminal environment before running the script. The script creates two unique test accounts, checks authentication and ownership boundaries, and removes its test reviews/favourites. The test accounts remain, so do not run this script against a real user database.

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
| `docs/`                 | Architecture, demo, submission and verification notes                  |

## Public GitHub repository

The project is published at https://github.com/mingshenyap666-hub/sip-and-rate-a2.
It is a public fork of the lecturer starter and includes the original commit history.
Use this project URL in the assessment report.

To get a fresh working copy:

```sh
git clone https://github.com/mingshenyap666-hub/sip-and-rate-a2.git
cd sip-and-rate-a2
npm run setup
docker compose up --build
```

The repository excludes local passwords, installed dependencies and disposable test accounts. The clean SQL export is included in `database_export/sip_rate.sql`. Keep each group member's changes in Git so actual contributions remain traceable.

## Before submission

Run the walkthrough in `docs/DEMO-AND-SUBMISSION.md` on the demonstration computer. Confirm the required report wording, real team contributions and current submission instructions in Canvas. Read `docs/ARCHITECTURE.md` for source attribution and scope. Email verification, password-reset email, café administration and public production hosting are outside this first version.

Starter: https://github.com/johannesmx/AW-project-26T3

Design: https://www.figma.com/design/1NODjdh6W3yms4VBdvi6fP?node-id=14-64
