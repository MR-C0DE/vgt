import React from 'react';
import styles from "./stylesheets/Program.module.css";
import { useTranslation } from "next-i18next";
const Program = () => {
  const {t}  = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h3 className={styles.title}>{t('sunday_worship')}</h3>
        <h4 className={styles.time}>{t('sunday_time')}</h4>
        <p className={styles.description}>{t('sunday_description')}</p>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{t('prayer_meeting')}</h3>
        <h4 className={styles.time}>{t('wednesday_time')}</h4>
        <p className={styles.description}>{t('wednesday_description')}</p>
      </div>
    </div>
  );
};

export default Program;
