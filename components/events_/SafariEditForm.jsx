// SafariEditForm.js (Version corrigée)
import React from "react";
import styles from "./stylesheets/SafariEdit.module.css";
import AccompagnantForm from "./AccompagnantForm";

const SafariEditForm = ({
  t,
  formData,
  handleChange,
  handleAccompagnantChange,
  addAccompagnant,
  removeAccompagnant,
  handleSave,
  closeModal,
}) => {
  const isDriverYes = formData.is_driver === "yes";
  const accompagnantDriverYes = formData.accompagnant_is_driver === "yes";
  const hasSpaceYes = formData.has_space === "yes";
  const hasMedicalIssues = formData.medical_issues === "yes";

  return (
    <form
      className={styles.modalForm}
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <h2 className={styles.formTitle}>{t("event.display.edit")}</h2>

      <div className={styles.section}>
        <label className={styles.inputGroup}>
          {t("event.form.label.firstName")}
          <input
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleChange}
            placeholder={t("event.form.placeholder.firstName")}
            required
          />
        </label>

        <label className={styles.inputGroup}>
          {t("event.form.label.lastName")}
          <input
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleChange}
            placeholder={t("event.form.placeholder.lastName")}
            required
          />
        </label>

        <fieldset className={styles.inputGroup}>
          <legend>{t("event.form.legend.ageCategory")}</legend>
          <div className={styles.checkboxGroup}>
            {["adult", "child", "toddler", "baby"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="age_category"
                  value={type}
                  checked={formData.age_category === type}
                  onChange={handleChange}
                />
                {t(`event.form.age.${type}`)}
              </label>
            ))}
          </div>
        </fieldset>

        <label className={styles.inputGroup}>
          {t("event.form.label.contribution")}
          <input
            name="contribution"
            value={formData.contribution || ""}
            onChange={handleChange}
            placeholder={t("event.form.placeholder.contribution")}
          />
        </label>

        <fieldset className={styles.inputGroup}>
          <legend>{t("event.form.legend.medical")}</legend>
          <div className={styles.checkboxGroup}>
            {["no", "yes", "private"].map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="medical_issues"
                  value={option}
                  checked={formData.medical_issues === option}
                  onChange={handleChange}
                />
                {t(`event.form.medical.${option}`)}
              </label>
            ))}
          </div>

          {hasMedicalIssues && (
            <label className={styles.inputGroup}>
              {t("event.form.label.medicalDetails")}
              <textarea
                name="medical_details"
                value={formData.medical_details || ""}
                onChange={handleChange}
                placeholder={t("event.form.placeholder.medicalDetails")}
              />
            </label>
          )}
        </fieldset>
      </div>

      <div className={styles.section}>
        <fieldset className={styles.inputGroup}>
          <legend>{t("event.form.legend.isDriver")}</legend>
          <div className={styles.checkboxGroup}>
            {["yes", "no"].map((val) => (
              <label key={val}>
                <input
                  type="radio"
                  name="is_driver"
                  value={val}
                  checked={formData.is_driver === val}
                  onChange={handleChange}
                />
                {t(`event.form.driver.${val}`)}
              </label>
            ))}
          </div>
        </fieldset>

        {formData.is_driver === "no" && (
          <fieldset className={styles.inputGroup}>
            <legend>{t("event.form.legend.accompagnantIsDriver")}</legend>
            <div className={styles.checkboxGroup}>
              {["yes", "no"].map((val) => (
                <label key={val}>
                  <input
                    type="radio"
                    name="accompagnant_is_driver"
                    value={val}
                    checked={formData.accompagnant_is_driver === val}
                    onChange={handleChange}
                  />
                  {t(`event.form.driver.${val}`)}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {(isDriverYes || accompagnantDriverYes) && (
          <>
            <fieldset className={styles.inputGroup}>
              <legend>{t("event.form.legend.hasSpace")}</legend>
              <div className={styles.checkboxGroup}>
                {["yes", "no"].map((val) => (
                  <label key={val}>
                    <input
                      type="radio"
                      name="has_space"
                      value={val}
                      checked={formData.has_space === val}
                      onChange={handleChange}
                    />
                    {t(`event.form.driver.${val}`)}
                  </label>
                ))}
              </div>
            </fieldset>

            {hasSpaceYes && (
              <>
                <label className={styles.inputGroup}>
                  {t("event.form.label.capacity")}
                  <input
                    type="number"
                    name="capacity"
                    min="0"
                    value={formData.capacity || ""}
                    onChange={handleChange}
                    placeholder={t("event.form.placeholder.capacity")}
                  />
                </label>

                <label className={styles.inputGroup}>
                  {t("event.form.label.vehicle")}
                  <input
                    type="text"
                    name="vehicle"
                    value={formData.vehicle || ""}
                    onChange={handleChange}
                    placeholder={t("event.form.placeholder.vehicle")}
                  />
                </label>
              </>
            )}

            <label className={styles.inputGroup}>
              {t("event.form.label.phone")}
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder={t("event.form.placeholder.phone")}
              />
            </label>
          </>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          {t("event.form.section.accompagnants")}
        </h3>

        {formData.accompagnants.map((acc, index) => (
          <AccompagnantForm
            key={index}
            index={index}
            data={{
              firstName: acc.first_name,
              lastName: acc.last_name,
              ageCategory: acc.age_category,
              contribution: acc.contribution,
              allergies: acc.allergies,
              medicalDetails: acc.medical_details,
            }}
            onChange={(idx, key, value) =>
              handleAccompagnantChange(idx, {
                target: {
                  name:
                    key === "firstName"
                      ? "first_name"
                      : key === "lastName"
                      ? "last_name"
                      : key === "ageCategory"
                      ? "age_category"
                      : key === "medicalDetails"
                      ? "medical_details"
                      : key,
                  value,
                },
              })
            }
            onRemove={removeAccompagnant}
            t={t}
          />
        ))}

        <div>
          <button
            type="button"
            className={styles.addAccompagnant}
            onClick={addAccompagnant}
          >
            {t("event.form.button.addAccompagnant")}
          </button>
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button type="submit">{t("event.display.save")}</button>
        <button type="button" onClick={closeModal}>
          {t("event.display.cancel")}
        </button>
      </div>
    </form>
  );
};

export default SafariEditForm;
