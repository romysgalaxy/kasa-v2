"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Carousel.module.css";

export default function Carousel({ images, title, initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const count = images.length;
  const closeRef = useRef(null);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + count) % count),
    [count]
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  // Navigation clavier : flèches pour défiler, Échap pour fermer.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "Escape") {
        onClose?.();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prev, next, onClose]);

  // Bloque le scroll de la page tant que la lightbox est ouverte.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const single = count <= 1;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Galerie photos — ${title}`}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Fermer la galerie"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* stopPropagation : un clic sur le visuel ne ferme pas la lightbox */}
      <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
        <div className={styles.slide}>
          <Image
            src={images[index]}
            alt={`${title} — photo ${index + 1} sur ${count}`}
            fill
            sizes="100vw"
            className={styles.image}
            priority
          />
        </div>

        {!single && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.prev}`}
              onClick={prev}
              aria-label="Photo précédente"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              className={`${styles.arrow} ${styles.next}`}
              onClick={next}
              aria-label="Photo suivante"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <p className={styles.counter} aria-live="polite">
              {index + 1}/{count}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
