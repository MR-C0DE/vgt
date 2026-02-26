import { useRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from './stylesheets/RoleGuard.module.css';

const RoleGuard = ({ children, allowedRoles, fallback = '/admin' }) => {
  const { hasRole, loading, user } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Pas connecté
        router.push('/admin/login');
      } else if (!hasRole(allowedRoles)) {
        // Pas les droits
        router.push(fallback);
      }
    }
  }, [loading, user, hasRole, allowedRoles, router, fallback]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Vérification des autorisations...</p>
      </div>
    );
  }

  if (!user || !hasRole(allowedRoles)) {
    return null;
  }

  return children;
};

export default RoleGuard;