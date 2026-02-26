import React, { useState, useEffect } from "react";
import styles from "./stylesheets/Annonce.module.css";
import { useTranslation } from "react-i18next";
import { Calendar, User, Bell, ChevronRight } from "lucide-react";
import axios from "axios";

const Annonce = () => {
  const { t, i18n } = useTranslation();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("/api/controllers/announcements");
      setAnnonces(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const MAX_LENGTH = 200;

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.loader}></div>
        </div>
      </section>
    );
  }

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
            {annonces.map((annonce) => (
              <div key={annonce.id} className={styles.annonce}>
                <div className={styles.annonceHeader}>
                  <div className={styles.senderInfo}>
                    <User size={18} className={styles.senderIcon} />
                    <span className={styles.senderLabel}>{t("from")}</span>
                    <span className={styles.senderName}>{annonce.author}</span>
                  </div>
                  <div className={styles.dateInfo}>
                    <Calendar size={16} className={styles.dateIcon} />
                    <span className={styles.date}>
                      {new Date(annonce.date).toLocaleDateString(
                        i18n.language === "fr" ? "fr-FR" : "en-CA"
                      )}
                    </span>
                  </div>
                </div>

                <div className={styles.messageContent}>
                  <Message
                    text={
                      i18n.language === "fr"
                        ? annonce.content_fr
                        : annonce.content_en
                    }
                    maxLength={MAX_LENGTH}
                  />
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

  const shouldShowButton = text?.length > maxLength;
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
