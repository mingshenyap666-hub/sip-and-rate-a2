import { Link, NavLink } from "react-router";
import { useAuth } from "../lib/useAuth";
import { Icon, Notice } from "./Common";
export function Header() {
  const auth = useAuth();
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
            <NavLink to="/cafes">
              Discover <Icon name="down" />
            </NavLink>
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
