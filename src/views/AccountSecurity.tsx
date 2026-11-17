import { useState } from "react";
import type { FormEvent } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { api, errorMessage } from "../lib/api";
import type { Session, User } from "../lib/api";
import { useAuth } from "../lib/useAuth";

export function AccountSecurity() {
  const auth = useAuth();
  const [email, setEmail] = useState(auth.user?.email ?? "");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState<"email" | "password" | null>(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  async function changeEmail(event: FormEvent) {
    event.preventDefault();
    setBusy("email");
    setEmailError("");
    setEmailSuccess("");
    try {
      const result = await api<Session & { user: User }>("/account/email", "PUT", {
        email, currentPassword: emailPassword,
      });
      auth.updateUser(result.user);
      setEmail(result.user?.email ?? email);
      setEmailPassword("");
      setEmailSuccess("Email updated. Use this address next time you log in. Other sessions have been signed out.");
    } catch (error) {
      setEmailError(errorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (newPassword !== confirmation) {
      setPasswordError("The new passwords do not match.");
      return;
    }
    if (new TextEncoder().encode(newPassword).length > 72) {
      setPasswordError("This password is too long. Please choose a shorter one.");
      return;
    }
    setBusy("password");
    try {
      const result = await api<Session & { user: User }>("/account/password", "PUT", {
        currentPassword, newPassword, confirmPassword: confirmation,
      });
      auth.updateUser(result.user);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
      setPasswordSuccess("Password updated. Other sessions have been signed out.");
    } catch (error) {
      setPasswordError(errorMessage(error));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="account-security">
      <h3>Login &amp; security</h3>
      <details>
        <summary>Change email</summary>
        <p className="form-text">Your email is used to log in. Confirm your current password to change it.</p>
        <Form onSubmit={changeEmail}>
          <fieldset disabled={busy !== null}>
            <Form.Group className="mb-3" controlId="account-new-email">
              <Form.Label>New email address</Form.Label>
              <Form.Control type="email" autoComplete="email" required maxLength={254}
                value={email} onChange={(event) => setEmail(event.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email-current-password">
              <Form.Label>Current password</Form.Label>
              <Form.Control type="password" autoComplete="current-password" required
                value={emailPassword} onChange={(event) => setEmailPassword(event.target.value)} />
            </Form.Group>
            {emailError && <p className="account-form-error" role="alert">{emailError}</p>}
            {emailSuccess && <p className="account-form-success" role="status">{emailSuccess}</p>}
            <Button type="submit">{busy === "email" ? "Updating…" : "Update email"}</Button>
          </fieldset>
        </Form>
      </details>
      <details>
        <summary>Change password</summary>
        <p className="form-text" id="account-password-help">Use at least 8 characters and a password you do not use elsewhere.</p>
        <Form onSubmit={changePassword}>
          <fieldset disabled={busy !== null}>
            <input type="email" name="username" autoComplete="username" value={auth.user?.email ?? ""} readOnly hidden />
            <Form.Group className="mb-3" controlId="account-current-password">
              <Form.Label>Current password</Form.Label>
              <Form.Control type="password" autoComplete="current-password" required
                value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="account-new-password">
              <Form.Label>New password</Form.Label>
              <Form.Control type="password" autoComplete="new-password" required minLength={8} maxLength={72}
                aria-describedby="account-password-help" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="account-confirm-password">
              <Form.Label>Confirm new password</Form.Label>
              <Form.Control type="password" autoComplete="new-password" required minLength={8} maxLength={72}
                value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
            </Form.Group>
            {passwordError && <p className="account-form-error" role="alert">{passwordError}</p>}
            {passwordSuccess && <p className="account-form-success" role="status">{passwordSuccess}</p>}
            <Button type="submit">{busy === "password" ? "Updating…" : "Update password"}</Button>
          </fieldset>
        </Form>
      </details>
    </div>
  );
}
