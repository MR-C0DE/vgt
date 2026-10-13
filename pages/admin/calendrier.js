"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "./styles/calendrier-admin.module.css";
import { HeaderAdmin } from "@/components/HeaderAdmin";
import { AdminConfirmDialog, AdminNotice } from "@/components/AdminFeedback";
import RoleGuard from "@/components/RoleGuard";
import { PERMISSIONS } from "@/constants/roles";
import { usePermissions } from "@/hooks/usePermissions";
import Link from "next/link";
import {
  FiCalendar, FiClock, FiMapPin, FiUser, FiUsers,
  FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiFilter,
  FiHeart, FiArrowRight
} from "react-icons/fi";

/* =======================
   CONSTANTES
======================= */
const EMPTY_EVENT = {
  _id: null,
  title: "",
  start: "",
  end: "",
  category: "réunion",
  location: "",
  leader: "",
  audience: "",
  notes: "",
  allDay: false,
};

const CATEGORIES = [
  { value: "réunion", label: "Réunion", color: "#ffc107" },
  { value: "formation", label: "Formation", color: "#17a2b8" },
  { value: "culte", label: "Culte", color: "#28a745" },
  { value: "autre", label: "Autre", color: "#6c757d" },
];

function getBrowserId() {
  if (typeof window === "undefined") return null;
  let browserId = localStorage.getItem("browserId");
  if (!browserId) {
    const randomPart = Math.random().toString(36).substring(2, 10);
    const timePart = Date.now().toString(36);
    browserId = `${timePart}-${randomPart}`;
    localStorage.setItem("browserId", browserId);
  }
  return browserId;
}

/* =======================
   COMPOSANT PRINCIPAL
======================= */
export default function CalendrierAdmin() {
  return (
    <>
      <RoleGuard allowedRoles={PERMISSIONS.CALENDAR}>
        <Head>
          <title>Calendrier Admin | Voice of God Tabernacle</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <HeaderAdmin />
        <CalendrierAdminContent />
      </RoleGuard>
    </>
  );
}

