import { Link } from "react-router";
export function Footer() {
  return (
    <footer className="site-footer page-shell">
      <div className="footer-columns">
        <div>
          <Link to="/" className="brand">
            sip &amp; rate
          </Link>
          <p>Find your taste. Share your ritual.</p>
        </div>
        <div>
          <p>A student concept for Melbourne coffee lovers.</p>
          <small>
            Fictional cafés, sample prices and reviews · Illustrative
            photography
          </small>
        </div>
      </div>
      <small>INT1059 · Advanced Web · A3</small>
    </footer>
  );
}
