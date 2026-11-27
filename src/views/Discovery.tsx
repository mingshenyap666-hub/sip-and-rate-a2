import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import Button from "react-bootstrap/Button";
import { useApi } from "../lib/useApi";
import type { Cafe } from "../lib/api";
import { money } from "../lib/api";
import { CafeGrid, Empty, Icon, Loading, Notice } from "../components/Common";
const styles = ["All coffee", "Espresso", "Filter", "Cold brew", "Specialty"];
const comparisonRows: { label: string; value: (cafe: Cafe) => string }[] = [
  {
    label: "Coffee price (AUD)",
    value: (cafe) => `${money(cafe.priceFrom)}–${money(cafe.priceTo)}`,
  },
  { label: "Coffee rating", value: (cafe) => formatRating(cafe.rating) },
  { label: "Atmosphere", value: (cafe) => formatRating(cafe.atmosphereRating) },
  { label: "Service", value: (cafe) => formatRating(cafe.serviceRating) },
  { label: "Reviews", value: (cafe) => String(cafe.reviewCount) },
];

function formatRating(rating: number | null) {
  return rating === null ? "No rating yet" : `${rating.toFixed(1)} / 5`;
}

export function Discovery({ home = false }: { home?: boolean }) {
  const [selection, setSelection] = useState<Cafe[]>([]);
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
  const selectedCafes = selection.map(
    (selected) => cafes.find((cafe) => cafe.id === selected.id) ?? selected,
  );

  function toggleComparison(cafe: Cafe) {
    setSelection((current) => {
      if (current.some((item) => item.id === cafe.id)) {
        return current.filter((item) => item.id !== cafe.id);
      }
      return current.length < 2 ? [...current, cafe] : current;
    });
  }

  function renderComparisonButton(cafe: Cafe) {
    const selected = selectedCafes.some((item) => item.id === cafe.id);
    return (
      <Button
        className="mt-3"
        size="sm"
        variant={selected ? "primary" : "outline-primary"}
        aria-label={`Compare ${cafe.name}`}
        aria-pressed={selected}
        disabled={!selected && selectedCafes.length >= 2}
        onClick={() => toggleComparison(cafe)}
      >
        {selected ? "Selected" : "Compare"}
      </Button>
    );
  }
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
        {!home && (
          <section
            className="cafe-comparison"
            aria-labelledby="comparison-heading"
          >
            <div className="between cafe-comparison-heading">
              <h3 id="comparison-heading">Compare cafés</h3>
              {selectedCafes.length > 0 && (
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => setSelection([])}
                >
                  Clear comparison
                </Button>
              )}
            </div>
            <p role="status">
              {selectedCafes.length === 0 && "Choose two cafés to compare."}
              {selectedCafes.length === 1 &&
                `${selectedCafes[0].name} selected. Choose one more café.`}
              {selectedCafes.length === 2 &&
                "Two cafés selected. Remove one to compare another."}
            </p>
            {selectedCafes.length === 2 && (
              <table
                className="cafe-comparison-table"
                aria-labelledby="comparison-heading"
              >
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    {selectedCafes.map((cafe) => (
                      <th scope="col" key={cafe.id}>
                        <Link to={"/cafes/" + cafe.id}>{cafe.name}</Link>
                        <Button
                          className="d-block px-0"
                          size="sm"
                          variant="link"
                          aria-label={`Remove ${cafe.name} from comparison`}
                          onClick={() => toggleComparison(cafe)}
                        >
                          Remove
                        </Button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(({ label, value }) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {selectedCafes.map((cafe) => (
                        <td key={cafe.id}>{value(cafe)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
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
          <CafeGrid
            cafes={cafes}
            renderAction={home ? undefined : renderComparisonButton}
          />
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
