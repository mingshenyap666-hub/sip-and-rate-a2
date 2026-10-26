import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAuth } from "../lib/useAuth";
import { api, errorMessage } from "../lib/api";
import type { Session } from "../lib/api";
import { Notice } from "../components/Common";
export function Authentication({ register = false }: { register?: boolean }) {
  const auth = useAuth(),
    navigate = useNavigate(),
    [params] = useSearchParams();
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [remember, setRemember] = useState(false),
    [visible, setVisible] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const target = params.get("next") ?? "/account";
  const next =
    target.startsWith("/") &&
    !target.startsWith("//") &&
    !target.includes("\\") &&
    !/^\/(login|register)/.test(target)
      ? target
      : "/account";
  if (auth.user) return <Navigate to={next} replace />;
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await api<Session>(
        "/auth/" + (register ? "register" : "login"),
        "POST",
        { name, email, password, remember },
      );
      await auth.accept(r);
      navigate(next, { replace: true });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-shell auth-layout">
      <aside className="auth-story">
        <p className="eyebrow">Your next coffee story</p>
        <h1>
          Good coffee.
          <br />
          Better together.
        </h1>
        <p>
          Save your discoveries and share the cups
          <br className="desktop-break" /> that made your day.
        </p>
        <img
          src="/images/coffee.jpg"
          alt="A cup of latte with leaf-shaped latte art"
        />
      </aside>
      <section className="auth-form">
        <p className="eyebrow">
          {register ? "Join the community" : "Welcome back"}
        </p>
        <h2>
          {register ? "Make it your daily ritual." : "Your next cup awaits."}
        </h2>
        <p>
          {register
            ? "Create an account to save cafés and share your reviews."
            : "Log in to save cafés and share your reviews."}
        </p>
        <Form onSubmit={submit}>
          {error && <Notice>{error}</Notice>}
          {register && (
            <Form.Group controlId="name">
              <Form.Label>Display name</Form.Label>
              <Form.Control
                required
                minLength={2}
                maxLength={80}
                autoComplete="nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </Form.Group>
          )}
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <div className="password-field">
              <Form.Control
                type={visible ? "text" : "password"}
                required
                minLength={register ? 8 : 1}
                maxLength={72}
                autoComplete={register ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  register ? "At least 8 characters" : "Your password"
                }
                aria-describedby={register ? "password-help" : undefined}
              />
              <button
                type="button"
                className="show-password"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? "Hide" : "Show"}
              </button>
            </div>
            {register && (
              <Form.Text id="password-help">
                Use 8 or more characters, up to 72 bytes.
              </Form.Text>
            )}
          </Form.Group>
          {!register && (
            <Form.Check
              id="remember"
              type="checkbox"
              label="Remember me for 7 days"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
          )}
          <Button
            className="submit-button"
            type="submit"
            disabled={busy || auth.loading}
          >
            {busy ? "Please wait…" : register ? "Create account" : "Log in"}
          </Button>
        </Form>
        <p className="auth-switch">
          {register ? "Already have an account?" : "New to Sip & Rate?"}{" "}
          <Link
            to={
              (register ? "/login" : "/register") +
              "?next=" +
              encodeURIComponent(next)
            }
          >
            {register ? "Log in" : "Create an account"}
          </Link>
        </p>
        <p className="fine-print">
          Student project · Use a test email and a unique password for this
          demo.
        </p>
      </section>
    </div>
  );
}
