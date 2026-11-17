"""Integration tests against a running PHP + MariaDB instance.

Run only against a disposable development database. Two unique test accounts remain;
test reviews and favourites are removed. No external libraries are required.
"""
import http.cookiejar
import json
import os
import secrets
import urllib.error
import urllib.request

BASE = os.environ.get("API_BASE", "http://127.0.0.1:8080/api").rstrip("/")
checks = 0


def check(condition, label):
    global checks
    assert condition, label
    checks += 1
    print("PASS " + label)


class Client:
    def __init__(self):
        self.jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.jar))
        self.csrf = ""
        self.request("GET", "/auth/me")

    def request(self, method, path, data=None, expected=200, csrf=True):
        headers = {"Accept": "application/json"}
        if method != "GET":
            headers["Content-Type"] = "application/json"
            if csrf:
                headers["X-CSRF-Token"] = self.csrf
        request = urllib.request.Request(BASE + path, data=json.dumps(data).encode() if data is not None else None, headers=headers, method=method)
        try:
            response = self.opener.open(request, timeout=10)
        except urllib.error.HTTPError as error:
            response = error
        result = json.loads(response.read())
        assert response.status == expected, (method, path, response.status, expected, result)
        if "csrf" in result:
            self.csrf = result["csrf"]
        check(True, method + " " + path + " -> " + str(expected))
        return result


a, b, guest = Client(), Client(), Client()
a.request("GET", "/health")
all_cafes = a.request("GET", "/cafes")["cafes"]
check(len(all_cafes) == 8, "All eight seeded cafés come from the database")
random_sets = [tuple(c["id"] for c in a.request("GET", "/cafes?random=1")["cafes"]) for _ in range(5)]
check(all(len(set(row)) == 3 for row in random_sets), "Random selections contain three distinct cafés")
check(len(set(random_sets)) > 1, "Repeated home requests produce different selections")
filtered = a.request("GET", "/cafes?style=Filter")["cafes"]
check(all("Filter" in c["style"] for c in filtered) and len(filtered) > 0, "Coffee style filtering")
found = a.request("GET", "/cafes?q=Fitzroy")["cafes"]
check(len(found) == 1 and found[0]["suburb"] == "Fitzroy", "Search by suburb")
check(a.request("GET", "/cafes?q=%27%20OR%201%3D1%20--")["cafes"] == [], "SQL-like search input is treated as data")
a.request("GET", "/cafes/999999", expected=404)
guest.request("GET", "/favourites", expected=401)
guest.request("POST", "/reviews", {}, expected=401)
guest.request("POST", "/auth/register", {}, expected=403, csrf=False)
guest.request("POST", "/auth/register", {"name":"A","email":"invalid","password":"123"}, expected=422)

suffix = secrets.token_hex(6)
password = "Testing-" + secrets.token_hex(12)
email_a, email_b = f"qa-{suffix}-a@example.test", f"qa-{suffix}-b@example.test"
registered = a.request("POST", "/auth/register", {"name":"QA Coffee A","email":email_a,"password":password}, expected=201)
user_a = registered["user"]["id"]
check(registered["user"]["email"] == email_a, "Registration creates and signs in a real account")
check("password" not in json.dumps(registered).lower(), "API never returns password hashes")
b.request("POST", "/auth/register", {"name":"QA Coffee B","email":email_b,"password":password}, expected=201)
guest.request("POST", "/auth/register", {"name":"Duplicate","email":email_a.upper(),"password":password}, expected=409)
check(a.request("GET", "/auth/me")["user"]["id"] == user_a, "Session cookie survives subsequent requests")
a.request("POST", "/auth/logout", {})
check(a.request("GET", "/auth/me")["user"] is None, "Logout clears authentication")
a.request("POST", "/auth/login", {"email":email_a,"password":"wrong-password"}, expected=401)
a.request("POST", "/auth/login", {"email":email_a,"password":password,"remember":True})
check(any(c.expires is not None for c in a.jar), "Remember me sets a persistent session cookie")
a.request("PUT", "/account", {"name":"QA Updated"})
check(a.request("GET", "/auth/me")["user"]["name"] == "QA Updated", "Profile changes persist")

a.request("PUT", "/favourites/1", {})
a.request("PUT", "/favourites/1", {})
check(len(a.request("GET", "/favourites")["cafes"]) == 1, "Saving twice creates one favourite")
check(b.request("GET", "/favourites")["cafes"] == [], "Favourites are private to each account")
a.request("POST", "/auth/logout", {})
a.request("POST", "/auth/login", {"email":email_a,"password":password})
check(a.request("GET", "/favourites")["cafes"][0]["id"] == 1, "Favourite persists after logout and login")

