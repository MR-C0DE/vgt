import { useTranslation } from "next-i18next";
import React from "react";
import styles from "./stylesheets/Information.module.css";

const Information = () => {
  const { t } = useTranslation();

  // Informations par défaut
  const defaultAddress = "2285 Boulevard Saint-Laurent, unit-D10";
  const defaultPhone = "+1 (613) 322-9508";
  const defaultEmail = "vgt@live.ca";

  return (
    <div id="info" className={styles.Information}>
      <div>
        <div className={styles.svg_content}>
          <img width={50} src="/location.svg" alt="Location Icon" />
        </div>
        <p className={styles.info_title}>{t("address")}</p>
        <div>
          <p className={styles.info_detail}>{t("defaultAddress")}</p>
          <p className={styles.info_description}>{t("addressDetail")}</p>
        </div>
      </div>

      <div>
        <div className={styles.svg_content}>
          <img width={50} src="/phone.svg" alt="Phone Icon" />
        </div>
        <p className={styles.info_title}>{t("phone")}</p>
        <div>
          <p className={styles.info_detail}>{defaultPhone}</p>
          <p className={styles.info_description}>{t("phoneDetail")}</p>
        </div>
      </div>

      <div>
        <div className={styles.svg_content}>
          <img width={50} src="/email.svg" alt="Email Icon" />
        </div>
        <p className={styles.info_title}>{t("email")}</p>
        <div>
          <p className={styles.info_detail}>{defaultEmail}</p>
          <p className={styles.info_description}>{t("emailDetail")}</p>
        </div>
      </div>
    </div>
  );
};

export default Information;
