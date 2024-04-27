
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useLanguage } from './contexts/LanguageContext';
import styles from "./stylesheets/Language.module.css";

const Languages = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    router.push(router.pathname, undefined, { locale: selectedLanguage });
    setMenuOpen(false); // Close the menu after selection
  };

  useEffect(() => {
    console.log(t("welcome"), language);
  }, [language, t]);

  return (
    <div className={styles.Language}>
      <div className={styles.menu}>
        <button className={styles.selectedLanguage} onClick={() => setMenuOpen(!menuOpen)}>
          {language === 'en' ? 'English' : 'Français'}
        </button>
        {menuOpen && (
          <ul className={styles.languageMenu}>
            <li onClick={() => handleChange('en')}>English</li>
            <li onClick={() => handleChange('fr')}>Français</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Languages;