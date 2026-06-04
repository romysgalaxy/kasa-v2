import styles from "./Loader.module.css";

/**
 * Indicateur de chargement (spinner) utilisé par les fichiers loading.js.
 * Le libellé est masqué visuellement mais annoncé aux lecteurs d'écran.
 * @param {Object} props
 * @param {string} [props.label="Chargement…"] - Texte annoncé aux lecteurs d'écran.
 */
export default function Loader({ label = "Chargement…" }) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
}
