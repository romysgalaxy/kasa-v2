import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import styles from "./PropertyCard.module.css";

export default function PropertyCard({ property }) {
  const href = `/logement/${property.id}`;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Link href={href} className={styles.mediaLink} aria-label={property.title}>
          {property.cover && (
            <Image
              src={property.cover}
              alt={property.title}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              className={styles.cover}
            />
          )}
        </Link>
        <FavoriteButton property={property} />
      </div>

      <Link href={href} className={styles.body}>
        <h3 className={styles.title}>{property.title}</h3>
        <p className={styles.location}>{property.location}</p>
        <p className={styles.price}>
          <strong>{property.price_per_night}€</strong> par nuit
        </p>
      </Link>
    </article>
  );
}
