import React from "react";
import { useTranslation } from "next-i18next";
import styles from "./stylesheets/Banner.module.css";

const Banner = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.Banner}>
        <div>
        <h2>{"Nos réunions de services"}</h2>
            
        </div>

    </div>
  );
};

export default Banner;
