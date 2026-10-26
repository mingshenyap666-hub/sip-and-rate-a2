# How Sip & Rate works

## Request flow

The React browser application calls relative `/api` URLs. In development Vite forwards these requests to PHP. Apache or the PHP development router sends API requests to `backend/api.php`. PHP validates input, checks the session, executes prepared MariaDB queries through PDO and returns JSON. React renders that response. Passwords and database credentials never need to reach the browser.

## Tables

| Table                 | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| Account               | Unique email, bcrypt password hash and account status                      |
| User                  | Display name and one-to-one Account link                                   |
| Product               | The lecturer's collection-item table, adapted to cafés and coffee metadata |
| Image / Product_Image | Local café images and their product links                                  |
| Review                | Author, café, review text and three ratings; unique per author and café    |
| Favourite             | Private user-to-café relationship                                          |
| LoginAttempt          | Short-lived failed-login counters for throttling                           |

The six original entity names are retained where useful. The original `User.Name` integer field is corrected to text. Additional attributes and constraints make the coffee-review domain functional.

## API

| Method       | Path                  | Behaviour                                         |
| ------------ | --------------------- | ------------------------------------------------- |
| GET          | `/api/health`         | Confirms database connectivity                    |
| GET          | `/api/auth/me`        | Current user and CSRF token                       |
| POST         | `/api/auth/register`  | Validate and create account; sign in              |
| POST         | `/api/auth/login`     | Verify password and rotate session                |
| POST         | `/api/auth/logout`    | Clear authentication and rotate session           |
| GET          | `/api/cafes`          | Collection; optional `q`, `style`, `random=1`     |
| GET          | `/api/cafes/:id`      | Detail, metadata, reviews and calculated averages |
| GET          | `/api/favourites`     | Current user's saved cafés                        |
| PUT / DELETE | `/api/favourites/:id` | Save or unsave a café                             |
| PUT          | `/api/account`        | Change current user's display name                |
| GET          | `/api/reviews/mine`   | Current user's reviews                            |
| POST         | `/api/reviews`        | Add a review                                      |
| PUT / DELETE | `/api/reviews/:id`    | Edit or delete an owned review                    |

Mutation requests use JSON, a same-origin session cookie and `X-CSRF-Token`. Registration returns 201; invalid data 422; unauthenticated access 401; forbidden changes 403; missing records 404; duplicates 409; login throttling 429.

## Scope and content

The collection is **live database data**: requests query MariaDB and reviews/accounts/favourites persist. It is not a live Google Maps feed. The eight cafés and sample reviews are fictional educational content and are labelled accordingly in the interface. The three project coffee photos are reused across the collection.

Implemented safeguards include prepared statements, password hashing, HttpOnly SameSite cookies, session rotation and expiry, CSRF validation, ownership checks, server-side validation and failed-login throttling. This is an assessed student application, not a security-audited production service.

Email verification, forgotten-password email, account deletion, café administration, maps, uploads and public production hosting are outside this first version. No payment or food-ordering functionality is included.

## Sources and provenance

- Lecturer starter: https://github.com/johannesmx/AW-project-26T3
- Starting commit: `943c30304ce2e9e5d79f41b874c03070b1219e0e`
- Team Figma: https://www.figma.com/design/1NODjdh6W3yms4VBdvi6fP?node-id=14-64
- The original lecturer README and schema are retained in `docs/` for comparison.
- Lora and Arimo are installed through Fontsource and bundled locally. Their packages include the relevant open font licences.
- Coffee images are the project's existing generated assets, recovered from the original Sip & Rate mockup package. SVG icons are exported from the existing Figma design.
- This first implementation and its documentation were prepared with AI assistance and require the group's review and understanding before submission.
