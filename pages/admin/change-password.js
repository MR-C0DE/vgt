import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { HeaderAdmin } from "@/components/HeaderAdmin";
import CheckLogin from "@/components/CheckLogin";
import RoleGuard from "@/components/RoleGuard";
import { PERMISSIONS } from "@/constants/roles";
import styles from "./styles/change-password.module.css";
import { FiKey, FiSave, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";

export default function ChangePassword() {
  return (
    <>
      <RoleGuard allowedRoles={PERMISSIONS.DASHBOARD}>
        <Head>
          <title>Changer mot de passe | Voice of God Tabernacle</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <HeaderAdmin />
        <ChangePasswordContent />
      </RoleGuard>
    </>
  );
}

function ChangePasswordContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleShowPassword = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validation
    if (formData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Le mot de passe doit contenir au moins 6 caractères",
      });
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Les mots de passe ne correspondent pas",
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/controllers/users/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: "Mot de passe changé avec succès" });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Erreur lors du changement",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin" className={styles.backLink}>
          <FiArrowLeft /> Retour au dashboard
        </Link>
        <h1>
          <FiKey className={styles.headerIcon} />
          Changer mon mot de passe
        </h1>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Mot de passe actuel</label>
            <div className={styles.passwordInput}>
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => toggleShowPassword("current")}
              >
                {showPasswords.current ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Nouveau mot de passe</label>
            <div className={styles.passwordInput}>
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => toggleShowPassword("new")}
              >
                {showPasswords.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Confirmer le nouveau mot de passe</label>
            <div className={styles.passwordInput}>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => toggleShowPassword("confirm")}
              >
                {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            <FiSave /> {loading ? "Changement en cours..." : "Changer le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}