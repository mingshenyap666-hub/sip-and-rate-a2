import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useAuth } from "../lib/useAuth";
import { api, errorMessage } from "../lib/api";
import { useApi } from "../lib/useApi";
import type { Cafe, Review, User } from "../lib/api";
import { CafeGrid, Empty, Loading, Notice } from "../components/Common";
import { ReviewCard } from "./CafeDetail";
export function Favourites() {
  const auth = useAuth();
  const {
    data,
    error,
    loading: busy,
  } = useApi<{ cafes: Cafe[] }>("/favourites", auth.saved.join(","));
  const cafes = data?.cafes ?? [];
  return (
    <div className="page-shell collection-page">
      <p className="eyebrow">Keep the good ones close</p>
      <h1>Your saved cafés.</h1>
      <p>A little collection of places for your next coffee.</p>
      {error ? (
        <Notice>{error}</Notice>
      ) : busy ? (
        <Loading />
      ) : cafes.length ? (
        <CafeGrid cafes={cafes} />
      ) : (
        <Empty title="Your next favourite is out there.">
          <p>Save a café using the bookmark on its card.</p>
          <Link to="/cafes" className="btn btn-primary">
            Discover cafés
          </Link>
        </Empty>
      )}
    </div>
  );
}
export function Account() {
  const auth = useAuth(),
    navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]),
    [name, setName] = useState(auth.user?.name ?? ""),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [deleting, setDeleting] = useState<Review | null>(null);
  useEffect(() => {
    api<{ reviews: Review[] }>("/reviews/mine")
      .then((r) => setReviews(r.reviews))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const r = await api<{ user: User }>("/account", "PUT", { name });
      auth.updateUser(r.user);
      setReviews((items) =>
        items.map((review) => ({ ...review, author: r.user.name })),
      );
      setSuccess("Your display name has been updated.");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setError("");
    try {
      await api("/reviews/" + deleting.id, "DELETE", {});
      setReviews((r) => r.filter((x) => x.id !== deleting.id));
      setDeleting(null);
      setSuccess("Your review has been deleted.");
    } catch (e) {
      setError(errorMessage(e));
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    try {
      await auth.logout();
      navigate("/");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-shell account-page">
      <p className="eyebrow">Your coffee corner</p>
      <h1>Hello, {auth.user?.name}.</h1>
      <p>Manage your profile and the coffee stories you have shared.</p>
      {error && <Notice>{error}</Notice>}
      {success && (
        <div className="success" role="status">
          {success}
        </div>
      )}
      <div className="account-layout">
        <aside className="panel">
          <h2>My account</h2>
          <Form onSubmit={save}>
            <Form.Group controlId="display-name">
              <Form.Label>Display name</Form.Label>
              <Form.Control
                required
                minLength={2}
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <p className="account-email">{auth.user?.email}</p>
            <Button type="submit" disabled={busy}>
              Save changes
            </Button>
          </Form>
          <hr />
          <Link to="/favourites">View saved cafés ({auth.saved.length})</Link>
          <Button
            className="logout-button"
            variant="outline-primary"
            disabled={busy}
            onClick={logout}
          >
            Log out
          </Button>
        </aside>
        <section>
          <div className="section-heading">
            <h2>My reviews</h2>
            <span>{reviews.length} shared</span>
          </div>
          {loading ? (
            <Loading />
          ) : reviews.length ? (
            reviews.map((r) => (
              <div key={r.id}>
                <Link className="review-cafe" to={"/cafes/" + r.cafeId}>
                  {r.cafeName}
                </Link>
                <ReviewCard review={r}>
                  <div className="actions">
                    <Link
                      to={"/cafes/" + r.cafeId + "/review/" + r.id}
                      className="text-button"
                    >
                      Edit review
                    </Link>
                    <button
                      className="text-button danger"
                      onClick={() => setDeleting(r)}
                    >
                      Delete review
                    </button>
                  </div>
                </ReviewCard>
              </div>
            ))
          ) : (
            <Empty title="Your story starts with a cup.">
              <Link to="/cafes" className="btn btn-primary">
                Find a café to review
              </Link>
            </Empty>
          )}
        </section>
      </div>
      <Modal
        show={!!deleting}
        onHide={() => !busy && setDeleting(null)}
        centered
      >
        <Modal.Header closeButton={!busy}>
          <Modal.Title>Delete this review?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This will permanently remove your review of {deleting?.cafeName}. You
          can write a new one later.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            disabled={busy}
            onClick={() => setDeleting(null)}
          >
            Keep review
          </Button>
          <Button variant="danger" disabled={busy} onClick={remove}>
            {busy ? "Deleting…" : "Delete review"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
