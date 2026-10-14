import { useLanguage } from "../contexts/LanguageContext";
import styles from "./stylesheets/Album.module.css";

const photos = ["0.jpg", "1.jpg", "7.jpg", "10.jpg", "6.jpg", "4.jpg"];

const content = {
  en: {
    title: "A few memories",
    intro: "Precious moments of fellowship, worship and life shared together through the years.",
    alt: "A memory from Voice of God Tabernacle",
  },
  fr: {
    title: "Quelques souvenirs",
    intro: "De précieux moments de communion fraternelle, d’adoration et de vie partagés au fil des années.",
    alt: "Un souvenir de Voice of God Tabernacle",
  },
};

export default function Album() {
  const { language } = useLanguage();
  const section = content[language] || content.en;

  return (
    <section className={styles.section} aria-labelledby="memories-title">
      <div className={styles.heading}>
        <h2 id="memories-title">{section.title}</h2>
        <div className={styles.rule} aria-hidden="true" />
        <p>{section.intro}</p>
      </div>

      <div className={styles.album}>
        {photos.map((photo, index) => (
          <figure className={styles.photo} key={photo}>
            <img
              src={`/images/ajust/${photo}`}
              alt={`${section.alt} ${index + 1}`}
              loading="lazy"
            />
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          </figure>
        ))}
      </div>
    </section>
  );
}
