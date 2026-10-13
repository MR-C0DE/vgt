import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

export default function Custom404() {
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    const getLanguageFromCookie = () => {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'lang') {
          return value;
        }
      }
      return 'fr';
    };
    setLanguage(getLanguageFromCookie());
  }, []);

  const content = {
    fr: {
      title: "404",
      subtitle: "Page non trouvée",
      message: "Désolé, la page que vous recherchez n'existe pas ou a été déplacée.",
      button: "Retour à l'accueil"
    },
    en: {
      title: "404",
      subtitle: "Page Not Found",
      message: "Sorry, the page you are looking for does not exist or has been moved.",
      button: "Back to Home"
    }
  };

  const t = content[language] || content.fr;

  return (
    <>
      <Head>
        <title>404 - {t.subtitle} | Voice of God Tabernacle</title>
      </Head>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <FiAlertCircle size={80} color="#ffc107" />
          <h1 style={{ fontSize: '80px', margin: '20px 0', color: '#272727' }}>{t.title}</h1>
          <h2 style={{ color: '#666' }}>{t.subtitle}</h2>
          <p style={{ color: '#999', margin: '20px 0' }}>{t.message}</p>
          <Link href="/" style={{
            background: '#ffc107',
            color: '#272727',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FiHome /> {t.button}
          </Link>
        </div>
      </div>
    </>
  );
}
