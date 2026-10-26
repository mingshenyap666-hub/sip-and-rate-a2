import { useEffect } from "react";
import type { ReactNode } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router";
import { AuthProvider } from "./lib/Auth";
import { useAuth } from "./lib/useAuth";
import { Header } from "./components/SiteHeader";
import { Footer } from "./components/SiteFooter";
import { Empty, Loading } from "./components/Common";
import { Discovery } from "./views/Discovery";
import { CafeDetail } from "./views/CafeDetail";
import { Authentication } from "./views/Authentication";
import { Account, Favourites } from "./views/Account";
import { ReviewEditor } from "./views/ReviewEditor";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/lora/latin-400.css";
import "@fontsource/arimo/latin-400.css";
import "@fontsource/arimo/latin-700.css";
import "./styles.css";
function Protected({ children }: { children: ReactNode }) {
  const { user, loading, error } = useAuth(),
    location = useLocation();
  if (loading) return <Loading />;
  if (error)
    return (
      <Empty title="We couldn't connect to your account.">
        <p>Please retry using the message above.</p>
      </Empty>
    );
  return user ? (
    children
  ) : (
    <Navigate
      to={"/login?next=" + encodeURIComponent(location.pathname)}
      replace
    />
  );
}
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sip & Rate — Melbourne coffee discoveries";
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <AuthProvider>
      <ScrollReset />
      <Header />
      <main id="main">
        <Routes>
          <Route index element={<Discovery home />} />
          <Route path="cafes" element={<Discovery />} />
          <Route path="cafes/:id" element={<CafeDetail />} />
          <Route path="login" element={<Authentication key="login" />} />
          <Route
            path="register"
            element={<Authentication key="register" register />}
          />
          <Route
            path="account"
            element={
              <Protected>
                <Account />
              </Protected>
            }
          />
          <Route
            path="favourites"
            element={
              <Protected>
                <Favourites />
              </Protected>
            }
          />
          <Route
            path="cafes/:id/review"
            element={
              <Protected>
                <ReviewEditor />
              </Protected>
            }
          />
          <Route
            path="cafes/:id/review/:reviewId"
            element={
              <Protected>
                <ReviewEditor />
              </Protected>
            }
          />
          <Route
            path="*"
            element={
              <Empty title="This page took a coffee break.">
                <Link to="/" className="btn btn-primary">
                  Back to discovery
                </Link>
              </Empty>
            }
          />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}
