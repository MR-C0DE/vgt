import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import SafariConfirmationModal from "./SafariConfirmationForm";
import ThanksParticipants from "./ThanksParticipants";
import ThanksContributions from "./ThanksContributions";
import ThanksTestimonies from "./ThanksTestimonies";
import styles from "./stylesheets/EventActions.module.css";

const EventActions = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(null);

  const toggleTab = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  return (
    <div className={styles.containerActions}>
      <div className={styles.containerButtons}>
        {/* Participants */}
        <button
          className={styles.btnRevealParticipants}
          onClick={() => toggleTab("participants")}
        >
          {activeTab === "participants"
            ? t("event.display.hideParticipants")
            : t("event.display.showParticipants")}
        </button>

        {/* Témoignages */}
        <button
          className={styles.btnRevealParticipants}
          onClick={() => toggleTab("testimonies")}
        >
          {activeTab === "testimonies"
            ? t("event.display.hideTestimonies")
            : t("event.display.showTestimonies")}
        </button>

        {/* Contributions */}
        <button
          className={styles.btnRevealParticipants}
          onClick={() => toggleTab("contributions")}
        >
          {activeTab === "contributions"
            ? t("event.display.hideContributions")
            : t("event.display.showContributions")}
        </button>
      </div>

      {/* Contenu affiché selon l’onglet actif */}
      {activeTab === "participants" && <ThanksParticipants />}

      {activeTab === "testimonies" && <ThanksTestimonies />}

      {activeTab === "contributions" && <ThanksContributions />}
    </div>
  );
};

export default EventActions;
