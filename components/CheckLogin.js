import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const CheckLogin = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.replace('/admin/login'); // ← replace au lieu de push
    }
  }, [router]);

  return <>{children}</>;
};

export default CheckLogin;