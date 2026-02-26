import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    // Éviter les exécutions multiples
    if (initialized.current) return;
    initialized.current = true;
    
    loadUserFromToken();
  }, []);

  const loadUserFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Décoder le token JWT
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      
      setUser({
        id: payload.id,
        username: payload.username,
        role: payload.role || 'viewer',
        firstName: payload.first_name,
        lastName: payload.last_name,
        email: payload.email,
        phone: payload.phone || '',
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    if (typeof allowedRoles === 'string') {
      return user.role === allowedRoles;
    }
    return allowedRoles.includes(user.role);
  };

  const isAdmin = () => user?.role === 'admin';
  const isEditor = () => user?.role === 'editor' || user?.role === 'admin';

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    
    // Utiliser window.location pour éviter les boucles
    window.location.href = '/admin/login';
  };

  const value = {
    user,
    loading,
    hasRole,
    isAdmin,
    isEditor,
    logout,
    refresh: loadUserFromToken
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};