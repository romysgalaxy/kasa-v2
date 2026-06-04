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

/**
 * Fournit l'état global des favoris à toute l'application (montée dans
 * layout.js). Les favoris sont 100% côté client, persistés dans le
 * localStorage (clé "kasa:favorites") : aucun compte n'est nécessaire.
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 */
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

  /**
   * Ajoute le logement aux favoris s'il n'y est pas, le retire sinon.
   * useCallback : la fonction garde la même référence entre les rendus.
   * (setState fonctionnel => aucune dépendance nécessaire)
   * @param {Object} property - Logement complet (objet stocké tel quel).
   */
  const toggleFavorite = useCallback((property) => {
    setFavorites((list) =>
      list.some((p) => p.id === property.id)
        ? list.filter((p) => p.id !== property.id)
        : [...list, property]
    );
  }, []);

  /**
   * Indique si un logement est dans les favoris.
   * @param {string} id - Identifiant du logement.
   * @returns {boolean}
   */
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

/**
 * Hook d'accès aux favoris : { favorites, toggleFavorite, isFavorite, hydrated }.
 * @returns {{favorites: Object[], toggleFavorite: (property: Object) => void, isFavorite: (id: string) => boolean, hydrated: boolean}}
 * @throws {Error} Si appelé hors d'un <FavoritesProvider>.
 */
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites doit être utilisé dans un <FavoritesProvider>");
  }
  return ctx;
}
