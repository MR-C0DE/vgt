import { useTranslation } from "next-i18next";
import styles from "./stylesheets/EventError.module.css";

const EventError = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorTitle}>{t("eventErrorTitle")}</h2>
      <p className={styles.errorText}>{t("eventErrorMessage")}</p>
    </div>
  );
};

export default EventError;
