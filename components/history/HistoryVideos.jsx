import { useLanguage } from "../contexts/LanguageContext";
import styles from "./stylesheets/HistoryVideos.module.css";

const content = {
  en: {
    eyebrow: "Voice of God Tabernacle",
    title: "Our worship in images",
    intro: "A glimpse of the fellowship, the listening of the Message and the worship shared in our congregation.",
    messageLabel: "Message played during the service",
    services: [
      {
        date: "Sunday, April 19, 2026",
        dateTime: "2026-04-19",
        message: "65-0429E — The Choosing Of A Bride",
        videos: [
          { title: "Listening to the Message", description: "The congregation gathered in reverence around the recorded Word.", src: "/videos/history/congregation-in-worship.mp4", poster: "/videos/history/congregation-in-worship.jpg" },
          { title: "Closing worship", description: "The congregation singing together at the conclusion of the Message.", src: "/videos/history/praise-together.mp4", poster: "/videos/history/praise-together.jpg" },
        ],
      },
      {
        date: "Sunday, October 11, 2026",
        dateTime: "2026-10-11",
        message: "62-1014M — The Stature Of A Perfect Man",
        videos: [
          { title: "Listening to the Message", description: "The congregation gathered around the recorded Word.", src: "/videos/history/listening-to-the-message.mp4", poster: "/videos/history/listening-to-the-message.jpg" },
          { title: "Closing worship", description: "The congregation singing together at the conclusion of the Message.", src: "/videos/history/worship-service.mp4", poster: "/videos/history/worship-service.jpg" },
        ],
      },
    ],
  },
  fr: {
    eyebrow: "Voice of God Tabernacle",
    title: "Notre culte en images",
    intro: "Un aperçu de la communion fraternelle, de l’écoute du Message et de l’adoration vécues dans notre assemblée.",
    messageLabel: "Message diffusé pendant le service",
    services: [
      {
        date: "Dimanche 19 avril 2026",
        dateTime: "2026-04-19",
        message: "65-0429E — Le choix d’une Épouse",
        videos: [
          { title: "À l’écoute du Message", description: "L’assemblée recueillie autour de la Parole enregistrée.", src: "/videos/history/congregation-in-worship.mp4", poster: "/videos/history/congregation-in-worship.jpg" },
          { title: "Chant de clôture", description: "L’assemblée chantant ensemble à la fin du Message.", src: "/videos/history/praise-together.mp4", poster: "/videos/history/praise-together.jpg" },
        ],
      },
      {
        date: "Dimanche 11 octobre 2026",
        dateTime: "2026-10-11",
        message: "62-1014M — La stature d’un homme parfait",
        videos: [
          { title: "À l’écoute du Message", description: "L’assemblée réunie autour de la Parole enregistrée.", src: "/videos/history/listening-to-the-message.mp4", poster: "/videos/history/listening-to-the-message.jpg" },
          { title: "Chant de clôture", description: "L’assemblée chantant ensemble à la fin du Message.", src: "/videos/history/worship-service.mp4", poster: "/videos/history/worship-service.jpg" },
        ],
      },
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

        <div className={styles.services}>
          {section.services.map((service, serviceIndex) => (
            <section className={styles.service} key={service.dateTime}>
              <header className={styles.serviceHeader}>
                <time dateTime={service.dateTime}>{service.date}</time>
                <div>
                  <span>{section.messageLabel}</span>
                  <h3>{service.message}</h3>
                </div>
              </header>

              <div className={styles.grid}>
                {service.videos.map((video, videoIndex) => (
                  <article className={styles.card} key={video.src}>
                    <div className={styles.media}>
                      <video controls playsInline preload="metadata" poster={video.poster}>
                        <source src={video.src} type="video/mp4" />
                      </video>
                      <span className={styles.number}>0{serviceIndex * 2 + videoIndex + 1}</span>
                    </div>
                    <div className={styles.cardBody}>
                      <h4>{video.title}</h4>
                      <p>{video.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
