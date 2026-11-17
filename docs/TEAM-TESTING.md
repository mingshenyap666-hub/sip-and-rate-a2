# A3 team acceptance checklist

Test the completed build using your own disposable accounts. Record the tested branch/commit, website URL, date, tester, device and browser. The author runs automated API checks; teammates independently verify the visible website and report issues before the final report/submission.

## Test cases

| ID | Action | Expected result | Result / evidence |
| --- | --- | --- | --- |
| 01 | Open Home and use Shuffle repeatedly. | Three café cards load from the database; the selection can change. | |
| 02 | Search by café name, suburb and bean origin; try a nonexistent term. | Matching records or a helpful empty state appear. | |
| 03 | Use each coffee-style filter and navigation dropdown. | Correct cafés and pages appear; links work. | |
| 04 | Open a café detail page. | Description, metadata, image, review list and rating categories appear. | |
| 05 | Register a new account, then try the same email again. | Registration logs in; duplicate registration is rejected. | |
| 06 | Log out and try wrong and correct login credentials. | Wrong credentials fail; correct ones work. | |
| 07 | Add a favourite, refresh, log out/in, then remove it. | Saved state persists and removal persists. | |
| 08 | Write a review with three ratings; edit it; delete it. | Text and average ratings update correctly at every step. | |
| 09 | Change your display name and refresh. | The header, account and review author use the new name. | |
| 10 | Change email with a wrong current password and an already-used email. | Clear errors appear; original credentials still work. | |
| 11 | Change email correctly, then log out/in. | New email works; old email fails; existing reviews and favourites remain. | |
| 12 | Try a short password, mismatched confirmation and wrong current password. | Each invalid change is rejected. | |
| 13 | Change password correctly, then log out/in. | New password works; old password fails; account data remains. | |
| 14 | Sign into one account in two browsers, then change email or password in one. | Current browser stays signed in; the other session is signed out on its next authenticated request. | |
| 15 | Use a second account. | It sees its own favourites/reviews and cannot edit or delete another user's review. | |
| 16 | Open `/account` and a café detail URL directly, then refresh. | Deployed routing works without a server 404. | |
| 17 | Use a phone or a narrow browser viewport. | Menus, account forms and cards remain readable and usable without horizontal overflow. | |
| 18 | Use keyboard Tab/Enter on account forms and error states. | Controls have labels, visible focus and readable success/error feedback. | |
| 19 | Open the hosted URL on a different device/network. | HTTPS, API, images and database-backed features work. | |

## Report an issue

- Test case / page URL:
- Device and browser:
- Steps to reproduce:
- Expected result:
- Actual result:
- Screenshot or error text:
- Severity: blocks use / incorrect result / visual issue

Do not include passwords, session cookies or private database credentials in screenshots or GitHub issues. Do not mark a case as passed until you actually perform it.

## Before Canvas submission

- Resolve blocking issues and repeat only the affected flows.
- Record the final Git commit and stable HTTPS website URL.
- Include the full source ZIP, clean SQL, deployment instructions and required 450-550-word PDF report with names, IDs and actual contributions.
- Practise the live website demonstration and each person's explanation of the code. Account management changes do not replace that individual preparation.
