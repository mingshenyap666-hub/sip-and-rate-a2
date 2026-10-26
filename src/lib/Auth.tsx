import { useEffect, useState } from "react";
import { AuthContext } from "./useAuth";
import type { ReactNode } from "react";
import { api, errorMessage } from "./api";
import type { User, Session, Cafe } from "./api";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [saved, setSaved] = useState<number[]>([]);
  async function loadSaved(current: User | null) {
    if (!current) {
      setSaved([]);
      return;
    }
    const r = await api<{ cafes: Cafe[] }>("/favourites");
    setSaved(r.cafes.map((c) => c.id));
  }
  async function hydrate() {
    try {
      const r = await api<Session>("/auth/me");
      setError("");
      setUser(r.user);
      await loadSaved(r.user);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }
  async function refresh() {
    setLoading(true);
    await hydrate();
  }
  useEffect(() => {
    api<Session>("/auth/me")
      .then(accept)
      .catch((cause) => setError(errorMessage(cause)))
      .finally(() => setLoading(false));
  }, []);
  async function accept(r: Session) {
    setUser(r.user);
    setError("");
    await loadSaved(r.user);
  }
  async function logout() {
    await api<Session>("/auth/logout", "POST", {});
    setUser(null);
    setSaved([]);
  }
  async function toggleSave(id: number) {
    const removing = saved.includes(id);
    await api("/favourites/" + id, removing ? "DELETE" : "PUT", {});
    setSaved((previous) =>
      removing
        ? previous.filter((x) => x !== id)
        : [...new Set([...previous, id])],
    );
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        saved,
        refresh,
        accept,
        logout,
        toggleSave,
        updateUser: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
