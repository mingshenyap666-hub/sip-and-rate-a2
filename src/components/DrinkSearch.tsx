
import { useState } from "react";
import type { FormEvent } from "react";
import { useApi } from "../lib/useApi";

type Drink = {
  DrinkID: number;
  Name: string;
  Description: string | null;
  Price: string;
  CafeName: string;
};

export function DrinkSearch() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  // Check whether the user has searched for a drink
  const hasSearch = search.trim().length > 0;

  // Get drinks from our PHP API
  const { data, loading, error } = useApi<{
    drinks: Drink[];
  }>("/drinks?search=" + encodeURIComponent(search));

  // Run when the user clicks Search Drinks
  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearch(input.trim());
  }

  return (
    <section className="drink-search">
      <h2>Find your favourite drink</h2>

      <form onSubmit={handleSearch} className="search-box">
        <label htmlFor="drink-name" className="visually-hidden">
          Search drinks
        </label>

        <input
          id="drink-name"
          type="search"
          placeholder="Latte, Mocha, Espresso..."
          value={input}
          maxLength={100}
          onChange={(e) => setInput(e.target.value)}
        />

        <button type="submit">
          Search Drinks
        </button>
      </form>

      {/* Before searching */}
      {!hasSearch && (
        <p>Search for a drink to see results.</p>
      )}

      {/* Loading */}
      {hasSearch && loading && (
        <p>Searching for drinks...</p>
      )}

      {/* Error */}
      {hasSearch && error && (
        <p role="alert">{error}</p>
      )}

      {/* No matching drinks */}
      {hasSearch &&
        !loading &&
        !error &&
        data?.drinks.length === 0 && (
          <p>No drinks found. Try another name.</p>
        )}

      {/* Display matching drinks */}
      {hasSearch && !loading && !error && (
        <div className="drink-results">
          {data?.drinks.map((drink) => (
            <article key={drink.DrinkID}>
              <h3>{drink.Name}</h3>

              <p>{drink.CafeName}</p>

              <p>{drink.Description}</p>

              <strong>
                ${Number(drink.Price).toFixed(2)}
              </strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
