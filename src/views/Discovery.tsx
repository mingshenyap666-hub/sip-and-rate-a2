import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import Button from "react-bootstrap/Button";
import { useApi } from "../lib/useApi";
import type { Cafe } from "../lib/api";
import { CafeGrid, Empty, Icon, Loading, Notice } from "../components/Common";
const styles = ["All coffee", "Espresso", "Filter", "Cold brew", "Specialty"];
export function Discovery({ home = false }: { home?: boolean }) {
  const [params] = useSearchParams(),
    navigate = useNavigate();
  const q = params.get("q") ?? "",
    style = params.get("style") ?? "";
  const query = new URLSearchParams(home ? { random: "1" } : { q, style });
  const {
    data,
    loading: busy,
    error,
    retry,
  } = useApi<{ cafes: Cafe[] }>("/cafes?" + query);
  const cafes = data?.cafes ?? [];
  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = String(new FormData(e.currentTarget).get("q") ?? "");
    navigate("/cafes?" + new URLSearchParams({ q: input, style }));
  }
  const searchForm = (
    <form className="search-box" onSubmit={search} role="search">
      <Icon name="search" />
      <label htmlFor="coffee-search" className="visually-hidden">
        Search cafés
      </label>
      <input
        id="coffee-search"
        name="q"
        key={q}
        defaultValue={q}
        placeholder="Café name, suburb or bean origin"
        maxLength={100}
      />
      <Button type="submit">Find coffee</Button>
    </form>
  );
  return (
    <div className="page-shell discovery">
      {home ? (
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Melbourne, one cup at a time</p>
            <h1>
              Find your next
              <br />
              great coffee.
            </h1>
            <p className="hero-intro">
              Discover cafés that match your taste.
              <br />
              Honest reviews, thoughtful details, better coffee.
            </p>
            {searchForm}
            <small className="search-hint">
              Try “Fitzroy”, “Colombia” or your favourite café
            </small>
          </div>
          <div className="hero-visual">
            <img
              src="/images/coffee.jpg"
              alt="A freshly poured latte on a sunlit wooden table"
            />
            <div className="hero-note">
              <Icon name="star" />
              <div>
                <strong>A good cup is worth sharing.</strong>
                <small>Find it. Sip it. Rate it.</small>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="search-intro">
          <p className="eyebrow">Find your next ritual</p>
          <h1>Discover your kind of coffee.</h1>
          <p>Explore our Melbourne café collection.</p>
          {searchForm}
        </section>
      )}
      <section className="discovery-filters" aria-label="Coffee style">
        <p className="eyebrow muted">Your coffee, your way</p>
        <div className="filter-list">
          {styles.map((s) => (
            <Link
              className={
                "filter-chip" +
                ((s === "All coffee" && !style) || s === style ? " active" : "")
              }
              key={s}
              to={
                "/cafes?" +
                new URLSearchParams({
                  q: home ? "" : q,
                  style: s === "All coffee" ? "" : s,
                })
              }
            >
              {s}
            </Link>
          ))}
        </div>
      </section>
      <section>
        <div className="section-heading">
          <div>
            <h2>
              {home
                ? "A few places to start."
                : q
                  ? "Results for “" + q + "”"
                  : "The café collection."}
            </h2>
            <p>
              {home
                ? "A fresh selection from our café collection."
                : `${cafes.length} café${cafes.length === 1 ? "" : "s"} to discover`}
            </p>
          </div>
          <div className="actions">
            {home ? (
              <Link className="btn btn-outline-primary" to="/cafes">
                Explore all cafés
              </Link>
            ) : (
              <Link className="btn btn-outline-primary" to="/cafes">
                Clear filters
              </Link>
            )}
            <Button variant="link" disabled={busy} onClick={retry}>
              {home ? "Shuffle selection" : "Refresh"}
            </Button>
          </div>
        </div>
        {busy ? (
          <Loading />
        ) : error ? (
          <Notice>
            {error}{" "}
            <button className="text-button" onClick={retry}>
              Try again
            </button>
          </Notice>
        ) : cafes.length ? (
          <CafeGrid cafes={cafes} />
        ) : (
          <Empty title="No cafés found.">
            <p>Try a different suburb, origin or coffee style.</p>
            <Link to="/cafes">Browse all cafés</Link>
          </Empty>
        )}
      </section>
    </div>
  );
}
