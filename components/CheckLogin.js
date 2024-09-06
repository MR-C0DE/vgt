import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const CheckLogin = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
      // Vérifier si le token est présent dans le localStorage
      const token = localStorage.getItem('token');
  
      // Si pas de token, rediriger vers la page de login
      if (!token) {
        router.push('/admin/login'); // Rediriger vers la page de login
      } 
    }, [router]);

    return (
      <div>
          {children}
      </div>
    );
};

export default CheckLogin;
