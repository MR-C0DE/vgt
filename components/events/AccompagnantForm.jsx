import React from "react";
import styles from "./stylesheets/AccompagnantForm.module.css";

const AccompagnantForm = ({ index, data, onChange, t, onRemove }) => {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 className={styles.sectionTitle}>
            {t("event.form.section.accompagnant")} #{index + 1}
          </h3>
          <button
            type="button"
            onClick={() => onRemove(index)}
            style={{ color: "red" }}
          >
            {t("event.form.button.remove")}
          </button>
        </div>

        <label className={styles.inputGroup}>
          {t("event.form.label.firstName")}
          <input
            type="text"
            name={`accompagnant-${index}-firstName`}
            value={data.firstName}
            onChange={(e) => onChange(index, "firstName", e.target.value)}
          />
        </label>

        <label className={styles.inputGroup}>
          {t("event.form.label.lastName")}
          <input
            type="text"
            name={`accompagnant-${index}-lastName`}
            value={data.lastName}
            onChange={(e) => onChange(index, "lastName", e.target.value)}
          />
        </label>

        <fieldset className={styles.inputGroup}>
          <legend>{t("event.form.legend.ageCategory")}</legend>
          <div className={styles.checkboxGroup}>
            {["adult", "child", "toddler", "baby"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name={`accompagnant-${index}-ageCategory`}
                  value={type}
                  checked={data.ageCategory === type}
                  onChange={(e) =>
                    onChange(index, "ageCategory", e.target.value)
                  }
                />
                {t(`event.form.age.${type}`)}
              </label>
            ))}
          </div>
        </fieldset>

        <label className={styles.inputGroup}>
          {t("event.form.label.contribution")}
          <input
            type="text"
            name={`accompagnant-${index}-contribution`}
            value={data.contribution}
            onChange={(e) => onChange(index, "contribution", e.target.value)}
          />
        </label>

        <fieldset className={styles.inputGroup}>
          <legend>{t("event.form.legend.medical")}</legend>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="radio"
                name={`accompagnant-${index}-medicalIssues`}
                value="no"
                checked={data.allergies === "no"}
                onChange={() => onChange(index, "allergies", "no")}
              />
              {t("event.form.medical.no")}
            </label>
            <label>
              <input
                type="radio"
                name={`accompagnant-${index}-medicalIssues`}
                value="yes"
                checked={data.allergies === "yes"}
                onChange={() => onChange(index, "allergies", "yes")}
              />
              {t("event.form.medical.yes")}
            </label>
            <label>
              <input
                type="radio"
                name={`accompagnant-${index}-medicalIssues`}
                value="private"
                checked={data.allergies === "private"}
                onChange={() => onChange(index, "allergies", "private")}
              />
              {t("event.form.medical.private")}
            </label>
          </div>

          {data.allergies === "yes" && (
            <label className={styles.inputGroup}>
              {t("event.form.label.medicalDetails")}
              <textarea
                name={`accompagnant-${index}-medicalDetails`}
                value={data.medicalDetails}
                onChange={(e) =>
                  onChange(index, "medicalDetails", e.target.value)
                }
                rows="3"
                placeholder={t("event.form.placeholder.medicalDetails")}
              />
            </label>
          )}
        </fieldset>
      </section>
    </div>
  );
};

export default AccompagnantForm;
