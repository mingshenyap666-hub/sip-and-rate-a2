# Verification record

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
