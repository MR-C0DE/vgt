import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import styles from "./stylesheets/Form.module.css";
import { useScreenSize } from "../contexts/ScreenSizeContext";

const Form = () => {
  const { t } = useTranslation();
  // États pour stocker les valeurs des champs du formulaire
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    object: "",
    message: "",
  });

  const {width} = useScreenSize();



  // Gestionnaire d'événements pour mettre à jour les valeurs du formulaire
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gestionnaire d'événements pour la soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();
    // Vous pouvez accéder aux valeurs du formulaire via formData
    console.log(formData);
    // Ici, vous pouvez ajouter la logique pour envoyer les données du formulaire
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
            
            placeholder={ width >= 701 && t("Firstname")}
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
            placeholder={ width >= 701 && t("Lastname")}
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
            placeholder={ width >= 701 && t("Email") + "*"}
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
            placeholder={ width >= 701 && t("Telephone")}
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
            placeholder={ width >= 701 && t("Object")}
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
            placeholder={ width >= 701 && t("Message")}
            value={formData.message}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <button type="submit" className={styles.SubmitButton}>
          {t("Submit button")}
        </button>
      </form>
    </div>
  );
};

export default Form;
