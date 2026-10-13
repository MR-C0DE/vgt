import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/contexts/LanguageContext";
import { useState, useEffect } from "react";
import UsefulLinks from "@/components/UsefulLinks";
import styles from "./calendar.module.css";

export default function SistersCalendar() {
    const { t } = useTranslation();
    const { language } = useLanguage();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [formStatus, setFormStatus] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/sisters/events?active=true");
            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    const getText = (event, field) => {
        if (language === "fr" && event[`${field}_fr`]) return event[`${field}_fr`];
        if (language === "en" && event[`${field}_en`]) return event[`${field}_en`];
        return event[field];
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setFormStatus("loading");

        try {
            const res = await fetch("/api/sisters/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId: selectedEvent._id,
                    ...formData,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setFormStatus("success");
                setTimeout(() => {
                    setShowModal(false);
                    setFormStatus(null);
                    setFormData({ name: "", email: "", phone: "" });
                }, 2000);
            } else {
                setFormStatus(data.error);
            }
        } catch (error) {
            setFormStatus("Erreur réseau");
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-CA", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString(language === "fr" ? "fr-FR" : "en-CA", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <Head>
                <title>{t("sisters_calendar_title") || "Calendrier des Sœurs | Voice of God Tabernacle"}</title>
                <meta
                    name="description"
                    content={t("sisters_calendar_description") || "Calendrier des rencontres et événements réservés aux sœurs"}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <meta property="og:title" content="Calendrier des Sœurs | Voice of God Tabernacle" />
                <meta property="og:description" content="Rencontres, études bibliques et moments de partage entre sœurs" />
                <meta property="og:image" content="/images/cover.jpg" />
                <meta property="og:url" content="https://voiceofgodtabernacle.com/sisters/calendar" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://voiceofgodtabernacle.com/sisters/calendar" />
            </Head>

            <Header />

            <main>
                {/* Banner - similaire aux autres pages */}
                <div className={styles.banner}>
                    <div className={styles.bannerContent}>
                        <h2>{t("sisters_calendar_banner") || "Calendrier des Sœurs"}</h2>
                        <p>{t("sisters_calendar_banner_desc") || "Rencontres, études bibliques et moments de partage"}</p>
                    </div>
                </div>

                <div className={styles.container}>
                    {loading ? (
                        <div className={styles.loaderContainer}>
                            <div className={styles.loader}></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>{t("sisters_no_events") || "Aucun événement programmé pour le moment."}</p>
                        </div>
                    ) : (
                        <div className={styles.eventsGrid}>
                            {events.map((event) => (
                                <div key={event._id} className={styles.eventCard}>
                                    <div className={styles.eventDate}>
                                        <span className={styles.eventDay}>
                                            {new Date(event.start).getDate()}
                                        </span>
                                        <span className={styles.eventMonth}>
                                            {new Date(event.start).toLocaleString(
                                                language === "fr" ? "fr-FR" : "en-CA",
                                                { month: "short" }
                                            )}
                                        </span>
                                    </div>

                                    <div className={styles.eventContent}>
                                        <h3>{getText(event, "title")}</h3>

                                        <div className={styles.eventDetails}>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailIcon}>📅</span>
                                                <span>{formatDate(event.start)}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailIcon}>⏰</span>
                                                <span>{formatTime(event.start)}</span>
                                                {event.end && ` - ${formatTime(event.end)}`}
                                            </div>
                                            {event.location && (
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailIcon}>📍</span>
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
                                            {event.organizer && (
                                                <div className={styles.detailItem}>
                                                    <span className={styles.detailIcon}>👤</span>
                                                    <span>{t("sisters_organizer") || "Responsable"} : {event.organizer}</span>
                                                </div>
                                            )}
                                        </div>

                                        {getText(event, "description") && (
                                            <p className={styles.eventDescription}>
                                                {getText(event, "description")}
                                            </p>
                                        )}

                                        <div className={styles.eventFooter}>
                                            <div className={styles.spotsLeft}>
                                                {event.max_participants - (event.participants?.length || 0)} {t("sisters_spots_left") || "places disponibles"}
                                            </div>
                                            <button
                                                className={styles.registerButton}
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setShowModal(true);
                                                }}
                                            >
                                                {t("sisters_register") || "S'inscrire"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <UsefulLinks />
            </main>

            {/* Modal d'inscription */}
            {showModal && selectedEvent && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setShowModal(false)}>
                            ×
                        </button>

                        <h2>{getText(selectedEvent, "title")}</h2>

                        <div className={styles.modalInfo}>
                            <p><strong>{t("sisters_date") || "Date"} :</strong> {formatDate(selectedEvent.start)}</p>
                            <p><strong>{t("sisters_time") || "Horaire"} :</strong> {formatTime(selectedEvent.start)}</p>
                            {selectedEvent.location && (
                                <p><strong>{t("sisters_location") || "Lieu"} :</strong> {selectedEvent.location}</p>
                            )}
                        </div>

                        <form onSubmit={handleRegister} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label>{t("sisters_name") || "Nom complet"} *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>{t("sisters_email") || "Email"} *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>{t("sisters_phone") || "Téléphone"}</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            {formStatus === "loading" && (
                                <div className={styles.formLoading}>{t("sisters_loading") || "Inscription en cours..."}</div>
                            )}

                            {formStatus === "success" && (
                                <div className={styles.formSuccess}>{t("sisters_success") || "Inscription réussie ! À bientôt."}</div>
                            )}

                            {formStatus && formStatus !== "loading" && formStatus !== "success" && (
                                <div className={styles.formError}>{formStatus}</div>
                            )}

                            <button type="submit" className={styles.submitButton}>
                                {t("sisters_confirm") || "Confirmer mon inscription"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}