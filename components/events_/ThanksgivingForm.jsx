import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import styles from "./stylesheets/ThanksgivingForm.module.css";
import Cookies from "js-cookie";

const ThanksgivingForm = () => {
  const { t } = useTranslation();

  const [errors, setErrors] = useState({});
  const [participants, setParticipants] = useState(1);
  const [contribution, setContribution] = useState("");
  const [testimony, setTestimony] = useState("");

  const generateId = (length = 12) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formSubmitId = Cookies.get("thanksgiving_form_submit_id");
    if (!formSubmitId) {
      formSubmitId = generateId();
      Cookies.set("thanksgiving_form_submit_id", formSubmitId, {
        expires: 365,
      });
    }

    const form = e.target;
    const newErrors = {};

    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();

    if (!firstName) newErrors.firstName = t("event.form.errors.firstName");
    if (!lastName) newErrors.lastName = t("event.form.errors.lastName");

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = {
        form_submit_id: formSubmitId,
        first_name: firstName,
        last_name: lastName,
        participants,
        contribution,
        testimony,
      };

      try {
        const response = await fetch("/api/thanksgiving_confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Erreur serveur : ${errorData.message || response.statusText}`);
          return;
        }

        alert(
          t("event.form.successMessage") ||
            "Merci, votre inscription a bien été enregistrée !"
        );
        form.reset();
        setErrors({});
        setParticipants(1);
        setContribution("");
        setTestimony("");
      } catch (error) {
        alert(
          t("event.form.networkError") || "Erreur réseau, veuillez réessayer."
        );
        console.error("Network error:", error);
      }
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>{t("event.thanksgiving.form.title")}</h2>

      {Object.values(errors).length > 0 && (
        <div className={styles.errorBox}>
          <ul>
            {Object.values(errors).map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          {t("event.form.section.participant")}
        </h3>

        <label className={styles.inputGroup}>
          {t("event.form.label.firstName")}
          <input
            type="text"
            name="firstName"
            placeholder={t("event.form.placeholder.firstName")}
          />
        </label>

        <label className={styles.inputGroup}>
          {t("event.form.label.lastName")}
          <input
            type="text"
            name="lastName"
            placeholder={t("event.form.placeholder.lastName")}
          />
        </label>

        <label className={styles.inputGroup}>
          {t("event.thanksgiving.form.label.participants")}
          <input
            type="number"
            min="1"
            value={participants}
            onChange={(e) => setParticipants(Number(e.target.value))}
          />
        </label>

        <label className={styles.inputGroup}>
          {t("event.thanksgiving.form.label.contribution")}
          <input
            type="text"
            name="contribution"
            placeholder={t("event.thanksgiving.form.placeholder.contribution")}
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
          />
        </label>

        <fieldset className={styles.inputGroup}>
          <legend>{t("event.thanksgiving.form.label.testimony")}</legend>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="radio"
                name="testimony"
                value="yes"
                checked={testimony === "yes"}
                onChange={() => setTestimony("yes")}
              />
              {t("event.form.choice.yes")}
            </label>
            <label>
              <input
                type="radio"
                name="testimony"
                value="no"
                checked={testimony === "no"}
                onChange={() => setTestimony("no")}
              />
              {t("event.form.choice.no")}
            </label>
          </div>
        </fieldset>
      </section>

      <button type="submit" className={styles.submitButton}>
        {t("event.form.button.submit")}
      </button>
    </form>
  );
};

export default ThanksgivingForm;
