import React from "react";
import { useTranslation } from "next-i18next";
import styles from "./stylesheets/Banner.module.css";

const Banner = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.Banner}>
        <div>
        <h2>{t("Contact Us")}</h2>
            <p>{t("ContactUsDescription")}</p>
        </div>

    </div>
  );
};

export default Banner;
