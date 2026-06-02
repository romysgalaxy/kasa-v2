import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProperty } from "@/lib/api";
import Gallery from "@/components/Gallery";
import styles from "./page.module.css";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) return { title: "Logement introuvable — Kasa" };
  return {
    title: `${property.title} — Kasa`,
    description: property.description?.slice(0, 160),
  };
}

export default async function LogementPage({ params }) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  const pictures = (
    property.pictures?.length ? property.pictures : [property.cover]
  ).filter(Boolean);

  return (
    <main className={styles.main}>
      <Link href="/" className={styles.back}>
        ← Retour aux annonces
      </Link>

      <div className={styles.layout}>
        <div className={styles.content}>
          <Gallery images={pictures} title={property.title} />

          <section className={styles.infos}>
            <h1 className={styles.title}>{property.title}</h1>
            <p className={styles.location}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
              </svg>
              {property.location}
            </p>

            {property.description && (
              <p className={styles.description}>{property.description}</p>
            )}

            {property.equipments?.length > 0 && (
              <div className={styles.block}>
                <h2 className={styles.blockTitle}>Équipements</h2>
                <ul className={styles.tags}>
                  {property.equipments.map((item) => (
                    <li key={item} className={styles.tag}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {property.tags?.length > 0 && (
              <div className={styles.block}>
                <h2 className={styles.blockTitle}>Catégorie</h2>
                <ul className={styles.tags}>
                  {property.tags.map((item) => (
                    <li key={item} className={styles.tag}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <aside className={styles.hostCard}>
          <h2 className={styles.hostHeading}>Votre hôte</h2>
          <div className={styles.hostInfo}>
            {property.host?.picture && (
              <Image
                src={property.host.picture}
                alt={property.host.name}
                width={64}
                height={64}
                className={styles.hostPicture}
              />
            )}
            <span className={styles.hostName}>{property.host?.name}</span>
            <span className={styles.rating}>
              <svg
                className={styles.star}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" />
              </svg>
              {property.rating_avg ?? 0}
            </span>
          </div>
          <Link href="/messagerie" className={styles.hostBtn}>
            Contacter l&apos;hôte
          </Link>
          <Link href="/messagerie" className={styles.hostBtn}>
            Envoyer un message
          </Link>
        </aside>
      </div>
    </main>
  );
}
