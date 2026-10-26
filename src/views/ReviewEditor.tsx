import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { api, errorMessage } from "../lib/api";
import type { Cafe, Review } from "../lib/api";
import { Loading, Notice } from "../components/Common";
export function ReviewEditor() {
  const { id, reviewId } = useParams(),
    navigate = useNavigate();
  const [cafe, setCafe] = useState<Cafe | null>(null),
    [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [scores, setScores] = useState({ coffee: 0, atmosphere: 0, service: 0 }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    async function load() {
      try {
        const r = await api<{ cafe: Cafe }>("/cafes/" + id);
        if (!live) return;
        setCafe(r.cafe);
        if (reviewId) {
          const own = await api<{ reviews: Review[] }>("/reviews/mine");
          const review = own.reviews.find(
            (r) => r.id === Number(reviewId) && r.cafeId === Number(id),
          );
          if (!review) throw new Error("Review not found in your account.");
          if (!live) return;
          setTitle(review.title);
          setBody(review.body);
          setScores({
            coffee: review.coffee,
            atmosphere: review.atmosphere,
            service: review.service,
          });
        }
        setReady(true);
      } catch (e) {
        if (live) setError(errorMessage(e));
      }
    }
    void load();
    return () => {
      live = false;
    };
  }, [id, reviewId]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (Object.values(scores).some((s) => s === 0)) {
      setError("Please rate coffee, atmosphere and service.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api(
        reviewId ? "/reviews/" + reviewId : "/reviews",
        reviewId ? "PUT" : "POST",
        { cafeId: Number(id), title, body, ...scores },
      );
      navigate("/cafes/" + id, { state: { saved: true } });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-shell review-editor">
      <Link to={"/cafes/" + id} className="back-link">
        ← Back to café
      </Link>
      <p className="eyebrow">Your cup, your opinion</p>
      <h1>{reviewId ? "Edit your review." : "Share your coffee story."}</h1>
      {error && <Notice>{error}</Notice>}
      {!ready ? (
        !error && <Loading />
      ) : (
        <div className="editor-layout">
          <Form className="panel" onSubmit={submit}>
            <h2>How was your visit?</h2>
            <p>Rate each part of your experience from 1 to 5.</p>
            {(["coffee", "atmosphere", "service"] as const).map((key) => (
              <fieldset className="rating-field" key={key}>
                <legend>{key[0].toUpperCase() + key.slice(1)}</legend>
                <div className="rating-options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label
                      className={scores[key] === value ? "selected" : ""}
                      key={value}
                    >
                      <input
                        type="radio"
                        required
                        name={key}
                        value={value}
                        checked={scores[key] === value}
                        onChange={() =>
                          setScores((s) => ({ ...s, [key]: value }))
                        }
                      />
                      <span>{value} ★</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <Form.Group controlId="review-title">
              <Form.Label>Review title</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
                maxLength={80}
                placeholder="Give your visit a headline"
              />
            </Form.Group>
            <Form.Group controlId="review-body">
              <Form.Label>Your review</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                minLength={10}
                maxLength={2000}
                placeholder="Tell us about the coffee, atmosphere and service."
              />
              <Form.Text>{body.length}/2000 characters</Form.Text>
            </Form.Group>
            <div className="actions">
              <Button type="submit" disabled={busy}>
                {busy ? "Saving…" : "Save review"}
              </Button>
              <Link className="btn btn-outline-primary" to={"/cafes/" + id}>
                Cancel
              </Link>
            </div>
          </Form>
          {cafe && (
            <aside className="panel editor-aside">
              <img src={cafe.image} alt={cafe.name + " coffee"} />
              <p className="eyebrow">{cafe.suburb}</p>
              <h2>{cafe.name}</h2>
              <p>{cafe.description}</p>
              <hr />
              <strong>A thoughtful review goes a long way.</strong>
              <p>
                Be specific, respectful and honest. Focus on your coffee
                experience.
              </p>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
