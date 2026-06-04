"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";

export default function ConnexionPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      // 401 = identifiants invalides (cf. authService côté API) ; tout autre
      // statut (API down, 503 dbReady…) reçoit un message générique.
      setError(
        err.status === 401
          ? "Identifiants invalides. Vérifiez votre adresse email et votre mot de passe."
          : "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <h1 className={styles.title}>Heureux de vous revoir</h1>
        <p className={styles.subtitle}>
          Connectez-vous pour retrouver vos réservations, vos annonces et tout
          ce qui rend vos séjours uniques.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Adresse email
            </label>
            <input
              className={styles.input}
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Mot de passe
            </label>
            {/* type="password" : la saisie est masquée ; le hachage (scrypt)
                est fait côté API, le mot de passe ne transite qu'en POST. */}
            <input
              className={styles.input}
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* role="alert" : annoncé par les lecteurs d'écran dès l'apparition. */}
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button className={styles.submit} type="submit" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        {/* Liens présents sur la maquette mais hors périmètre (seule la
            connexion est demandée) : ancres-placeholders sans cible. */}
        <div className={styles.links}>
          <a className={styles.link}>Mot de passe oublié</a>
          <p className={styles.signup}>
            Pas encore de compte ? <a className={styles.link}>Inscrivez-vous</a>
          </p>
        </div>
      </section>
    </main>
  );
}