cafe_id = 8
review = {"cafeId":cafe_id,"title":"A balanced flat white","body":"Clean finish, friendly service and a comfortable place to enjoy coffee.","coffee":5,"atmosphere":4,"service":5}
a.request("POST", "/reviews", {**review, "coffee":6}, expected=422)
rid = a.request("POST", "/reviews", review, expected=201)["id"]
a.request("POST", "/reviews", review, expected=409)
detail = a.request("GET", "/cafes/8")
check(detail["cafe"]["rating"] == 5 and detail["cafe"]["reviewCount"] == 1, "New review updates aggregate score and count")
check(detail["reviews"][0]["author"] == "QA Updated", "Details show the review and current author")
b.request("PUT", f"/reviews/{rid}", review, expected=403)
b.request("DELETE", f"/reviews/{rid}", {}, expected=403)
a.request("PUT", f"/reviews/{rid}", {**review,"coffee":3,"title":"Updated coffee review"})
check(a.request("GET", "/cafes/8")["cafe"]["rating"] == 3, "Editing updates the real average")
check(a.request("GET", "/reviews/mine")["reviews"][0]["id"] == rid, "My account lists my review")
a.request("DELETE", f"/reviews/{rid}", {})
detail = a.request("GET", "/cafes/8")
check(detail["cafe"]["rating"] is None and detail["reviews"] == [], "Deleting removes the review and returns the unrated state")
a.request("DELETE", "/favourites/1", {})
check(a.request("GET", "/favourites")["cafes"] == [], "Unsave removes the stored favourite")

# A3: test credential changes against real sessions and persisted account data.
guest.request("PUT", "/account", {"name":"Guest"}, expected=401)
guest.request("PUT", "/account/email", {}, expected=401)
guest.request("PUT", "/account/password", {}, expected=401)
a.request("PUT", "/account/email", {}, expected=403, csrf=False)
a.request("PUT", "/account/password", {}, expected=403, csrf=False)
a.request("PUT", "/account/email", {"email":"invalid", "currentPassword":password}, expected=422)
a.request("PUT", "/account/email", {"email":email_b, "currentPassword":password}, expected=409)
check(a.request("GET", "/auth/me")["user"]["email"] == email_a, "Duplicate email leaves account unchanged")
new_email = f"qa-{suffix}-updated@example.test"
a.request("PUT", "/account/email", {"email":new_email}, expected=422)
a.request("PUT", "/account/email", {"email":new_email,"currentPassword":"wrong-password"}, expected=422)
old_session = Client()
old_session.request("POST", "/auth/login", {"email":email_a,"password":password})
a.request("PUT", "/favourites/1", {})
rid = a.request("POST", "/reviews", review, expected=201)["id"]
old_csrf = a.csrf
result = a.request("PUT", "/account/email", {"email":new_email.upper(),"currentPassword":password})
check(result["user"]["id"] == user_a and result["user"]["email"] == new_email, "Email changes on the same account and is normalized")
check(a.csrf != old_csrf, "Email update rotates the CSRF token")
check(old_session.request("GET", "/auth/me")["user"] is None, "Email update invalidates other sessions")
guest.request("POST", "/auth/login", {"email":email_a,"password":password}, expected=401)
guest.request("POST", "/auth/login", {"email":new_email,"password":password})
check(a.request("GET", "/favourites")["cafes"][0]["id"] == 1, "Email change preserves favourites")
check(a.request("GET", "/reviews/mine")["reviews"][0]["id"] == rid, "Email change preserves reviews")
new_password = "Updated-" + secrets.token_hex(12)
payload = {"currentPassword":password,"newPassword":new_password,"confirmPassword":new_password}
a.request("PUT", "/account/password", {**payload,"currentPassword":"incorrect"}, expected=422)
a.request("PUT", "/account/password", {**payload,"confirmPassword":"does-not-match"}, expected=422)
a.request("PUT", "/account/password", {**payload,"newPassword":"short","confirmPassword":"short"}, expected=422)
a.request("PUT", "/account/password", {**payload,"newPassword":"x"*73,"confirmPassword":"x"*73}, expected=422)
a.request("PUT", "/account/password", {**payload,"newPassword":"☕"*25,"confirmPassword":"☕"*25}, expected=422)
a.request("PUT", "/account/password", {**payload,"newPassword":password,"confirmPassword":password}, expected=422)
old_csrf = a.csrf
result = a.request("PUT", "/account/password", payload)
check(result["user"]["id"] == user_a and a.csrf != old_csrf, "Password update retains account and rotates CSRF token")
check("password" not in json.dumps(result).lower(), "Credential-change response contains no password or hash")
check(guest.request("GET", "/auth/me")["user"] is None, "Password update invalidates other sessions")
guest.request("PUT", "/account", {"name":"Expired session"}, expected=401)
guest.request("POST", "/auth/login", {"email":new_email,"password":password}, expected=401)
guest.request("POST", "/auth/login", {"email":new_email,"password":new_password})
check(guest.request("GET", "/reviews/mine")["reviews"][0]["id"] == rid, "New password logs in to the existing reviews")
check(b.request("GET", "/auth/me")["user"]["email"] == email_b, "Changing credentials does not alter another user's account or session")
a.request("DELETE", f"/reviews/{rid}", {})
a.request("DELETE", "/favourites/1", {})
guest.request("POST", "/auth/logout", {})

for _ in range(10):
    b.request("PUT", "/account/email", {"email":new_email,"currentPassword":"incorrect"}, expected=422)
b.request("PUT", "/account/password", {**payload,"currentPassword":"incorrect"}, expected=429)
check(b.request("GET", "/auth/me")["user"]["email"] == email_b, "Throttled credential attempts leave the account unchanged")
for _ in range(10):
    guest.request("POST", "/auth/login", {"email":"rate-limit-"+suffix+"@example.test","password":"invalid-pass"}, expected=401)
guest.request("POST", "/auth/login", {"email":"rate-limit-"+suffix+"@example.test","password":"invalid-pass"}, expected=429)
print(f"\n{checks} checks passed against PHP and MariaDB.")
