// pages/404.js
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { FiHome, FiAlertCircle } from 'react-icons/fi';
import styles from './../styles/404.module.css';

export default function Custom404() {
  const [language, setLanguage] = useState('fr'); // français par défaut

  useEffect(() => {
    // Lire la langue depuis le cookie
    const getLanguageFromCookie = () => {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'lang') {
          return value;
        }
      }
      return 'fr'; // défaut
    };

    setLanguage(getLanguageFromCookie());
  }, []);

  // Contenu multilingue
  const content = {
    fr: {
      title: "404",
      subtitle: "Page non trouvée",
      message: "Désolé, la page que vous recherchez n'existe pas ou a été déplacée.",
      button: "Retour à l'accueil",
      links: {
        services: "Services",
        history: "Histoire",
        contact: "Contact"
      }
    },
    en: {
      title: "404",
      subtitle: "Page Not Found",
      message: "Sorry, the page you are looking for does not exist or has been moved.",
      button: "Back to Home",
      links: {
        services: "Services",
        history: "History",
        contact: "Contact"
      }
    }
  };

  // Sélectionner la langue (français par défaut)
  const t = content[language] || content.fr;

  return (
    <>
      <Head>
        <title>404 - {t.subtitle} | Voice of God Tabernacle</title>
        <meta name="description" content={t.message} />
      </Head>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <FiAlertCircle className={styles.icon} />
          </div>
          
          <h1 className={styles.title}>{t.title}</h1>
          <h2 className={styles.subtitle}>{t.subtitle}</h2>
          
          <p className={styles.message}>{t.message}</p>

          <Link href="/" className={styles.homeButton}>
            <FiHome className={styles.buttonIcon} />
            {t.button}
          </Link>

          <div className={styles.links}>
            <Link href="/services" className={styles.link}>{t.links.services}</Link>
            <span className={styles.separator}>•</span>
            <Link href="/history" className={styles.link}>{t.links.history}</Link>
            <span className={styles.separator}>•</span>
            <Link href="/contact" className={styles.link}>{t.links.contact}</Link>
          </div>
        </div>
      </div>
    </>
  );
}