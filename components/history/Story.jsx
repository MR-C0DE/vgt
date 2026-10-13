import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { dataStory } from "./data/dataStory";
import styles from "./stylesheets/Story.module.css";

const Story = () => {
  const { language } = useLanguage();
  const heading = language === "fr"
    ? { eyebrow: "Voice of God Tabernacle", title: "Notre histoire" }
    : { eyebrow: "Voice of God Tabernacle", title: "Our Story" };

  return (
    <section className={styles.historyContainer} aria-labelledby="our-story-title">
      <div className={styles.sectionHeading}>
        <span>{heading.eyebrow}</span>
        <h2 id="our-story-title">{heading.title}</h2>
        <div aria-hidden="true" />
      </div>

      <div className={styles.historyImage}>
        <img src="./images/ajust/13.jpg" alt="Church in the basement" />
      </div>

      <div className={styles.historyText}>
        {dataStory[language].map((item, index) =>
          item.type === "quote" ? (
            <blockquote
              className={`${styles.storyQuote} ${!item.reference ? styles.josephQuote : ""}`}
              key={index}
            >
              <p>“{item.text}”</p>
              {item.reference && (
                <footer>
                  <cite>{item.reference}</cite>
                  <span>{item.author}</span>
                </footer>
              )}
            </blockquote>
          ) : (
            <p key={index}>{item.text}</p>
          )
        )}
      </div>
    </section>
  );
};

export default Story;
