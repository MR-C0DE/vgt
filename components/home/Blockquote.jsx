import React from "react";
import styles from "./stylesheets/Blockquote.module.css";
import { useTranslation } from "next-i18next";
import { Quote } from "lucide-react";

const Blockquote = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.decorTop}></div>
      <div className={styles.decorBottom}></div>

      <figure className={styles.blockquote}>
        <div className={styles.quoteIcon}>
          <Quote size={32} />
        </div>

        <blockquote>
          <p className={styles.quoteText}>"{t("quote")}"</p>
        </blockquote>

        <figcaption className={styles.figcaption}>
          <span className={styles.dash}>—</span>
          <cite className={styles.cite}>{t("ref")}</cite>
        </figcaption>

        <div className={styles.quoteIconEnd}>
          <Quote size={24} />
        </div>
      </figure>
    </div>
  );
};

export default Blockquote;
