"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import styles from "./stylesheets/calendrier.module.css";

/**
 * props:
 * - events: tableau des réunions (optionnel)
 * - title: titre du calendrier
 * - subtitle: sous-titre
 */
export default function Calendrier({ events = [] }) {
  const [event, setEvent] = useState(null);

  return (
    <div className={styles.page}>
      {/* INFO BAR */}
      <div className={styles.infoBar}>
        ℹ️ Touchez ou cliquez sur une réunion pour afficher tous les détails.
      </div>

      {/* CONTENT */}
      <div className={styles.layout}>
        {/* CALENDAR */}
        <section className={styles.card}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="fr"
            height="auto"
            nowIndicator
            events={events}
            eventColor="#ffc107"
            eventTextColor="#272727"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            eventClick={(info) =>
              setEvent({
                title: info.event.title,
                start: info.event.start,
                end: info.event.end,
                ...info.event.extendedProps,
              })
            }
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
              <p>
                <strong>⏰ Fin :</strong>{" "}
                {event.end.toLocaleTimeString("fr-FR")}
              </p>

              {event.location && (
                <p>
                  <strong>📍 Lieu :</strong> {event.location}
                </p>
              )}
              {event.leader && (
                <p>
                  <strong>👩‍🦰 Responsable :</strong> {event.leader}
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
