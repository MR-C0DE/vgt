import React from "react";
import { useLanguage } from "./contexts/LanguageContext";
import Link from "next/link";  // Utilisation de Link pour une meilleure gestion des routes dans Next.js
import styles from "./stylesheets/Footer.module.css";

const Footer = () => {
  const { language } = useLanguage();
  const date = new Date();

  // Dictionnaire des liens pour la page "Confidentialité"
  const link = {
    fr: "Confidentialité",
    en: "Privacy",
  };

  return (
    <footer className={styles.footer}>
      <p>
        {date.getFullYear()} &copy; Voice of God Tabernacle - Ottawa | {" "}
        <Link href="/privacy">{link[language]}</Link>  {/* Supprimez <a> ici */}
      </p>
    </footer>
  );
};

export default Footer;
