import Image from "next/image";
import styles from "./page.module.css";

export const metadata = {
  title: "À propos — Kasa",
  description:
    "Kasa met en relation des voyageurs en quête d'authenticité avec des hôtes passionnés. Découvrez notre mission.",
};

const mission = [
  "Offrir une plateforme fiable et simple d'utilisation",
  "Proposer des hébergements variés et de qualité",
  "Favoriser des échanges humains et chaleureux entre hôtes et voyageurs",
];

/** Page "À propos" : présentation de Kasa et de sa mission (contenu statique). */
export default function AProposPage() {
  return (
    <main className={styles.main}>
      <header className={styles.intro}>
        <h1 className={styles.title}>À propos</h1>
        <p className={styles.lead}>
          Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se
          sentir bien.
        </p>
        <p className={styles.lead}>
          Depuis notre création, nous mettons en relation des voyageurs en quête
          d&apos;authenticité avec des hôtes passionnés qui aiment partager leur
          région et leurs bonnes adresses.
        </p>
      </header>

      <div className={styles.banner}>
        <Image
          src="/hero-a-propos.jpg"
          alt="Une maison en bois nichée dans la nature au coucher du soleil"
          fill
          priority
          sizes="(max-width: 1240px) 100vw, 1240px"
          className={styles.bannerImg}
        />
      </div>

      <section className={styles.mission}>
        <div className={styles.missionText}>
          <h2 className={styles.missionTitle}>Notre mission est simple :</h2>
          <ol className={styles.missionList}>
            {mission.map((item) => (
              <li key={item} className={styles.missionItem}>
                {item}
              </li>
            ))}
          </ol>
          <p className={styles.highlight}>
            Que vous cherchiez un appartement cosy en centre-ville, une maison en
            bord de mer ou un chalet à la montagne, Kasa vous accompagne pour que
            chaque séjour devienne un souvenir inoubliable.
          </p>
        </div>

        <div className={styles.missionImage}>
          <Image
            src="/img-a-propos.jpg"
            alt="Un chalet chaleureux illuminé au crépuscule"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className={styles.bannerImg}
          />
        </div>
      </section>
    </main>
  );
}
