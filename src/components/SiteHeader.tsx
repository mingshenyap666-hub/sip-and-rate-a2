import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import Dropdown from "react-bootstrap/Dropdown";
import { useAuth } from "../lib/useAuth";
import { useApi } from "../lib/useApi";
import type { Cafe } from "../lib/api";
import { Icon, Notice } from "./Common";
export function Header() {
  const auth = useAuth();
  const location = useLocation();
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const { data, loading, error, retry } = useApi<{ cafes: Cafe[] }>("/cafes");
  const suburbs = [...new Set((data?.cafes ?? []).map((cafe) => cafe.suburb))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  const selectedSuburb = new URLSearchParams(location.search).get("suburb");
  const discovering = location.pathname === "/cafes";
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <Icon name="cup" />
            <span>sip &amp; rate</span>
          </Link>
          <nav aria-label="Main navigation">
            <Dropdown
              className="discover-dropdown"
              show={discoverOpen}
              onToggle={setDiscoverOpen}
              onSelect={() => setDiscoverOpen(false)}
            >
              <Dropdown.Toggle
                id="discover-menu"
                variant="link"
                className={"discover-toggle" + (discovering ? " active" : "")}
              >
                Discover <Icon name="down" />
              </Dropdown.Toggle>
              <Dropdown.Menu aria-labelledby="discover-menu">
                <Dropdown.Item as={Link} to="/cafes" active={discovering && !selectedSuburb}>
                  All cafés
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Browse by suburb</Dropdown.Header>
                {loading ? (
                  <Dropdown.ItemText>Loading suburbs…</Dropdown.ItemText>
                ) : error ? (
                  <Dropdown.Item as="button" onClick={retry}>
                    Retry loading suburbs
                  </Dropdown.Item>
                ) : suburbs.length ? (
                  suburbs.map((suburb) => (
                    <Dropdown.Item
                      as={Link}
                      key={suburb}
                      to={"/cafes?" + new URLSearchParams({ suburb })}
                      active={discovering && selectedSuburb === suburb}
                    >
                      {suburb}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.ItemText>No suburbs available yet.</Dropdown.ItemText>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <NavLink to="/favourites">Favourites</NavLink>
          </nav>
          <span className="location">
            <Icon name="pin" />
            Melbourne
          </span>
          <div className="header-actions">
            {auth.user ? (
              <Link to="/account" className="account-link">
                <span className="avatar">
                  {auth.user.name[0].toUpperCase()}
                </span>
                <span className="user-name">{auth.user.name}</span>
              </Link>
            ) : (
              <>
                <Link className="btn btn-outline-primary" to="/login">
                  Log in
                </Link>
                <Link className="btn btn-primary" to="/register">
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      {auth.error && (
        <div className="page-shell">
          <Notice>
            {auth.error}{" "}
            <button className="text-button" onClick={() => void auth.refresh()}>
              Retry connection
            </button>
          </Notice>
        </div>
      )}
    </>
  );
}
