import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { HeaderAdmin } from "@/components/HeaderAdmin";
import CheckLogin from "@/components/CheckLogin";
import RoleGuard from "@/components/RoleGuard";
import { PERMISSIONS } from "@/constants/roles";
import styles from "./styles/announcements.module.css";
import {
  FiBell,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiSave,
  FiCalendar,
  FiUser,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
} from "react-icons/fi";

const EMPTY_ANNOUNCEMENT = {
  id: null,
  author: "",
  title_fr: "",
  title_en: "",
  content_fr: "",
  content_en: "",
  date: new Date().toISOString().split('T')[0],
  is_active: true,
};

export default function Announcements() {
  return (
    <>
        <RoleGuard allowedRoles={PERMISSIONS.ANNOUNCEMENTS}>
      <Head>
        <title>Gestion des annonces | Voice of God Tabernacle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <HeaderAdmin />
      <AnnouncementsContent />
      </RoleGuard>
    </>
  );
}

function AnnouncementsContent() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(EMPTY_ANNOUNCEMENT);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [language, setLanguage] = useState("fr"); // Pour l'aperçu

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/controllers/announcements?admin=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      if (error.response?.status === 401) {
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnnouncements();
  };

  const handleAddClick = () => {
    setEditingAnnouncement({
      ...EMPTY_ANNOUNCEMENT,
      date: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditClick = (announcement) => {
    setEditingAnnouncement(announcement);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAnnouncement(EMPTY_ANNOUNCEMENT);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingAnnouncement({
      ...editingAnnouncement,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      
      if (isEditing) {
        await axios.put(`/api/controllers/announcements?id=${editingAnnouncement.id}`, editingAnnouncement, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/controllers/announcements", editingAnnouncement, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await fetchAnnouncements();
      handleCancelForm();
    } catch (error) {
      console.error("Error saving announcement:", error);
      alert(error.response?.data?.error || "Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'annonce "${title}" ?`)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/controllers/announcements?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  const handleToggleActive = async (id, currentState) => {
    try {
      const token = localStorage.getItem("token");
      
      // ✅ Récupérer l'annonce complète depuis le state
      const announcement = announcements.find(a => a.id === id);
      
      if (!announcement) {
        alert("Annonce non trouvée");
        return;
      }
  
      // ✅ Envoyer toutes les données avec seulement le statut modifié
      await axios.put(`/api/controllers/announcements?id=${id}`, 
        {
          author: announcement.author,
          title_fr: announcement.title_fr,
          title_en: announcement.title_en,
          content_fr: announcement.content_fr,
          content_en: announcement.content_en,
          date: announcement.date,
          is_active: !currentState
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Recharger la liste
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error toggling announcement:", error);
      alert("Erreur lors de la modification du statut");
    }
  };

  const filteredAnnouncements = announcements.filter(ann => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ann.author?.toLowerCase().includes(searchLower) ||
      ann.title_fr?.toLowerCase().includes(searchLower) ||
      ann.title_en?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Chargement des annonces...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>
            <FiBell className={styles.headerIcon} />
            Gestion des annonces
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
            <button className={styles.addButton} onClick={handleAddClick}>
              <FiPlus /> Nouvelle annonce
            </button>
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher une annonce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.stats}>
            <span>Total: {announcements.length} annonces</span>
            <span>•</span>
            <span>Actives: {announcements.filter(a => a.is_active).length}</span>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2>
                {isEditing ? "✏️ Modifier l'annonce" : "➕ Nouvelle annonce"}
              </h2>
              <button className={styles.closeButton} onClick={handleCancelForm}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Auteur *</label>
                  <input
                    type="text"
                    name="author"
                    value={editingAnnouncement.author}
                    onChange={handleInputChange}
                    required
                    placeholder="Frère Jean-Claude"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={editingAnnouncement.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Titre (Français) *</label>
                  <input
                    type="text"
                    name="title_fr"
                    value={editingAnnouncement.title_fr}
                    onChange={handleInputChange}
                    required
                    placeholder="Service en famille"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Titre (Anglais) *</label>
                  <input
                    type="text"
                    name="title_en"
                    value={editingAnnouncement.title_en}
                    onChange={handleInputChange}
                    required
                    placeholder="Family Service"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Contenu (Français) *</label>
                  <textarea
                    name="content_fr"
                    value={editingAnnouncement.content_fr}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Texte en français..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Contenu (Anglais) *</label>
                  <textarea
                    name="content_en"
                    value={editingAnnouncement.content_en}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="English text..."
                  />
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={editingAnnouncement.is_active}
                    onChange={handleInputChange}
                  />
                  <span>Annonce active (visible sur le site)</span>
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  <FiSave /> {isEditing ? "Mettre à jour" : "Créer"}
                </button>
                <button type="button" className={styles.cancelButton} onClick={handleCancelForm}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des annonces */}
      <div className={styles.announcementsGrid}>
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((ann) => (
            <div key={ann.id} className={`${styles.announcementCard} ${!ann.is_active ? styles.inactive : ''}`}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <h3>{ann.title_fr}</h3>
                  <span className={styles.cardDate}>
                    <FiCalendar /> {formatDate(ann.date)}
                  </span>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.toggleButton}
                    onClick={() => handleToggleActive(ann.id, ann.is_active)}
                    title={ann.is_active ? "Désactiver" : "Activer"}
                  >
                    {ann.is_active ? <FiEye /> : <FiEyeOff />}
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditClick(ann)}
                    title="Modifier"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(ann.id, ann.title_fr)}
                    title="Supprimer"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <div className={styles.cardAuthor}>
                <FiUser /> {ann.author}
              </div>

              <div className={styles.cardPreview}>
                <div className={styles.previewTabs}>
                  <button 
                    className={`${styles.previewTab} ${language === 'fr' ? styles.active : ''}`}
                    onClick={() => setLanguage('fr')}
                  >
                    FR
                  </button>
                  <button 
                    className={`${styles.previewTab} ${language === 'en' ? styles.active : ''}`}
                    onClick={() => setLanguage('en')}
                  >
                    EN
                  </button>
                </div>
                <div className={styles.previewContent}>
                  <p>
                    {language === 'fr' 
                      ? (ann.content_fr?.substring(0, 150) + '...')
                      : (ann.content_en?.substring(0, 150) + '...')
                    }
                  </p>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={`${styles.status} ${ann.is_active ? styles.statusActive : styles.statusInactive}`}>
                  {ann.is_active ? "Active" : "Inactive"}
                </span>
                <span className={styles.cardId}>ID: {ann.id}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <FiBell size={48} />
            <p>Aucune annonce trouvée</p>
            {searchTerm && (
              <button className={styles.clearSearch} onClick={() => setSearchTerm("")}>
                Effacer la recherche
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}