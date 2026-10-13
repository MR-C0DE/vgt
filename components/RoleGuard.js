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
        router.replace('/admin/login');
      } else if (!hasRole(allowedRoles)) {
        router.replace(fallback);
      } else {
        setChecked(true);
      }
    }
  }, [loading, user, hasRole, allowedRoles, fallback, checked, router]);

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
