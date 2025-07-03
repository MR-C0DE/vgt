import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import styles from "./stylesheets/SafariConfirmationForm.module.css";

const SafariConfirmationForm = () => {
  const { t } = useTranslation();

  const [allergies, setAllergies] = useState("no");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newErrors = {};

    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const ageCategory = form.ageCategory.value;
    const isDriver = form.isDriver.value;
    const hasSpace = form.hasSpace.value;
    const phone = form.phone.value.trim();

    if (!firstName) newErrors.firstName = t("event.form.errors.firstName");
    if (!lastName) newErrors.lastName = t("event.form.errors.lastName");
    if (!ageCategory)
      newErrors.ageCategory = t("event.form.errors.ageCategory");
    if (!isDriver) newErrors.isDriver = t("event.form.errors.isDriver");
    if (!hasSpace) newErrors.hasSpace = t("event.form.errors.hasSpace");
    if (!phone || !/^\+?[0-9\s\-()]{10,}$/.test(phone)) {
      newErrors.phone = t("event.form.errors.phone");
    }

    if (allergies === "yes") {
      const medicalDetails = form.medicalDetails.value.trim();
      if (!medicalDetails)
        newErrors.medicalDetails = t("event.form.errors.medicalDetails");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const data = {
        first_name: firstName,
        last_name: lastName,
        age_category: ageCategory,
        contribution: form.contribution.value.trim(),
        medical_issues: allergies,
        medical_details:
          allergies === "yes" ? form.medicalDetails.value.trim() : "",
        is_driver: isDriver,
        has_space: hasSpace,
        capacity: form.capacity.value ? Number(form.capacity.value) : 0,
        vehicle: form.vehicle.value.trim(),
        phone,
      };

      try {
        const response = await fetch("/api/safari_confirmation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          // Optionnel : tu peux lire un message d'erreur côté serveur ici
          const errorData = await response.json();
          alert(`Erreur serveur : ${errorData.message || response.statusText}`);
          return;
        }

        alert(t("event.form.successMessage") || "Form submitted successfully!");
        form.reset();
        setAllergies("no");
        setErrors({});
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
      <h2 className={styles.formTitle}>{t("event.form.title")}</h2>

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

        <fieldset className={styles.inputGroup}>
          <legend>{t("event.form.legend.ageCategory")}</legend>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="radio" name="ageCategory" value="adult" />
              {t("event.form.age.adult")}
            </label>
            <label>
              <input type="radio" name="ageCategory" value="child" />
              {t("event.form.age.child")}
            </label>
            <label>
              <input type="radio" name="ageCategory" value="toddler" />
              {t("event.form.age.toddler")}
            </label>
            <label>
              <input type="radio" name="ageCategory" value="baby" />
              {t("event.form.age.baby")}
            </label>
          </div>
        </fieldset>

        <label className={styles.inputGroup}>
          {t("event.form.label.contribution")}
          <input
            type="text"
            name="contribution"
            placeholder={t("event.form.placeholder.contribution")}
          />
        </label>

        <fieldset className={styles.inputGroup}>
          <legend>{t("event.form.legend.medical")}</legend>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="radio"
                name="medicalIssues"
                value="no"
                checked={allergies === "no"}
                onChange={() => setAllergies("no")}
              />
              {t("event.form.medical.no")}
            </label>
            <label>
              <input
                type="radio"
                name="medicalIssues"
                value="yes"
                checked={allergies === "yes"}
                onChange={() => setAllergies("yes")}
              />
              {t("event.form.medical.yes")}
            </label>
            <label>
              <input
                type="radio"
                name="medicalIssues"
                value="private"
                checked={allergies === "private"}
                onChange={() => setAllergies("private")}
              />
              {t("event.form.medical.private")}
            </label>
          </div>

          {allergies === "yes" && (
            <label className={styles.inputGroup}>
              {t("event.form.label.medicalDetails")}
              <textarea
                name="medicalDetails"
                placeholder={t("event.form.placeholder.medicalDetails")}
                rows="3"
              />
            </label>
          )}
        </fieldset>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          {t("event.form.section.driver")}
        </h3>

        <fieldset className={styles.inputGroup}>
          <legend>{t("event.form.legend.isDriver")}</legend>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="radio" name="isDriver" value="yes" />
              {t("event.form.driver.yes")}
            </label>
            <label>
              <input type="radio" name="isDriver" value="no" />
              {t("event.form.driver.no")}
            </label>
          </div>
        </fieldset>

        <fieldset className={styles.inputGroup}>
          <legend>{t("event.form.legend.hasSpace")}</legend>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="radio" name="hasSpace" value="yes" />
              {t("event.form.driver.yes")}
            </label>
            <label>
              <input type="radio" name="hasSpace" value="no" />
              {t("event.form.driver.no")}
            </label>
          </div>
        </fieldset>

        <label className={styles.inputGroup}>
          {t("event.form.label.capacity")}
          <input
            type="number"
            name="capacity"
            min="0"
            placeholder={t("event.form.placeholder.capacity")}
          />
        </label>

        <label className={styles.inputGroup}>
          {t("event.form.label.vehicle")}
          <input
            type="text"
            name="vehicle"
            placeholder={t("event.form.placeholder.vehicle")}
          />
        </label>

        <label className={styles.inputGroup}>
          {t("event.form.label.phone")}
          <input
            type="tel"
            name="phone"
            placeholder={t("event.form.placeholder.phone")}
          />
        </label>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{t("event.form.section.info")}</h3>
        <ul>
          <li>
            <strong>{t("event.form.info.tarifs")}</strong>
          </li>
          <li>{t("event.form.info.enveloppe")}</li>
          <li>{t("event.form.info.depenses")}</li>
          <li>{t("event.form.info.apporter")}</li>
          <li>{t("event.form.info.meteo")}</li>
          <li>{t("event.form.info.enfants")}</li>
        </ul>
      </section>

      <button type="submit" className={styles.submitButton}>
        {t("event.form.button.submit")}
      </button>
    </form>
  );
};

export default SafariConfirmationForm;
