import Image from "next/image";
import { getProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import styles from "./page.module.css";

const steps = [
  {
    title: "Recherchez",
    text: "Entrez votre destination, vos dates et laissez Kasa faire le reste.",
  },
  {
    title: "Réservez",
    text: "Profitez d'une plateforme sécurisée et de profils d'hôtes vérifiés.",
  },
  {
    title: "Vivez l'expérience",
    text: "Installez-vous, profitez de votre séjour, et sentez-vous chez vous, partout.",
  },
];

/**
 * Page d'accueil (Server Component) : bannière héro, grille des logements
 * récupérés depuis l'API côté serveur, et section "Comment ça marche ?".
 */
export default async function Home() {
  const properties = await getProperties();

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Chez vous, partout et ailleurs</h1>
        <p className={styles.heroText}>
          Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux,
          sélectionnés avec soin par nos hôtes.
        </p>
        <div className={styles.banner}>
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 1240px) 100vw, 1240px"
            className={styles.bannerImg}
          />
        </div>
      </section>

      <section className={styles.listings}>
        <h2 className={styles.srOnly}>Nos logements</h2>
        <ul className={styles.grid}>
          {properties.map((property) => (
            <li key={property.id}>
              <PropertyCard property={property} />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.steps}>
        <h2 className={styles.stepsTitle}>Comment ça marche ?</h2>
        <p className={styles.stepsText}>
          Que vous partiez pour un week-end improvisé, des vacances en famille ou
          un voyage professionnel, Kasa vous aide à trouver un lieu qui vous
          ressemble.
        </p>
        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <article key={step.title} className={styles.stepCard}>
              <h3 className={styles.stepCardTitle}>{step.title}</h3>
              <p className={styles.stepCardText}>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
