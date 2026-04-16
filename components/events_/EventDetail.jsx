import React, { useEffect } from "react";
import styles from "./stylesheets/EventDetail.module.css";
import { useLanguage } from "../contexts/LanguageContext";

const EventDetail = ({ data, lang }) => {
  const { language, setLanguage } = useLanguage(); // 'fr' ou 'en'
  const content = data.data[language];

  // Ne changer la langue que si 'lang' est 'fr' ou 'en' ET différente de la langue actuelle
  useEffect(() => {
    const isValidLang = lang === "fr" || lang === "en";
    if (isValidLang && lang !== language) {
      setLanguage(lang);
    }
  }, [lang, language, setLanguage]);

  if (!content) return <p>Contenu non disponible dans cette langue.</p>;

  return (
    <div className={styles.eventDetail}>
      <h1 className={styles.title}>{content.title}</h1>
      {content.sections.map((section, index) => {
        if (section.type === "paragraph") {
          return (
            <p key={index} className={styles.paragraph}>
              {section.content}
            </p>
          );
        }

        if (section.type === "heading") {
          return (
            <h2 key={index} className={styles.heading}>
              {section.content}
            </h2>
          );
        }

        if (section.type === "list") {
          return (
            <ul key={index} className={styles.list}>
              {section.items.map((item, i) => (
                <li key={i} className={styles.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return null;
      })}
    </div>
  );
};

export default EventDetail;
