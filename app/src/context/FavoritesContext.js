"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "kasa:favorites";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  // Tant que le localStorage n'est pas lu, on évite d'afficher un état "vide"
  // trompeur et on garde le rendu serveur/client identique (pas de mismatch).
  const [hydrated, setHydrated] = useState(false);

  // Lecture initiale depuis localStorage (uniquement côté navigateur). Le
  // setState dans l'effet est volontaire : la donnée n'existe pas côté serveur,
  // on la synchronise donc après le montage pour ne pas casser l'hydratation.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // localStorage indisponible ou JSON corrompu : on repart d'une liste vide.
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persistance à chaque changement (après l'hydratation).
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  // useCallback : la fonction garde la même référence entre les rendus.
  // (setState fonctionnel => aucune dépendance nécessaire)
  const toggleFavorite = useCallback((property) => {
    setFavorites((list) =>
      list.some((p) => p.id === property.id)
        ? list.filter((p) => p.id !== property.id)
        : [...list, property]
    );
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((p) => p.id === id),
    [favorites]
  );

  // useMemo : on ne recrée l'objet de contexte que si une valeur change
  // réellement. Sinon React verrait un "nouvel" objet à chaque rendu et
  // notifierait inutilement tous les consommateurs.
  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite, hydrated }),
    [favorites, toggleFavorite, isFavorite, hydrated]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites doit être utilisé dans un <FavoritesProvider>");
  }
  return ctx;
}
