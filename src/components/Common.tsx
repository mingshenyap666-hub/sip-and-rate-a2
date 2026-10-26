import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import { useAuth } from "../lib/useAuth";
import type { Cafe } from "../lib/api";
import { errorMessage, money } from "../lib/api";
export function Icon({ name }: { name: string }) {
  return (
    <img
      className="icon"
      src={"/icons/" + name + ".svg"}
      alt=""
      aria-hidden="true"
    />
  );
}
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="notice" role="alert">
      {children}
    </div>
  );
}
export function Loading() {
  return (
    <div className="empty" role="status">
      Brewing something good…
    </div>
  );
}
export function SaveButton({
  id,
  compact = false,
}: {
  id: number;
  compact?: boolean;
}) {
  const auth = useAuth(),
    navigate = useNavigate(),
    location = useLocation();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const saved = auth.saved.includes(id);
  async function save() {
    if (!auth.user) {
      navigate(
        "/login?next=" +
          encodeURIComponent(location.pathname + location.search),
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      await auth.toggleSave(id);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        variant="outline-primary"
        className={compact ? "bookmark-button" + (saved ? " saved" : "") : ""}
        disabled={busy || auth.loading}
        onClick={save}
        aria-label={saved ? "Unsave café" : "Save café"}
        aria-pressed={saved}
      >
        {compact ? (
          <Icon name="bookmark" />
        ) : saved ? (
          "Saved café"
        ) : (
          "Save café"
        )}
      </Button>
      {error && <Notice>{error}</Notice>}
    </>
  );
}
export function CafeCard({ cafe }: { cafe: Cafe }) {
  return (
    <article className="cafe-card">
      <Link
        to={"/cafes/" + cafe.id}
        className="card-photo-link"
        aria-label={"View " + cafe.name}
      >
        <img
          className="card-photo"
          src={cafe.image}
          alt={cafe.name + " coffee"}
        />
      </Link>
      <SaveButton id={cafe.id} compact />
      <div className="card-copy">
        <p className="eyebrow muted">{cafe.suburb} · Melbourne</p>
        <h3>
          <Link to={"/cafes/" + cafe.id}>{cafe.name}</Link>
        </h3>
        <div className="between">
          <span className="rating">
            <Icon name="starSmall" />
            {cafe.rating?.toFixed(1) ?? "New"}
            {cafe.rating !== null ? " coffee" : ""}
          </span>
          <small>From {money(cafe.priceFrom)} AUD</small>
        </div>
        <div className="between tags-row">
          <span className="tag">{cafe.style}</span>
          <small>{cafe.origin} beans</small>
        </div>
      </div>
    </article>
  );
}
export function CafeGrid({ cafes }: { cafes: Cafe[] }) {
  return (
    <div className="cafe-grid">
      {cafes.map((c) => (
        <CafeCard key={c.id} cafe={c} />
      ))}
    </div>
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
