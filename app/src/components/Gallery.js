"use client";

import { useState } from "react";
import Image from "next/image";
import Carousel from "./Carousel";
import styles from "./Gallery.module.css";

/**
 * Galerie de la page logement : une grande photo + jusqu'à 4 vignettes
 * (avec badge "+N" s'il y a plus de 5 photos). Chaque photo ouvre la
 * lightbox (Carousel) à l'index cliqué.
 * @param {Object} props
 * @param {string[]} props.images - URLs des photos du logement.
 * @param {string} props.title - Titre du logement (libellés accessibles + alt).
 */
export default function Gallery({ images, title }) {
  const [lightbox, setLightbox] = useState(null); // index ouvert, ou null

  const big = images[0];
  const thumbs = images.slice(1, 5);
  const extra = images.length - 5; // photos au-delà des 5 affichées

  return (
    <>
      <section className={styles.grid} aria-label={`Photos du logement ${title}`}>
        <button
          type="button"
          className={styles.big}
          onClick={() => setLightbox(0)}
          aria-label={`Ouvrir la galerie — ${title}, photo 1 sur ${images.length}`}
        >
          <Image
            src={big}
            alt={`${title} — photo 1`}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.img}
            priority
          />
        </button>

        {thumbs.map((src, i) => {
          const index = i + 1;
          const isLast = i === thumbs.length - 1;
          return (
            <button
              key={index}
              type="button"
              className={styles.thumb}
              onClick={() => setLightbox(index)}
              aria-label={`Ouvrir la galerie — photo ${index + 1} sur ${images.length}`}
            >
              <Image
                src={src}
                alt={`${title} — photo ${index + 1}`}
                fill
                sizes="(max-width: 900px) 25vw, 25vw"
                className={styles.img}
              />
              {isLast && extra > 0 && (
                <span className={styles.more} aria-hidden="true">
                  +{extra}
                </span>
              )}
            </button>
          );
        })}
      </section>

      {lightbox !== null && (
        <Carousel
          images={images}
          title={title}
          initialIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
