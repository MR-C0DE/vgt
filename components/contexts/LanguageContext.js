import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(() => {
    const langFromCookie = Cookies.get('lang');
    const userLanguage = typeof window !== 'undefined' ? window.navigator.language || window.navigator.userLanguage : 'en';
    return langFromCookie || userLanguage;
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    Cookies.set('lang', language, { expires: 365 });
  }, [language, i18n]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
