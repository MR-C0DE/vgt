import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'; // Importer axios
import styles from './styles/Login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  // Vérifier la présence du token dans le localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Rediriger vers la page admin si le token existe
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Réinitialiser l'erreur
    setError(null);

    try {
      const response = await axios.post('/api/controllers/users/login', {
        username,
        password,
      });

      // Vérifier si la réponse est OK (statut 2xx)
      if (response.status !== 200) {
        throw new Error('Login failed. Please check your credentials.');
      }

      // Si le login est réussi, on peut stocker le token et rediriger vers la page admin
      localStorage.setItem('token', response.data.token);
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>VGT LOGIN-ADMIN</h2>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className={styles.submitButton}>Login</button>
      </form>
    </div>
  );
}
