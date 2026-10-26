# A2 demo and submission checklist

## Demonstrate the five required functions

1. Open Home. Three real database records are selected randomly. Click **Shuffle selection** to request a new selection; overlap is normal.
2. Click **Explore all cafés**. Search for **Fitzroy**, or select a coffee style. Eight fictional Melbourne cafés are seeded in MariaDB.
3. Open a café. Show its image, description, bean origin, roast, tasting notes, price range and reviews. The average scores are calculated from stored reviews.
4. Choose **Sign up**. Register with a test email and a unique password. The new account opens **My account** and is stored in MariaDB.
5. Log out, then log in with that same account. Show that the profile remains available. An incorrect password must be rejected.

Additional working flow: save a café, reload the page, open **Favourites**, write a review, then edit and delete it from **My account**. One account may review each café once; it can edit its existing review.

## Submission items

- [x] React/TypeScript source, PHP API and local image/icon assets.
- [x] Importable database export: `database_export/sip_rate.sql` (schema and clean sample data).
- [x] English installation and operating instructions in `README.md`.
- [x] Automated integration test script and a truthful verification record.
- [x] Public project repository: https://github.com/mingshenyap666-hub/sip-and-rate-a2. Put this URL in the report. The lecturer's repository URL is attribution, not the team's submission URL.
- [ ] Run the application on the computer used for the classroom demonstration.
- [ ] Complete the 450–550 word progress report with the actual members' names and actual contributions. Verify the submission date and file naming in Canvas.

## Suggested responsibilities for three members

These are proposed roles, not a record of work already completed by any student.

| Role                      | Work to own and explain                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| Interface and integration | Figma comparison, React routes, responsive layout, forms and API error states            |
| Server and database       | PHP endpoints, registration/login, schema, queries, SQL import/export                    |
| Testing and report        | Run the demo checklist, record defects, update research/user flow and prepare the report |

Every member should run the app and understand the complete registration-to-review flow. Review the generated code together and record assistance and source use according to your course requirements.

## Report outline

Use approximately 450–550 words, following the assessment brief:

- Project purpose and chosen technology stack.
- Completed functionality with specific evidence from the running app.
- Work still pending, including deployment and any unverified environment setup.
- Each member's real contribution, with names and links to commits or other evidence.
- Tools and sources used; include the public team repository URL and lecturer starter attribution.

Do not claim that an AI-generated first implementation is work completed independently by a named group member. Replace this outline with the team's own accurate account before submission.
