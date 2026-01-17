"use client";

import { useState, useEffect } from "react";
import styles from "./styles/calendrier-admin-modern.module.css";

/* =======================
   CONFIG MOT DE PASSE
======================= */
const ADMIN_PASSWORD = "admin123"; // 🔐 CHANGE CE MOT DE PASSE

/* =======================
   CONSTANTES
======================= */
const EMPTY_EVENT = {
  id: null,
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
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const checkPassword = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);
      sessionStorage.setItem("calendar-auth", "true");
    } else {
      alert("❌ Mot de passe incorrect");
      setPassword("");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("calendar-auth") === "true") {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            width: "350px",
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#333" }}>🔒 Accès Administrateur</h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "30px" }}>
            Veuillez entrer le mot de passe pour continuer
          </p>
          <form onSubmit={checkPassword} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
                transition: "all 0.2s",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                border: "none",
                background: "#667eea",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#5563c1")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#667eea")}
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <CalendrierAdminContent />;
}


/* =======================
   CONTENU DU CALENDRIER
======================= */
function CalendrierAdminContent() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const res = await fetch("/api/events", {
        headers: { "x-browser-id": getBrowserId() },
      });
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      console.error("Erreur chargement événements:", err);
      setEvents([]);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editing ? "PUT" : "POST";

    try {
      await fetch("/api/events", {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-browser-id": getBrowserId(),
        },
        body: JSON.stringify(form),
      });

      loadEvents();
      setForm(EMPTY_EVENT);
      setEditing(false);
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
    }
  };

  const editEvent = (event) => {
    setForm({
      ...event,
      start: event.start
        ? new Date(event.start).toISOString().slice(0, 16)
        : "",
      end: event.end
        ? new Date(event.end).toISOString().slice(0, 16)
        : "",
    });
    setEditing(true);
  };

  const deleteEvent = async (id) => {
    if (!confirm("Supprimer cet événement ?")) return;

    try {
      await fetch("/api/events", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-browser-id": getBrowserId(),
        },
        body: JSON.stringify({ id }),
      });

      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>📅 Calendrier Administratif</h1>
      </header>

      <main className={styles.main}>
        {/* FORMULAIRE */}
        <div className={styles.formCard}>
          <h2>{editing ? "Modifier un événement" : "Créer un événement"}</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              name="title"
              placeholder="Titre"
              value={form.title}
              onChange={handleChange}
              required
            />

            <div className={styles.row}>
              <input
                type="datetime-local"
                name="start"
                value={form.start}
                onChange={handleChange}
                required
              />
              <input
                type="datetime-local"
                name="end"
                value={form.end}
                onChange={handleChange}
                disabled={form.allDay}
              />
            </div>

            <label className={styles.checkbox}>

                <div>
                <input
                type="checkbox"
                name="allDay"
                checked={form.allDay}
                onChange={handleChange}
              />

                </div>

              <div>Toute la journée</div>
            </label>

            <select name="category" value={form.category} onChange={handleChange}>
              <option value="réunion">Réunion</option>
              <option value="formation">Formation</option>
              <option value="culte">Culte</option>
              <option value="autre">Autre</option>
            </select>

            <input name="location" placeholder="Lieu" value={form.location} onChange={handleChange} />
            <input name="leader" placeholder="Responsable" value={form.leader} onChange={handleChange} />
            <input name="audience" placeholder="Public" value={form.audience} onChange={handleChange} />
            <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />

            <button type="submit" className={styles.submit}>
              {editing ? "💾 Mettre à jour" : "➕ Ajouter"}
            </button>
          </form>
        </div>

        {/* LISTE */}
        <section className={styles.list}>
          <h2>📋 Événements</h2>

          {events.length ? (
            events.map((event) => (
              <div key={event.id} className={styles.item}>
                <div>
                  <strong>{event.title}</strong>
                  <div>
                    {new Date(event.start).toLocaleString("fr-FR")}
                  </div>
                </div>
                <div>
                  <button onClick={() => editEvent(event)}>✏️</button>
                  <button onClick={() => deleteEvent(event.id)}>🗑️</button>
                </div>
              </div>
            ))
          ) : (
            <p>Aucun événement.</p>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        © 2026 Mon Calendrier
      </footer>
    </div>
  );
}
