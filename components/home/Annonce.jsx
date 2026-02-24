import React, { useState } from "react";
import styles from "./stylesheets/Annonce.module.css";
import { useTranslation } from "react-i18next";
import { Calendar, User, Bell, ChevronRight } from "lucide-react";

const Annonce = () => {
  const { t, i18n } = useTranslation();

  const annonces = [
    {
      expediteur: "Frère Jean-Claude",
      message:
        i18n.language === "fr"
          ? "Nous vous saluons dans le précieux nom de notre Seigneur et Sauveur Jésus-Christ.\n\nNous informons toute l’Église que les dimanches 1er mars et 8 mars, le service se passera en famille.\n\nLe mercredi 4 mars, l’église sera ouverte entre 16h30 et 19h30 pour un service de prière silencieuse.\n\nQue Dieu vous bénisse.\n\nSigné : Frère Jean-Claude"
          : "We greet you in the precious name of our Lord and Savior Jesus Christ.\n\nWe inform the whole church that on Sunday March 1st and March 8th, the service will be held with families at home.\n\nOn Wednesday March 4th, the church will be open from 4:30 PM to 7:30 PM for a silent prayer service.\n\nMay God bless you.\n\nSigned: Brother Jean-Claude",
      date: "2026-03-01",
    },
  ];
  annonces.length = 0;
  const MAX_LENGTH = 150;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <Bell size={32} />
          </div>
          <h2 className={styles.title}>
            {t("annoncesTitle")}
            <span className={styles.titleAccent}></span>
          </h2>
        </div>

        {annonces.length === 0 ? (
          <div className={styles.emptyState}>
            <img width={80} src="/no-msg.svg" alt="" />
            <p className={styles.emptyText}>{t("noMessages")}</p>
          </div>
        ) : (
          <div className={styles.annoncesGrid}>
            {annonces.map((annonce, index) => (
              <div key={index} className={styles.annonce}>
                <div className={styles.annonceHeader}>
                  <div className={styles.senderInfo}>
                    <User size={18} className={styles.senderIcon} />
                    <span className={styles.senderLabel}>{t("from")}</span>
                    <span className={styles.senderName}>
                      {annonce.expediteur}
                    </span>
                  </div>
                  <div className={styles.dateInfo}>
                    <Calendar size={16} className={styles.dateIcon} />
                    <span className={styles.date}>{annonce.date}</span>
                  </div>
                </div>

                <div className={styles.messageContent}>
                  <Message text={annonce.message} maxLength={MAX_LENGTH} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Message = ({ text, maxLength }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const shouldShowButton = text.length > maxLength;
  const displayText =
    isExpanded || !shouldShowButton ? text : `${text.slice(0, maxLength)}...`;

  return (
    <div className={styles.messageWrapper}>
      <p className={styles.message} style={{ whiteSpace: "pre-line" }}>
        {displayText}
      </p>

      {shouldShowButton && (
        <div className={styles.buttonContainer}>
          <button className={styles.readMoreButton} onClick={toggleExpansion}>
            <span>{isExpanded ? t("readLess") : t("readMore")}</span>
            <ChevronRight
              size={18}
              className={`${styles.buttonIcon} ${
                isExpanded ? styles.rotated : ""
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Annonce;
