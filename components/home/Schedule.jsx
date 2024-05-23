import React from "react";
import styles from "./stylesheets/Schedule.module.css";
import { useTranslation } from "next-i18next";
import Link from "next/link";
const Schedule = () => {
    const { t } = useTranslation();
  return (
    <div className={styles.Schedule}>
      <div className={styles.content}>
        <div className={styles.title}>{t("joinus")}</div>
        <div className={styles.detail}>
          <p>
            {t("wlcMsg")}
          </p>
          <Link href={"/contact#info"}><button className={styles.button}>{t("Contact Us")}</button></Link>
          
        </div>
      </div>
    </div>
  );
};

export default Schedule;
