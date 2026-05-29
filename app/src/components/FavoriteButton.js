"use client";

import { useState } from "react";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({ label }) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      className={styles.button}
      aria-pressed={active}
      aria-label={
        active ? `Retirer ${label} des favoris` : `Ajouter ${label} aux favoris`
      }
      onClick={() => setActive((v) => !v)}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
