"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "kasa:auth";

export function AuthProvider({ children }) {
  // { token, user } ou null si déconnecté.
  const [auth, setAuth] = useState(null);
  // Même garde d'hydratation que FavoritesContext : on ne lit le localStorage
  // qu'après le montage pour garder le rendu serveur/client identique.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAuth(JSON.parse(raw));
    } catch {
      // localStorage indisponible ou JSON corrompu : on reste déconnecté.
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persistance à chaque changement (après l'hydratation).
  useEffect(() => {
    if (!hydrated) return;
    if (auth) localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    else localStorage.removeItem(STORAGE_KEY);
  }, [auth, hydrated]);

  // Appelle POST /auth/login (proxifié vers l'API Express par les rewrites de
  // next.config.mjs — on reste donc en same-origin, pas de CORS). Jette une
  // Error avec `.status` en cas d'échec, comme les services de l'API.
  const login = useCallback(async (email, password) => {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || "invalid credentials");
      err.status = res.status;
      throw err;
    }
    setAuth({ token: data.token, user: data.user });
    return data.user;
  }, []);

  const logout = useCallback(() => setAuth(null), []);

  // useMemo : on ne recrée l'objet de contexte que si une valeur change.
  const value = useMemo(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      login,
      logout,
      hydrated,
    }),
    [auth, login, logout, hydrated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  }
  return ctx;
}
