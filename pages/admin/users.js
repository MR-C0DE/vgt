import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { HeaderAdmin } from "@/components/HeaderAdmin";
import { AdminConfirmDialog, AdminNotice } from "@/components/AdminFeedback";
import CheckLogin from "@/components/CheckLogin";
import RoleGuard from "@/components/RoleGuard";
import { PERMISSIONS } from "@/constants/roles";
import styles from "./styles/users.module.css";
import {
  FiUsers,
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiSave,
  FiUser,
  FiMail,
  FiPhone,
  FiKey,
  FiRefreshCw,
} from "react-icons/fi";

const ROLES = [
  { value: "admin", label: "Administrateur", color: "#ffc107" },
  { value: "editor", label: "Éditeur", color: "#17a2b8" },
  { value: "viewer", label: "Lecteur", color: "#6c757d" },
];

const EMPTY_USER = {
  id: null,
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "editor",
};

export default function Users() {
  return (
    <>
      <RoleGuard allowedRoles={PERMISSIONS.USERS}>
        <Head>
          <title>Gestion des utilisateurs | Voice of God Tabernacle</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <HeaderAdmin />
        <UsersContent />
      </RoleGuard>
    </>
  );
}

function UsersContent() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(EMPTY_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur connecté
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

        const payload = JSON.parse(atob(base64));

        setCurrentUserRole(payload.role);
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // CORRECTION: enlever "/user" du chemin
      const response = await axios.get("/api/controllers/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      } else if (error.response?.status === 403) {
        router.push("/admin");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleAddClick = () => {
    setEditingUser(EMPTY_USER);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (user) => {
    setEditingUser({
      id: user._id || user.id,
      username: user.username,
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "editor",
      password: "", // Ne pas afficher le mot de passe
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(EMPTY_USER);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
  
      const userData = {
        username: editingUser.username,
        first_name: editingUser.firstName,
        last_name: editingUser.lastName,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
      };
      
      // N'ajouter le mot de passe que s'il est fourni
      if (editingUser.password) {
        userData.password = editingUser.password;
      }
  
      if (isEditing) {
        await axios.put(
          `/api/controllers/users?id=${editingUser.id}`,
          userData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Pour la création, le mot de passe est requis
        if (!editingUser.password) {
          setNotice({ type: "error", text: "Le mot de passe est requis" });
          return;
        }
        await axios.post("/api/controllers/users", userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
  
      await fetchUsers();
      handleCancelForm();
      setNotice({ type: "success", text: isEditing ? "Utilisateur mis à jour." : "Utilisateur créé." });
    } catch (error) {
      console.error("Error saving user:", error);
      setNotice({ type: "error", text: error.response?.data?.error || "Erreur lors de l'enregistrement" });
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      // CORRECTION: enlever "/user" du chemin
      await axios.delete(`/api/controllers/users?id=${deleteTarget.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers();
      setDeleteTarget(null);
      setNotice({ type: "success", text: "Utilisateur supprimé." });
    } catch (error) {
      console.error("Error deleting user:", error);
      setNotice({ type: "error", text: error.response?.data?.error || "Erreur lors de la suppression" });
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  const getRoleLabel = (role) => {
    const found = ROLES.find((r) => r.value === role);
    return found ? found.label : role;
  };

  const getRoleColor = (role) => {
    const found = ROLES.find((r) => r.value === role);
    return found ? found.color : "#6c757d";
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminNotice notice={notice} onClose={() => setNotice(null)} />
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>
            <FiUsers className={styles.headerIcon} />
            Gestion des utilisateurs
          </h1>
          <div className={styles.headerActions}>
            <button
              className={styles.refreshButton}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FiRefreshCw className={refreshing ? styles.spinning : ""} />
              Actualiser
            </button>
            {currentUserRole === "admin" && (
              <button className={styles.addButton} onClick={handleAddClick}>
                <FiUserPlus /> Nouvel utilisateur
              </button>
            )}
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.stats}>
            <span>Total: {users.length} utilisateurs</span>
            <span>•</span>
            <span>
              Admins: {users.filter((u) => u.role === "admin").length}
            </span>
            <span>•</span>
            <span>
              Éditeurs: {users.filter((u) => u.role === "editor").length}
            </span>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2>
                {isEditing ? (
                  <>✏️ Modifier l'utilisateur</>
                ) : (
                  <>➕ Ajouter un utilisateur</>
                )}
              </h2>
              <button className={styles.closeButton} onClick={handleCancelForm}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nom d'utilisateur *</label>
                  <input
                    type="text"
                    name="username"
                    value={editingUser.username}
                    onChange={handleInputChange}
                    required
                    disabled={isEditing}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Rôle</label>
                  <select
                    name="role"
                    value={editingUser.role}
                    onChange={handleInputChange}
                    style={{ borderColor: getRoleColor(editingUser.role) }}
                  >
                    {ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Prénom *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editingUser.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Nom *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editingUser.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={editingUser.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editingUser.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>
                  {isEditing
                    ? "Nouveau mot de passe (laisser vide pour ne pas changer)"
                    : "Mot de passe *"}
                </label>
                <input
                  type="password"
                  name="password"
                  value={editingUser.password}
                  onChange={handleInputChange}
                  required={!isEditing}
                  minLength={12}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  <FiSave /> {isEditing ? "Mettre à jour" : "Créer"}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancelForm}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des utilisateurs */}
      <div className={styles.userGrid}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user._id || user.id} className={styles.userCard}>
              <div className={styles.userCardHeader}>
                <div className={styles.userAvatar}>
                  <FiUser />
                </div>
                <div className={styles.userInfo}>
                  <h3>
                    {user.first_name} {user.last_name}
                  </h3>
                  <span className={styles.userUsername}>@{user.username}</span>
                </div>
                <span
                  className={styles.userRole}
                  style={{ backgroundColor: getRoleColor(user.role) }}
                >
                  {getRoleLabel(user.role)}
                </span>
              </div>

              <div className={styles.userCardBody}>
                <div className={styles.userDetail}>
                  <FiMail />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className={styles.userDetail}>
                    <FiPhone />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className={styles.userDetail}>
                  <FiKey />
                  <span>
                    Créé le{" "}
                    {new Date(user.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              {currentUserRole === "admin" && (
                <div className={styles.userCardFooter}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick(user)}
                    title="Modifier"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => setDeleteTarget({ id: user._id || user.id, username: user.username })}
                    title="Supprimer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <FiUsers size={48} />
            <p>Aucun utilisateur trouvé</p>
            {searchTerm && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchTerm("")}
              >
                Effacer la recherche
              </button>
            )}
          </div>
        )}
      </div>
      <AdminConfirmDialog open={Boolean(deleteTarget)} title="Supprimer cet utilisateur ?" message={deleteTarget ? `Le compte « ${deleteTarget.username} » sera supprimé définitivement.` : ""} busy={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteUser} />
    </div>
  );
}
