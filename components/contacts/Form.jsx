import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import axios from "axios"; // Importer Axios
import styles from "./stylesheets/Form.module.css";
import { useScreenSize } from "../contexts/ScreenSizeContext";

const Form = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    object: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const { width } = useScreenSize();
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname) newErrors.firstname = t("errorFirstnameRequired");
    if (!formData.lastname) newErrors.lastname = t("errorLastnameRequired");
    if (!formData.email) {
      newErrors.email = t("errorEmailRequired");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("errorEmailInvalid");
    }
    if (!formData.object) newErrors.object = t("errorObjectRequired");
    if (!formData.message) newErrors.message = t("errorMessageRequired");

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await axios.post("/api/message", formData);
        setSuccessMessage(t("formSuccess"));
        setErrors({});
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          telephone: "",
          object: "",
          message: "",
        });
      } catch (error) {
        console.error("Error submitting the form:", error);
        setErrors({ submit: t("formError") });
      }
    }
  };

  return (
    <div className={styles.Form}>
      <form onSubmit={handleSubmit}>
        <label className={styles.labelg} htmlFor="">
          {t("Name")}*
        </label>
        <div className={styles.InputGroup}>
          <label className={styles.labels} htmlFor="">
            {t("Firstname")}*
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder={width >= 701 && t("Firstname")}
            value={formData.firstname}
            onChange={handleInputChange}
          />

          <label className={styles.labels} htmlFor="">
            {t("Lastname")}*
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder={width >= 701 && t("Lastname")}
            value={formData.lastname}
            onChange={handleInputChange}
          />
        </div>

        <label className={styles.labelg} htmlFor="">
          {t("Contact information")}
        </label>
        <div className={styles.InputGroup}>
          <label className={styles.labels} htmlFor="">
            {t("Email")}*
          </label>
          <input
            type="email"
            name="email"
            id="email"
            title="Email"
            placeholder={width >= 701 && t("Email") + "*"}
            value={formData.email}
            onChange={handleInputChange}
          />
          <label className={styles.labels} htmlFor="">
            {t("Telephone")}
          </label>
          <input
            type="tel"
            name="telephone"
            id="telephone"
            placeholder={width >= 701 && t("Telephone")}
            value={formData.telephone}
            onChange={handleInputChange}
          />
        </div>
        <label className={styles.labelg} htmlFor="">
          {t("Message content")}*
        </label>
        <div className={styles.InputGroup}>
          <label className={styles.labels} htmlFor="">
            {t("Object")}*
          </label>
          <input
            type="text"
            name="object"
            id="object"
            placeholder={width >= 701 && t("Object")}
            value={formData.object}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.InputGroup}>
          <label className={styles.labels} htmlFor="">
            {t("Message")}
          </label>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="10"
            placeholder={width >= 701 && t("Message")}
            value={formData.message}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <button type="submit" className={styles.SubmitButton}>
          {t("Submit button")}
        </button>
      </form>

      {/* Affichage des messages d'erreur */}
      {Object.keys(errors).length > 0 && (
        <div className={styles.ErrorMessages}>
          {Object.values(errors).map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      {/* Affichage du message de succès */}
      {successMessage && (
        <div className={styles.SuccessMessage}>{successMessage}</div>
      )}
    </div>
  );
};

export default Form;
