import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import styles from "./styles/Login.module.css";
import { FiLock, FiUser, FiLogIn } from "react-icons/fi";
const currentYear = new Date().getFullYear();
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Vérifier la présence du token dans le localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/api/controllers/users/login", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        // Stocker aussi les infos utilisateur si nécessaire
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        router.push("/admin");
      } else {
        throw new Error("Token non reçu");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || 
        "Erreur de connexion. Vérifiez vos identifiants."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Head>
        <title>Login Admin | Voice of God Tabernacle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.loginWrapper}>
        <div className={styles.loginHeader}>
          <h1>Voice of God Tabernacle</h1>
          <p>Espace Administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h2>Connexion</h2>

          {error && (
            <div className={styles.errorMessage}>
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="username">
              <FiUser className={styles.inputIcon} />
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">
              <FiLock className={styles.inputIcon} />
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.loader}></span>
            ) : (
              <>
                <FiLogIn />
                Se connecter
              </>
            )}
          </button>

          <div className={styles.loginFooter}>
            <p> © {currentYear} Voice of God Tabernacle.</p>
          </div>
        </form>
      </div>
    </div>
  );
}