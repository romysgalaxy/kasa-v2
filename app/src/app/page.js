import Image from "next/image";
import { getProperties } from "@/lib/api";
import styles from "./page.module.css";

export default async function Home() {
  const properties = await getProperties();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Nos locations Kasa</h1>
      <ul className={styles.grid}>
        {properties.map((property) => (
          <li key={property.id} className={styles.card}>
            {property.cover && (
              <Image
                className={styles.cover}
                src={property.cover}
                alt={property.title}
                width={400}
                height={260}
              />
            )}
            <h2 className={styles.cardTitle}>{property.title}</h2>
            <p className={styles.location}>{property.location}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
