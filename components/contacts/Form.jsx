import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import styles from "./stylesheets/Form.module.css";

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
        <label htmlFor="">{t("Name")}*</label>
        <div className={styles.InputGroup}>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder={t("Firstname")}
            value={formData.firstname}
            onChange={handleInputChange}
          />

          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder={t("Lastname")}
            value={formData.lastname}
            onChange={handleInputChange}
          />
        </div>

        <label htmlFor="">{t("Contact information")}</label>
        <div className={styles.InputGroup}>
          <input
            type="email"
            name="email"
            id="email"
            title="Email"
            placeholder={t("Email")+ "*"}
            value={formData.email}
            onChange={handleInputChange}
          />

          <input
            type="tel"
            name="telephone"
            id="telephone"
            placeholder={t("Telephone")}
            value={formData.telephone}
            onChange={handleInputChange}
          />
        </div>
        <label htmlFor="">{t("Message content")}*</label>
        <div className={styles.InputGroup}>
          <input
            type="text"
            name="object"
            id="object"
            placeholder={t("Object")}
          />
        </div>

        <div className={styles.InputGroup}>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="10"
            placeholder={t("Message")}
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
