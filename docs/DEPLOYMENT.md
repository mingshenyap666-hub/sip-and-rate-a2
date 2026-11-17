# Sip & Rate: A3 deployment

The application keeps the course stack: React, PHP and MariaDB. GitHub stores the source; it does not run the PHP API. A grading URL must serve the frontend, API and database together and remain available during marking.

## Option A: PHP/Apache hosting with a database

Use an account that supports PHP 8.3 or newer, the `pdo_mysql` and `mbstring` extensions, Apache 2.4 with `mod_rewrite` and `.htaccess` overrides, HTTPS, and a MariaDB database. No Node.js server is required on this host: Node is used to build the frontend locally.

1. Run `npm ci`, then `npm run build:hosting` on a development computer.
2. Create an empty MariaDB database and a user restricted to that database in the hosting panel. Import `database_export/sip_rate.sql` once using the panel's database tool. Do not import the seed over a database containing real users.
3. The generated `hosting/public_html/` directory is the **only public directory**. Upload its contents, including `.htaccess`, to the site's document root. Upload `hosting/backend/` to a sibling directory outside the document root. The required layout is:

   - account directory: `.env` and `backend/`
   - web document root inside that directory: `public_html/`, containing `index.html`, `.htaccess`, `assets/`, `images/`, `icons/` and `api/`

   The `public_html/api/index.php` entry point loads `../../backend/api.php`. If your host uses another layout, preserve this relative relationship or update that one require path. Do not place database exports, credentials, Git metadata or source archives inside the web document root.
4. Copy the provided `.env.example` to `.env` in the account directory, alongside `backend/`. Set `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` and `DB_PASSWORD` to the hosting panel's database values. Set `SECURE_COOKIES=1`. Keep the file readable by PHP but inaccessible to web visitors. `DB_ROOT_PASSWORD` is not needed on shared hosting.
5. Enable the host's HTTPS certificate and redirect HTTP to HTTPS. This build is intended for the root of a domain or subdomain, not a URL subfolder. PHP session storage must be writable.
6. Check `https://YOUR-HOST/api/health` returns `{"ok":true}`. Open `/account` and a café detail URL directly and refresh: the React application should load rather than returning an Apache 404.
7. Run the manual acceptance checklist in `TEAM-TESTING.md`. Confirm `.env`, `/backend/bootstrap.php` and `/sip_rate.sql` are not downloadable. Confirm the URL works from another device and remains available during marking.

No hosting credentials or chosen production URL are stored in this repository. Do not claim deployment is complete until these steps have been performed against the actual host.

## Option B: production Docker on an existing server

The root `Dockerfile` builds React once and serves the result with PHP/Apache. `compose.production.yaml` adds MariaDB and persistent database/session volumes. It does not use Vite's development server.

On a server with Docker Compose v2:

```sh
node scripts/setup-env.mjs
docker compose -f compose.production.yaml up -d --build
```

Before starting the public deployment, set `SECURE_COOKIES=1` in the generated private `.env`. The setup script defaults to `0` for local development. Configure the server's HTTPS reverse proxy to forward the domain to `127.0.0.1:8080` (or the configured `WEB_PORT`). Keep the database private; no database port is published. Set up the TLS certificate and domain in that server's hosting system. A public HTTPS reverse proxy is required: the Compose port is intentionally bound to loopback.

For a local smoke test only, use `SECURE_COOKIES=0` and open `http://localhost:8080`. Restore `1` for the HTTPS deployment.

The clean SQL is imported only on a new empty volume. Do not use `down --volumes` on an existing deployment. Back up the database before an update. Keep live database exports private; the repository's SQL contains clean fictional demonstration data.

## Update an existing A2 installation

No database schema migration is required for these A3 account changes. Preserve the existing database and private `.env`, rebuild the frontend, and update the PHP files. Existing sessions from A2 will require a fresh login once because the new version checks a credential fingerprint. Changing an email or password subsequently signs out other sessions while preserving the current session, reviews and favourites.

## Common deployment failures

| Symptom | Check |
| --- | --- |
| Home works but a refreshed detail/account route returns 404 | Confirm `.htaccess` was uploaded, `mod_rewrite` is enabled, overrides are allowed and the document root is correct. |
| `/api/health` returns 503 | Check database credentials, the database import, PHP extensions and private PHP error logs. |
| Login does not persist | Verify writable PHP session storage and match `SECURE_COOKIES=1` to HTTPS. |
| HTML is returned instead of API JSON | Check the API rewrite and its backend require path. |
| A hosting panel only supports static assets | It cannot run this PHP/MariaDB application by itself. |

Technical references: [Apache rewrite documentation](https://httpd.apache.org/docs/2.4/rewrite/), [PHP sessions](https://www.php.net/manual/en/book.session.php), [PHP password hashing](https://www.php.net/manual/en/function.password-hash.php).
