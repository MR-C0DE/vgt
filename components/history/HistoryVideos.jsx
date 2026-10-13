import { useLanguage } from "../contexts/LanguageContext";
import styles from "./stylesheets/HistoryVideos.module.css";

const content = {
  en: {
    eyebrow: "Voice of God Tabernacle",
    title: "Our worship in images",
    intro: "A glimpse of the fellowship, the listening of the Message and the worship shared in our congregation.",
    videos: [
      { title: "Listening to the Message", description: "The congregation gathered around the recorded Word.", src: "/videos/history/listening-to-the-message.mp4", poster: "/videos/history/listening-to-the-message.jpg" },
      { title: "A moment of worship", description: "The congregation united in worship during a service.", src: "/videos/history/worship-service.mp4", poster: "/videos/history/worship-service.jpg" },
    ],
  },
  fr: {
    eyebrow: "Voice of God Tabernacle",
    title: "Notre culte en images",
    intro: "Un aperçu de la communion fraternelle, de l’écoute du Message et de l’adoration vécues dans notre assemblée.",
    videos: [
      { title: "À l’écoute du Message", description: "L’assemblée réunie autour de la Parole enregistrée.", src: "/videos/history/listening-to-the-message.mp4", poster: "/videos/history/listening-to-the-message.jpg" },
      { title: "Un moment d’adoration", description: "L’assemblée unie dans l’adoration pendant un service.", src: "/videos/history/worship-service.mp4", poster: "/videos/history/worship-service.jpg" },
    ],
  },
};

export default function HistoryVideos() {
  const { language } = useLanguage();
  const section = content[language] || content.en;

  return (
    <section className={styles.section} aria-labelledby="history-videos-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <span>{section.eyebrow}</span>
          <h2 id="history-videos-title">{section.title}</h2>
          <div className={styles.rule} aria-hidden="true" />
          <p>{section.intro}</p>
        </div>

        <div className={styles.grid}>
          {section.videos.map((video, index) => (
            <article className={styles.card} key={video.src}>
              <div className={styles.media}>
                <video controls playsInline preload="metadata" poster={video.poster}>
                  <source src={video.src} type="video/mp4" />
                </video>
                <span className={styles.number}>0{index + 1}</span>
              </div>
              <div className={styles.cardBody}>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
