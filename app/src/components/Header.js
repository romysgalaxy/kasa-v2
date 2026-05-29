"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/ajouter-un-logement", label: "Ajouter un logement" },
  { href: "/favoris", label: "Favoris" },
  { href: "/messagerie", label: "Messagerie" },
];

function HeartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <nav className={styles.left}>
          <Link href="/" className={styles.link}>
            Accueil
          </Link>
          <Link href="/a-propos" className={styles.link}>
            À propos
          </Link>
        </nav>

        <Link
          href="/"
          className={styles.logo}
          aria-label="Kasa, retour à l'accueil"
        >
          <Image
            src="/Logo-full.png"
            alt="Kasa"
            width={114}
            height={41}
            className={styles.logoFull}
            priority
          />
          <Image
            src="/Logo-mini.png"
            alt="Kasa"
            width={47}
            height={54}
            className={styles.logoMini}
            priority
          />
        </Link>

        <div className={styles.right}>
          <Link href="/ajouter-un-logement" className={styles.add}>
            + Ajouter un logement
          </Link>
          <Link href="/favoris" className={styles.icon} aria-label="Mes favoris">
            <HeartIcon />
          </Link>
          <Link
            href="/messagerie"
            className={styles.icon}
            aria-label="Ma messagerie"
          >
            <MessageIcon />
          </Link>
        </div>

        <button
          type="button"
          className={styles.burger}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="menu-mobile" className={styles.mobileMenu}>
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileLink}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
