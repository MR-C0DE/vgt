"use client";

import { useState, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import styles from "./stylesheets/calendrier.module.css";

/* Utilitaire pour générer / stocker un browserId unique */
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

export default function Calendrier() {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);

  /* 🔄 Charger les événements depuis l'API */
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events", {
          headers: {
            "x-browser-id": getBrowserId(),
          },
        });
        const data = await res.json();
        // S'assurer qu'on a bien un tableau
        setEvents(Array.isArray(data) ? data : data.events || []);
      } catch (err) {
        console.error("Erreur lors du chargement des événements:", err);
        setEvents([]);
      }
    }
    loadEvents();
  }, []);

  const memoEvents = useMemo(() => events, [events]);

  return (
    <div className={styles.page}>
      {/* INFO BAR */}
      <div className={styles.infoBar}>
        ℹ️ Touchez ou cliquez sur une réunion pour afficher tous les détails.
      </div>

      <div className={styles.layout}>
        {/* CALENDAR */}
        <section className={styles.card}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="fr"
            height="auto"
            nowIndicator
            selectable
            events={memoEvents}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            eventClick={(info) => {
              info.jsEvent.preventDefault();

              info.view.calendar
                .getEvents()
                .forEach((e) => e.setProp("classNames", []));

              info.event.setProp("classNames", ["selected-event"]);

              setEvent({
                title: info.event.title,
                start: info.event.start,
                end: info.event.end,
                ...info.event.extendedProps,
              });
            }}
            eventMouseEnter={(info) => {
              info.el.title = `
${info.event.title}
${info.event.extendedProps.location || ""}
              `;
            }}
            eventDidMount={(info) => {
              const colors = {
                réunion: "#ffc107",
                formation: "#0ea5e9",
                culte: "#22c55e",
                autre: "#a855f7",
              };

              const category = info.event.extendedProps.category;
              if (colors[category]) {
                info.el.style.backgroundColor = colors[category];
                info.el.style.borderColor = colors[category];
              }
            }}
          />
        </section>

        {/* DETAILS */}
        <aside className={styles.details}>
          {!event ? (
            <div className={styles.emptyState}>
              <h3>Détails de la réunion</h3>
              <p>Sélectionnez une réunion pour voir :</p>
              <ul>
                <li>Date et horaires</li>
                <li>Lieu</li>
                <li>Responsable</li>
                <li>Instructions importantes</li>
              </ul>
            </div>
          ) : (
            <>
              <h2>{event.title}</h2>
              {event.category && (
                <span className={styles.badge}>{event.category}</span>
              )}
              <p>
                <strong>📅 Date :</strong>{" "}
                {event.start.toLocaleDateString("fr-FR")}
              </p>
              <p>
                <strong>⏰ Début :</strong>{" "}
                {event.start.toLocaleTimeString("fr-FR")}
              </p>
              {event.end && (
                <p>
                  <strong>⏰ Fin :</strong>{" "}
                  {event.end.toLocaleTimeString("fr-FR")}
                </p>
              )}
              {event.location && (
                <p>
                  <strong>📍 Lieu :</strong> {event.location}
                </p>
              )}
              {event.leader && (
                <p>
                  <strong>👤 Responsable :</strong> {event.leader}
                </p>
              )}
              {event.audience && (
                <p>
                  <strong>👥 Public :</strong> {event.audience}
                </p>
              )}
              {event.notes && (
                <div className={styles.notes}>
                  <strong>📝 Notes importantes</strong>
                  <p>{event.notes}</p>
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
