import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import styles from "./stylesheets/SafariConfirmationForm.module.css";
import Cookies from "js-cookie";
import AccompagnantForm from "./AccompagnantForm";

const SafariConfirmationForm = () => {
  const { t } = useTranslation();

  const [allergies, setAllergies] = useState("no");
  const [placeNumber, setPlaceNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [accompagnants, setAccompagnants] = useState([]);
  const [isDriver, setIsDriver] = useState("");
  const [accompagnantDriver, setAccompagnantDriver] = useState("");
  const [havePlace, setHavePlace] = useState(true);

  const addAccompagnant = () => {
    setAccompagnants((prev) => [
      ...prev,
      {
        firstName: "",
        lastName: "",
        ageCategory: "",
        contribution: "",
        medicalDetails: "",
      },
    ]);
  };

  const handleAccompagnantChange = (index, field, value) => {
    const updated = [...accompagnants];
    updated[index][field] = value;
    setAccompagnants(updated);
  };

  const removeAccompagnant = (indexToRemove) => {
    setAccompagnants((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

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

    // Générer ou récupérer l'ID existant dans cookie
    let formSubmitId = Cookies.get("form_submit_id");
    if (!formSubmitId) {
      formSubmitId = generateId();
      Cookies.set("form_submit_id", formSubmitId, { expires: 365 }); // expire dans 1 an
    }

    const form = e.target;
    const newErrors = {};

    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const ageCategory = form.ageCategory.value;
    const phone = form.phone?.value?.trim();
    const hasSpace = form.hasSpace?.value;
    const vehicle = form.vehicle?.value?.trim();
    const capacity = Number(placeNumber);

    // Valides comme avant...

    // Validation accompagnants (exemple simple)
    accompagnants.forEach((acc, idx) => {
      if (!acc.firstName)
        newErrors[`acc_firstName_${idx}`] = `Prénom accompagnant #${
          idx + 1
        } requis`;
      if (!acc.lastName)
        newErrors[`acc_lastName_${idx}`] = `Nom accompagnant #${
          idx + 1
        } requis`;
      if (!acc.ageCategory)
        newErrors[`acc_ageCategory_${idx}`] = `Catégorie âge accompagnant #${
          idx + 1
        } requise`;
      if (acc.allergies === "yes" && !acc.medicalDetails)
        newErrors[
          `acc_medicalDetails_${idx}`
        ] = `Détail médical accompagnant #${idx + 1} requis`;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Construire données complètes avec accompagnants
      const data = {
        form_submit_id: formSubmitId,
        first_name: firstName,
        last_name: lastName,
        age_category: ageCategory,
        contribution: form.contribution.value.trim(),
        medical_issues: allergies,
        medical_details:
          allergies === "yes" ? form.medicalDetails.value.trim() : "",
        is_driver: isDriver,
        accompagnant_is_driver: accompagnantDriver,
        has_space: hasSpace || "",
        capacity: isNaN(capacity) ? 0 : capacity,
        vehicle: vehicle || "",
        phone: phone || "",
        accompagnants: accompagnants.map((acc) => ({
          firstName: acc.firstName,
          lastName: acc.lastName,
          ageCategory: acc.ageCategory,
          contribution: acc.contribution,
          allergies: acc.allergies,
          medicalDetails: acc.allergies === "yes" ? acc.medicalDetails : "",
        })),
      };
      alert(JSON.stringify(data));
      console.log(data);

      try {
        const response = await fetch("/api/safari_confirmation", {
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
          t("event.form.successMessage") || "Formulaire soumis avec succès !"
        );
        form.reset();
        setErrors({});
        setAllergies("no");
        setIsDriver("");
        setAccompagnantDriver("");
        setHavePlace(false);
        setPlaceNumber("");
        setAccompagnants([]); // reset aussi la liste des accompagnants
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
        <h3>{t("event.form.section.accompagnants")}</h3>
        {accompagnants.map((acc, idx) => (
          <AccompagnantForm
            key={idx}
            index={idx}
            data={acc}
            onChange={handleAccompagnantChange}
            onRemove={removeAccompagnant}
            t={t}
          />
        ))}
        <div>
          <button type="button" onClick={addAccompagnant}>
            {t("event.form.button.addAccompagnant")}
          </button>
        </div>
      </section>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          {t("event.form.section.driver")}
        </h3>

        <fieldset className={styles.inputGroup}>
          <legend>{t("event.form.legend.isDriver")}</legend>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="radio"
                name="isDriver"
                value="yes"
                checked={isDriver === "yes"}
                onChange={() => {
                  setIsDriver("yes");
                  setAccompagnantDriver("");
                  setPlaceNumber("");
                }}
              />
              {t("event.form.driver.yes")}
            </label>
            <label>
              <input
                type="radio"
                name="isDriver"
                value="no"
                checked={isDriver === "no"}
                onChange={() => {
                  setIsDriver("no");
                  setHavePlace(false);
                  setPlaceNumber("");
                }}
              />
              {t("event.form.driver.no")}
            </label>
          </div>
        </fieldset>

        {/* ✅ Ajout ou révision selon choix */}
        {(isDriver === "yes" || accompagnantDriver === "yes") && (
          <>
            <fieldset className={styles.inputGroup}>
              <legend>{t("event.form.legend.hasSpace")}</legend>
              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="radio"
                    name="hasSpace"
                    value="yes"
                    onChange={() => setHavePlace(false)} // ✅ logique claire
                  />
                  {t("event.form.driver.yes")}
                </label>
                <label>
                  <input
                    type="radio"
                    name="hasSpace"
                    value="no"
                    onChange={() => setHavePlace(true)} // ✅ logique claire
                  />
                  {t("event.form.driver.no")}
                </label>
              </div>
            </fieldset>

            {/* ✅ S'affiche si la personne a de la place */}
            {!havePlace && (
              <label className={styles.inputGroup}>
                {t("event.form.label.capacity")}
                <input
                  type="number"
                  name="capacity"
                  min="0"
                  value={placeNumber}
                  onChange={(e) => setPlaceNumber(e.target.value)} // 🔁 input contrôlé
                  placeholder={t("event.form.placeholder.capacity")}
                />
              </label>
            )}

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
          </>
        )}

        {/* Cas où l'utilisateur n'est pas conducteur mais son accompagnant l'est */}
        {isDriver === "no" && (
          <fieldset className={styles.inputGroup}>
            <legend>{t("event.form.legend.accompagnantIsDriver")}</legend>
            <div className={styles.checkboxGroup}>
              <label>
                <input
                  type="radio"
                  name="accompagnantDriver"
                  value="yes"
                  checked={accompagnantDriver === "yes"}
                  onChange={() => {
                    setAccompagnantDriver("yes");
                    setPlaceNumber("");
                  }}
                />
                {t("event.form.driver.yes")}
              </label>
              <label>
                <input
                  type="radio"
                  name="accompagnantDriver"
                  value="no"
                  checked={accompagnantDriver === "no"}
                  onChange={() => {
                    setAccompagnantDriver("no");
                    setHavePlace(false);
                    setPlaceNumber("");
                  }}
                />
                {t("event.form.driver.no")}
              </label>
            </div>
          </fieldset>
        )}
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
