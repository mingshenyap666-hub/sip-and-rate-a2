import { createContext, useContext } from "react";
import type { User, Session } from "./api";

export interface Auth {
  user: User | null;
  loading: boolean;
  error: string;
  saved: number[];
  refresh: () => Promise<void>;
  accept: (session: Session) => Promise<void>;
  logout: () => Promise<void>;
  toggleSave: (id: number) => Promise<void>;
  updateUser: (user: User) => void;
}
export const AuthContext = createContext<Auth | null>(null);
export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("Missing AuthProvider");
  return auth;
}
