# Verification record

## A3 update: 17 November 2026

Based on `main` commit `d257b41`, including the team's merged review-rating display changes.

| Check | Executed result |
| --- | --- |
| TypeScript/Vite production build and hosting packaging | Passed (`npm run build:hosting`) |
| Oxlint | Passed |
| PHP syntax | Passed for backend and API entry files |
| Actual PHP/Apache/MariaDB integration | 140 assertions passed using PHP 8.4.27, Apache 2.4 and MariaDB 11.8.6 in a disposable local runtime |
| New account flows | Current-password validation, duplicate email rejection, email/password updates, CSRF rotation, old credentials rejected, other sessions invalidated, account/review/favourite preservation and credential-change throttling passed |
| Production URL routing | `/`, `/account`, `/cafes/1` and `/favourites` returned the built application through Apache |
| Private source/credential paths | `.env`, backend PHP source and SQL were not served as downloadable content |
| Clean SQL import | Imported successfully into the disposable MariaDB database |
| New account UI in a real browser/mobile viewport | Pending team acceptance testing |
| Production Docker image/Compose execution | Configuration prepared; not executed in this environment |
| Stable public hosting / HTTPS | Not deployed; requires the team's hosting account and actual URL |

The new tests ran against the packaged PHP-hosting directory, not a mock API. All test identities and credentials remained in an ignored, disposable validation environment. No schema migration is needed. The deployment files retain PHP 8.3 and MariaDB 10.11 as their configured versions; the new API tests used the locally available newer versions above, so container validation is still a separate pending check.

Follow `TEAM-TESTING.md` on the actual host before recording final acceptance. The 19 manual cases are not marked passed in advance.

## Original A2 verification

Verified on 26 October 2026. This record distinguishes executed checks from setup paths that still need a team check.

| Check                                                  | Result                                                                                         |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| TypeScript and Vite production build (`npm run build`) | Passed                                                                                         |
| Oxlint (`npm run lint`)                                | Passed, no warnings                                                                            |
| PHP syntax checks for all four entry/helper files      | Passed                                                                                         |
| PHP 8.3 API against actual MariaDB 10.11               | 80 integration assertions passed                                                               |
| Registered account storage                             | Two test accounts persisted with bcrypt hashes                                                 |
| Complete SQL export import                             | Export imported successfully into a second empty database                                      |
| Clean submission dataset                               | 8 cafés, 8 illustrative reviews, 0 active accounts                                             |
| Desktop browser rendering                              | Home typography, hero photo, navigation, filters and service-error state inspected             |
| Browser search form                                    | Entering Fitzroy navigated to the correct results route and heading                            |
| Full browser-to-PHP journey                            | Not verified in the hosted browser; the preview runtime could not access the local PHP service |
| Mobile device/browser checks                           | Responsive CSS implemented; actual mobile viewport QA still pending                            |
| Docker Compose / Dev Container / Codespaces            | Configuration supplied; not executed because a Docker engine was unavailable                   |
| Public GitHub repository                               | Uploaded to `mingshenyap666-hub/sip-and-rate-a2` (public)                                              |

The browser preview's missing API connection is an authoring-environment limitation. It was not replaced with a mock database. API integration checks ran through actual HTTP requests, PHP sessions and a MariaDB process in the same local test runtime.

## Integration coverage

`scripts/test-api.py` checked:

- Database health, collection size, three distinct random records, changing selections, search, style filters and missing café handling.
- Registration, bad registration data, case-insensitive duplicate email rejection, session persistence, logout, wrong-password rejection and successful re-login.
- Remember-me cookie expiry, stored profile changes and absence of password hashes in API responses.
- Rejection of unauthenticated private requests and requests missing their CSRF token.
- Idempotent favourites, isolation between accounts, persistence after re-login and removing a favourite.
- Rating validation, review creation, duplicate prevention, calculated averages, current author names, own-review listing, editing and deletion.
- Rejection of another user's attempts to edit or delete a review.
- Failed-login throttling after ten unsuccessful attempts in the configured window.

Test users were created only in disposable test databases. They are not included in the submitted SQL. The clean export was produced using `mariadb-dump` and restored separately to confirm the deliverable itself is importable.

## Remaining acceptance checks

On the team's demonstration machine, follow `DEMO-AND-SUBMISSION.md` with Docker or a local PHP/MariaDB installation. Confirm the complete browser registration-to-review flow, reload persistence, a narrow mobile viewport, and the public repository URL. No claim of production deployment, independent security audit or completed assessment submission is made.
