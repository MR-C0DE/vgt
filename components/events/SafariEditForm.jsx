import React from "react";
import styles from "./stylesheets/SafariConfirmationList.module.css";

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
  return (
    <form
      className={styles.modalForm}
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <h3>{t("event.display.edit")}</h3>

      <label>
        {t("event.form.label.firstName")}
        <input
          name="first_name"
          placeholder={t("event.form.placeholder.firstName")}
          value={formData.first_name || ""}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        {t("event.form.label.lastName")}
        <input
          name="last_name"
          placeholder={t("event.form.placeholder.lastName")}
          value={formData.last_name || ""}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        {t("event.form.legend.ageCategory")}
        <select
          name="age_category"
          value={formData.age_category || ""}
          onChange={handleChange}
          required
        >
          <option value="adult">{t("event.form.age.adult")}</option>
          <option value="child">{t("event.form.age.child")}</option>
          <option value="toddler">{t("event.form.age.toddler")}</option>
          <option value="baby">{t("event.form.age.baby")}</option>
        </select>
      </label>
      <label>
        {t("event.form.label.contribution")}
        <input
          name="contribution"
          placeholder={t("event.form.placeholder.contribution")}
          value={formData.contribution || ""}
          onChange={handleChange}
        />
      </label>
      <label>
        {t("event.form.legend.medical")}
        <select
          name="medical_issues"
          value={formData.medical_issues || ""}
          onChange={handleChange}
        >
          <option value="no">{t("event.form.medical.no")}</option>
          <option value="yes">{t("event.form.medical.yes")}</option>
          <option value="private">{t("event.form.medical.private")}</option>
        </select>
      </label>
      {formData.medical_issues === "yes" && (
        <label>
          {t("event.form.label.medicalDetails")}
          <textarea
            name="medical_details"
            placeholder={t("event.form.placeholder.medicalDetails")}
            value={formData.medical_details || ""}
            onChange={handleChange}
          />
        </label>
      )}

      <label>
        {t("event.form.legend.isDriver")}
        <select
          name="is_driver"
          value={formData.is_driver || ""}
          onChange={handleChange}
        >
          <option value="yes">{t("event.form.driver.yes")}</option>
          <option value="no">{t("event.form.driver.no")}</option>
        </select>
      </label>

      {formData.is_driver === "no" && (
        <label>
          {t("event.form.legend.accompagnantIsDriver")}
          <select
            name="accompagnant_is_driver"
            value={formData.accompagnant_is_driver || ""}
            onChange={handleChange}
          >
            <option value="yes">{t("event.form.driver.yes")}</option>
            <option value="no">{t("event.form.driver.no")}</option>
          </select>
        </label>
      )}

      <label>
        {t("event.form.legend.hasSpace")}
        <select
          name="has_space"
          value={formData.has_space || ""}
          onChange={handleChange}
        >
          <option value="">{t("event.display.choose")}</option>
          <option value="yes">{t("event.form.driver.yes")}</option>
          <option value="no">{t("event.form.driver.no")}</option>
        </select>
      </label>
      {formData.has_space === "yes" && (
        <>
          <label>
            {t("event.form.label.capacity")}
            <input
              type="number"
              name="capacity"
              placeholder={t("event.form.placeholder.capacity")}
              value={formData.capacity || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            {t("event.form.label.vehicle")}
            <input
              name="vehicle"
              placeholder={t("event.form.placeholder.vehicle")}
              value={formData.vehicle || ""}
              onChange={handleChange}
            />
          </label>
        </>
      )}
      <label>
        {t("event.form.label.phone")}
        <input
          name="phone"
          placeholder={t("event.form.placeholder.phone")}
          value={formData.phone || ""}
          onChange={handleChange}
        />
      </label>

      <h4>{t("event.form.section.accompagnants")}</h4>

      {formData.accompagnants.map((acc, i) => (
        <fieldset key={i}>
          <legend>
            {t("event.form.section.accompagnant")} #{i + 1}
            <button type="button" onClick={() => removeAccompagnant(i)}>
              {t("event.form.button.remove")}
            </button>
          </legend>

          <label>
            {t("event.form.label.firstName")}
            <input
              name="first_name"
              placeholder={t("event.form.placeholder.firstName")}
              value={acc.first_name || ""}
              onChange={(e) => handleAccompagnantChange(i, e)}
              required
            />
          </label>
          <label>
            {t("event.form.label.lastName")}
            <input
              name="last_name"
              placeholder={t("event.form.placeholder.lastName")}
              value={acc.last_name || ""}
              onChange={(e) => handleAccompagnantChange(i, e)}
              required
            />
          </label>
          <label>
            {t("event.form.legend.ageCategory")}
            <select
              name="age_category"
              value={acc.age_category || ""}
              onChange={(e) => handleAccompagnantChange(i, e)}
              required
            >
              <option value="adult">{t("event.form.age.adult")}</option>
              <option value="child">{t("event.form.age.child")}</option>
              <option value="toddler">{t("event.form.age.toddler")}</option>
              <option value="baby">{t("event.form.age.baby")}</option>
            </select>
          </label>
          <label>
            {t("event.form.label.contribution")}
            <input
              name="contribution"
              placeholder={t("event.form.placeholder.contribution")}
              value={acc.contribution || ""}
              onChange={(e) => handleAccompagnantChange(i, e)}
            />
          </label>
          <label>
            {t("event.form.legend.medical")}
            <select
              name="allergies"
              value={acc.allergies || ""}
              onChange={(e) => handleAccompagnantChange(i, e)}
            >
              <option value="no">{t("event.form.medical.no")}</option>
              <option value="yes">{t("event.form.medical.yes")}</option>
              <option value="private">{t("event.form.medical.private")}</option>
            </select>
          </label>
          {acc.allergies === "yes" && (
            <label>
              {t("event.form.label.medicalDetails")}
              <textarea
                name="medical_details"
                placeholder={t("event.form.placeholder.medicalDetails")}
                value={acc.medical_details || ""}
                onChange={(e) => handleAccompagnantChange(i, e)}
              />
            </label>
          )}
        </fieldset>
      ))}

      <button type="button" onClick={addAccompagnant}>
        {t("event.form.button.addAccompagnant")}
      </button>

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
