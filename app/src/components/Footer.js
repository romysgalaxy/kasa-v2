import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

/** Pied de page : logo (lien vers l'accueil) et mention de copyright. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Link href="/" aria-label="Kasa, retour à l'accueil">
        <Image
          src="/Logo-mini.png"
          alt="Kasa"
          width={47}
          height={54}
          className={styles.logo}
        />
      </Link>
      <p className={styles.copy}>© 2025 Kasa. All rights reserved</p>
    </footer>
  );
}
