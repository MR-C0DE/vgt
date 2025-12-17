import React from "react";
import { useTranslation } from "next-i18next";
import styles from "./stylesheets/Banner.module.css";

const Banner = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.Banner}>
      <div>
        <h2>{"Calendrier des réunions des sœurs"}</h2>
        <p>{"Dates officielles, horaires et informations importantes"}</p>
      </div>
    </div>
  );
};

export default Banner;
