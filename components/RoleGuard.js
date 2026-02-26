import { useRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './stylesheets/RoleGuard.module.css';

const RoleGuard = ({ children, allowedRoles, fallback = '/admin' }) => {
  const { hasRole, loading, user } = useRole();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Ne pas exécuter si déjà vérifié
    if (checked) return;
    
    if (!loading) {
      if (!user) {
        window.location.href = '/admin/login'; // ← Redirection directe
      } else if (!hasRole(allowedRoles)) {
        window.location.href = fallback; // ← Redirection directe
      } else {
        setChecked(true);
      }
    }
  }, [loading, user, hasRole, allowedRoles, fallback, checked]);

  if (loading || !checked) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Vérification des autorisations...</p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;