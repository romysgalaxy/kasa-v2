import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Page introuvable — Kasa",
};

export default function NotFound() {
  return (
    <main className={styles.main}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>
        Il semble que la page que vous cherchez ait pris des vacances… ou
        n&apos;ait jamais existé.
      </p>
      <div className={styles.actions}>
        <Link href="/" className={styles.button}>
          Accueil
        </Link>
        <Link href="/" className={styles.button}>
          Logements
        </Link>
      </div>
    </main>
  );
}
