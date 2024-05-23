import React from 'react'
import styles from "./stylesheets/Blockquote.module.css";
import { useTranslation } from "next-i18next";
const Blockquote = () => {
  const { t } = useTranslation();
  return (
    <figure className={styles.dds__blockquote}>
    <blockquote>
      <p>
        {t("quote")}
      </p>
    </blockquote>
    <figcaption>
      —<cite>{t("ref")}</cite>
    </figcaption>
  </figure>
  )
}

export default Blockquote