/* =======================
   CONTENU DU CALENDRIER
======================= */
function CalendrierAdminContent() {
  const router = useRouter();
  const { can } = usePermissions();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/events", {
        headers: {
          "x-browser-id": getBrowserId(),
          "Authorization": `Bearer ${token}`
        },
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      console.error("Erreur chargement événements:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editing ? "PUT" : "POST";
    const eventData = { ...form };

    // Supprimer _id du body pour la création
    if (!editing) {
      delete eventData._id;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/events", {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-browser-id": getBrowserId(),
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(eventData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        console.error("Erreur API:", responseData);
        setNotice({ type: "error", text: responseData.error || "Une erreur est survenue" });
        return;
      }

      await loadEvents();
      resetForm();
      setShowForm(false);
      setNotice({ type: "success", text: editing ? "Événement mis à jour." : "Événement créé." });
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      setNotice({ type: "error", text: "Erreur de connexion : " + err.message });
    }
  };

  const deleteEvent = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/events", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-browser-id": getBrowserId(),
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: deleteTarget._id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Erreur suppression:", errorData);
        setNotice({ type: "error", text: errorData.error || "Impossible de supprimer" });
        return;
      }

      setEvents(events.filter((e) => e._id !== deleteTarget._id));
      setDeleteTarget(null);
      setNotice({ type: "success", text: "Événement supprimé." });
    } catch (err) {
      console.error("Erreur suppression:", err);
      setNotice({ type: "error", text: "Erreur de connexion : " + err.message });
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_EVENT);
    setEditing(false);
  };

  const handleAddClick = () => {
    resetForm();
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('formSection')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  const editEvent = (event) => {
    setForm({
      ...event,
      start: event.start ? new Date(event.start).toISOString().slice(0, 16) : "",
      end: event.end ? new Date(event.end).toISOString().slice(0, 16) : "",
    });
    setEditing(true);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('formSection')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getCategoryColor = (category) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat ? cat.color : "#6c757d";
  };

  const filteredEvents = events.filter(event => {
    if (filter === "all") return true;
    return event.category === filter;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Chargement des événements...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminNotice notice={notice} onClose={() => setNotice(null)} />
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>
            <FiCalendar className={styles.headerIcon} />
            Calendrier
          </h1>
          <div className={styles.headerActions}>
            <Link href="/admin/sisters-calendar" className={styles.sistersLink}>
              <FiHeart className={styles.sistersIcon} />
              <span>Activités des sœurs</span>
              <FiArrowRight className={styles.arrowIcon} />
            </Link>
            <button className={styles.addButton} onClick={handleAddClick}>
              <FiPlus /> Nouvel événement
            </button>
          </div>
        </div>
        <p className={styles.headerSubtitle}>Gérez les événements et réunions de l'église</p>
      </div>

      <main className={styles.main}>
        {/* FORMULAIRE */}
        {showForm && (
          <div id="formSection" className={styles.formSection}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h2>
                  {editing ? (
                    <>Modifier l'événement</>
                  ) : (
                    <>Créer un nouvel événement</>
                  )}
                </h2>
                <button
                  className={styles.closeFormButton}
                  onClick={handleCancelForm}
                  title="Fermer"
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label>Titre *</label>
                  <input
                    name="title"
                    placeholder="Ex: Réunion des diacres"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Début *</label>
                    <input
                      type="datetime-local"
                      name="start"
                      value={form.start}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Fin</label>
                    <input
                      type="datetime-local"
                      name="end"
                      value={form.end}
                      onChange={handleChange}
                      disabled={form.allDay}
                    />
                  </div>
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      name="allDay"
                      checked={form.allDay}
                      onChange={handleChange}
                    />
                    <span>Toute la journée</span>
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label>Catégorie</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    style={{ borderLeft: `4px solid ${getCategoryColor(form.category)}` }}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Lieu</label>
                    <input
                      name="location"
                      placeholder="Salle principale, en ligne..."
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Responsable</label>
                    <input
                      name="leader"
                      placeholder="Pasteur Jean"
                      value={form.leader}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Public concerné</label>
                  <input
                    name="audience"
                    placeholder="Tous, Diacres, Jeunes..."
                    value={form.audience}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    placeholder="Informations supplémentaires..."
                    value={form.notes}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitButton}>
                    {editing ? <><FiSave /> Mettre à jour</> : <><FiPlus /> Créer</>}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className={styles.cancelButton}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FILTRES */}
        <div className={styles.filters}>
          <div className={styles.filtersHeader}>
            <h3>
              <FiFilter /> Filtrer par catégorie
            </h3>
            <span className={styles.eventsCount}>
              {filteredEvents.length} événement(s)
            </span>
          </div>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterButton} ${filter === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setFilter('all')}
            >
              Tous
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                className={`${styles.filterButton} ${filter === cat.value ? styles.activeFilter : ''}`}
                onClick={() => setFilter(cat.value)}
                style={{ '--filter-color': cat.color }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* LISTE DES ÉVÉNEMENTS */}
        <section className={styles.listSection}>
          <div className={styles.sectionHeader}>
            <h2>
              <FiCalendar />
              Tous les événements
            </h2>
          </div>

          {filteredEvents.length > 0 ? (
            <div className={styles.eventsList}>
              {filteredEvents.map((event) => (
                <div key={event._id} className={styles.eventCard}>
                  <div className={styles.eventHeader}>
                    <h3>{event.title}</h3>
                    <span
                      className={styles.eventCategory}
                      style={{ backgroundColor: getCategoryColor(event.category) }}
                    >
                      {event.category}
                    </span>
                  </div>

                  <div className={styles.eventDetails}>
                    <div className={styles.eventDetail}>
                      <FiClock />
                      <span>
                        {formatDate(event.start)}
                        {event.end && ` - ${new Date(event.end).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`}
                      </span>
                    </div>

                    {event.location && (
                      <div className={styles.eventDetail}>
                        <FiMapPin />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {event.leader && (
                      <div className={styles.eventDetail}>
                        <FiUser />
                        <span>{event.leader}</span>
                      </div>
                    )}

                    {event.audience && (
                      <div className={styles.eventDetail}>
                        <FiUsers />
                        <span>{event.audience}</span>
                      </div>
                    )}

                    {event.notes && (
                      <div className={styles.eventNotes}>
                        <strong>Notes :</strong>
                        <p>{event.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className={styles.eventActions}>
                    <button
                      onClick={() => editEvent(event)}
                      className={styles.editButton}
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </button>
                      {can("CALENDAR_DELETE") && (
                        <button
                          onClick={() => setDeleteTarget(event)}
                          className={styles.deleteButton}
                          title="Supprimer"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FiCalendar size={48} />
              <p>Aucun événement trouvé</p>
              <button
                onClick={handleAddClick}
                className={styles.emptyStateButton}
              >
                <FiPlus /> Créer un événement
              </button>
            </div>
          )}
        </section>
      </main>
      <AdminConfirmDialog open={Boolean(deleteTarget)} title="Supprimer cet événement ?" message={deleteTarget ? `L’événement « ${deleteTarget.title} » sera supprimé définitivement.` : ""} busy={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={deleteEvent} />
    </div>
  );
}
