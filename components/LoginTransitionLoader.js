// components/LoginTransitionLoader.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './stylesheets/LoginTransitionLoader.module.css';

const LoginTransitionLoader = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      // Afficher le loader seulement quand on va de /admin/login vers /admin
      if (router.pathname === '/admin/login' && url === '/admin') {
        setLoading(true);
      }
    };

    const handleComplete = () => {
      // Petit délai pour que le loader soit visible (optionnel)
      setTimeout(() => setLoading(false), 500);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  if (!loading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.loader}></div>
        <p className={styles.text}>Connexion en cours...</p>
      </div>
    </div>
  );
};

export default LoginTransitionLoader;