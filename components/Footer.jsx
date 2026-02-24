import React from "react";
import { useLanguage } from "./contexts/LanguageContext";
import Link from "next/link";
import styles from "./stylesheets/Footer.module.css";
import { Heart } from "lucide-react";

const Footer = () => {
  const { language } = useLanguage();
  const date = new Date();

  const link = {
    fr: "Confidentialité",
    en: "Privacy",
  };

  return (
    <footer className={styles.footer}>
      <p>
        <span>{date.getFullYear()} © Voice of God Tabernacle - Ottawa</span>
        <span className={styles.separator}>|</span>
        <Link href="/privacy">{link[language]}</Link>
      </p>
    </footer>
  );
};

export default Footer;
