# Pre-deployment QA — 17 November 2026

## Decision

The executed checks passed. No blocking application defect was found within this coverage. This is **not full browser acceptance or production sign-off**: authenticated browser journeys, the configured Docker stack and the eventual HTTPS host remain unverified. No public deployment was performed.

## Version and environment

- Branch: `feat/a3-account-deployment`.
- Functional baseline: remote commit `8103c3231ab6568dd32a6a94908ba40acbe30a1f` (same source tree as local `c660899`).
- Based on main `d257b41`, preserving the team's review-rating display changes.
- Final change in this QA pass: replace the stale A2 footer label with `INT1059 · Advanced Web · A3`.
- Built React assets served by Apache with actual PHP 8.4.27 and MariaDB 11.8.6. The API was not mocked.
- Disposable local database and synthetic API test accounts only. Submitted SQL remains unchanged.
- Chrome desktop browser; narrow-layout checks used the actual app in 390 px and 768 px same-origin frames. These were CSS viewport checks, not physical-phone or Safari tests.

## Executed automated checks

| Area | Result | Coverage |
| --- | --- | --- |
| API integration | **140 assertions passed** | Registration, login/logout, remember-me cookies, profile updates, search/filter/random results, review create/edit/delete, calculated ratings and favourites |
| Account security | Passed within the API suite | Wrong current password, duplicate email, email/password changes, password rules, CSRF rotation, old credentials rejected, other sessions invalidated and account data preserved |
| Access control | Passed within the API suite | Unauthenticated requests, missing CSRF token, cross-account isolation and review ownership checks |
| Throttling | Passed within the API suite | Failed-login and account-credential-change limits |
| Build and packaging | Passed | `npm run build:hosting` after the footer change; TypeScript and Vite completed |
| Lint | Passed | `npm run lint` after the footer change |
| PHP and SQL | Passed | PHP syntax checks and clean SQL import into disposable MariaDB |
| Apache routing | Passed | Direct application paths serve the SPA; private source, environment and SQL paths are not exposed as downloadable files |

The 140 API assertions ran before the final footer-only edit. The production build, lint and affected browser pages were checked again after that edit; no backend code changed in this QA pass.

## Executed browser checks

| Scenario | Observed result |
| --- | --- |
| Home | Three database-backed café cards, ratings and images rendered. All home-page images inspected reported loaded. |
| Shuffle | The visible three-card selection changed after clicking Shuffle in the narrow layout. |
| Suburb search | `Fitzroy` returned Little Ritual Coffee. |
| Bean-origin search | `Colombia` returned Little Ritual Coffee and Paper Cup Studio in the narrow layout. |
| No matching search | `zz-no-cafe-qa` showed zero results and the helpful empty state. |
| Cold brew filter | Returned Stillwater Coffee and Sunday Standard. |
| Café detail and direct load | Sunday Standard displayed its image, coffee metadata, price range, review and all three rating categories. Direct navigation/reload loaded the application. |
| Guest review action | Write a review redirected to login with the review path retained in `next`. |
| Guest favourite action | Save café redirected to login with the café path retained in `next`. |
| Login required fields | Submitting the empty form focused the email field and showed the browser's required-field prompt. |
| Registration required fields | Submitting the empty form focused Display name and showed the required-field prompt. No account was created through this browser. |
| Missing page | Unknown route displayed the recovery page; Back to discovery returned to Home. |
| Narrow layouts | Home, search results, café detail and registration fitted the 390 px frame. The collection fitted the 768 px frame. Measured page scroll widths equalled client widths (375/375 and 753/753 after scrollbar allowance). |
| Review rating layout | The narrow detail page retained Coffee, Atmosphere and Service scores without overflow in their container. |
| Updated footer | The final built pages displayed the A3 label. |

A local preview initially stalled under Apache's single-process debug mode. Running the disposable preview with normal prefork workers resolved it. This adjustment was confined to the ignored QA harness; it was not an application or deployment-code change. The temporary responsive wrapper is excluded from the hosting ZIP.

## Coverage still open

1. **Authenticated browser journeys:** successful registration/login, favourite persistence, review create/edit/delete and account changes were verified through the real HTTP API, but not end to end through signed-in browser controls in this run. Browser credential entry requires an interactive authentication handoff; it was not bypassed or recorded as passed.
2. **Account-form layout and keyboard feedback after login:** not covered by the public-page responsive checks.
3. **Target runtime:** Docker uses PHP 8.3 and MariaDB 10.11; those configured containers were not run in this environment.
4. **Deployment-specific checks:** stable public URL, TLS, secure cookies, host configuration, cross-device/network access and backup/restore on the actual host remain pending until hosting is selected.
5. **Browser/device diversity:** physical phones, Safari and Firefox were not tested.

Use `TEAM-TESTING.md` to record any subsequent acceptance work against the final commit. This report does not mark the entire checklist as passed.
