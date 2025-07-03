import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import SafariConfirmationModal from "./SafariConfirmationForm";
import SafariConfirmationList from "./SafariConfirmationList";
import styles from "./stylesheets/EventActions.module.css";

const EventActions = () => {
  const { t } = useTranslation();
  const [showParticipants, setShowParticipants] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const actionParticipants = () => {
    setShowParticipants(!showParticipants);
    setShowForm(false);
  };

  const actionForm = () => {
    setShowForm(!showForm);
    setShowParticipants(false);
  };

  return (
    <div className={styles.containerActions}>
      <div className={styles.containerButtons}>
        <button
          className={styles.btnRevealParticipants}
          onClick={actionParticipants}
        >
          {showParticipants
            ? t("event.action.hideParticipants")
            : t("event.action.showParticipants")}
        </button>

        <button className={styles.btnConfirmPresence} onClick={actionForm}>
          {showForm
            ? t("event.action.closeForm")
            : t("event.action.confirmPresence")}
        </button>
      </div>

      {showParticipants && <SafariConfirmationList />}

      {showForm && (
        <SafariConfirmationModal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default EventActions;
