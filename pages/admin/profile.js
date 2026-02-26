import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { HeaderAdmin } from "@/components/HeaderAdmin";
import CheckLogin from "@/components/CheckLogin";
import RoleGuard from "@/components/RoleGuard";
import { PERMISSIONS } from "@/constants/roles";
import { useRole } from "@/contexts/RoleContext";
import styles from "./styles/profile.module.css";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiKey,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";
import Link from "next/link";

export default function Profile() {
  return (
    <>
      <RoleGuard allowedRoles={PERMISSIONS.DASHBOARD}>
        <Head>
          <title>Mon Profil | Voice of God Tabernacle</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <HeaderAdmin />
        <ProfileContent />
      </RoleGuard>
    </>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { user, refresh } = useRole();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/controllers/users/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mettre à jour le token avec les nouvelles informations
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      setMessage({ type: "success", text: "Profil mis à jour avec succès" });
      refresh(); // Recharger les infos utilisateur dans le contexte
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Erreur lors de la mise à jour",
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
          <FiUser className={styles.headerIcon} />
          Mon Profil
        </h1>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileAvatar}>
          {user?.firstName?.charAt(0) || "U"}
          {user?.lastName?.charAt(0) || ""}
        </div>

        <div className={styles.userInfo}>
          <h2>{user?.firstName} {user?.lastName}</h2>
          <p className={styles.username}>@{user?.username}</p>
          <span className={styles.role}>
            {user?.role === "admin" ? "Administrateur" :
             user?.role === "editor" ? "Éditeur" : "Lecteur"}
          </span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nom</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (613) 555-0123"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            <FiSave /> {loading ? "Mise à jour..." : "Mettre à jour"}
          </button>
        </form>
      </div>
    </div>
  );
}