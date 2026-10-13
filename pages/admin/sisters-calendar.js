import { useState, useEffect } from 'react';
import { HeaderAdmin } from '@/components/HeaderAdmin';
import { AdminConfirmDialog, AdminNotice } from '@/components/AdminFeedback';
import RoleGuard from '@/components/RoleGuard';
import { PERMISSIONS } from '@/constants/roles';
import { usePermissions } from '@/hooks/usePermissions';
import styles from './styles/sisters-calendar.module.css';

export default function AdminSistersCalendar() {
    const { can } = usePermissions();
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({
        title: '', title_fr: '', title_en: '',
        start: '', end: '', location: '',
        description: '', description_fr: '', description_en: '',
        organizer: '', max_participants: 50
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [expandedEventId, setExpandedEventId] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [notice, setNotice] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const authHeaders = () => ({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const res = await fetch('/api/sisters/events');
        const data = await res.json();
        setEvents(data);
    };

    const fetchParticipants = async (eventId) => {
        setLoadingParticipants(true);
        try {
            const res = await fetch(`/api/sisters/participants?eventId=${eventId}`, {
                headers: authHeaders(),
            });
            const data = await res.json();
            setParticipants(data.participants || []);
        } catch (error) {
            console.error('Erreur:', error);
            setParticipants([]);
        } finally {
            setLoadingParticipants(false);
        }
    };

    const handleToggleParticipants = (eventId) => {
        if (expandedEventId === eventId) {
            setExpandedEventId(null);
            setParticipants([]);
        } else {
            setExpandedEventId(eventId);
            fetchParticipants(eventId);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/sisters/events?id=${editingId}` : '/api/sisters/events';

        const dataToSend = {
            ...form,
            title: form.title_fr || form.title_en || 'Événement',
            start: new Date(form.start).toISOString(),
            end: form.end ? new Date(form.end).toISOString() : null
        };

        const res = await fetch(url, {
            method,
            headers: authHeaders(),
            body: JSON.stringify(dataToSend)
        });

        if (res.ok) {
            fetchEvents();
            setShowForm(false);
            setForm({
                title: '', title_fr: '', title_en: '',
                start: '', end: '', location: '',
                description: '', description_fr: '', description_en: '',
                organizer: '', max_participants: 50
            });
            setEditingId(null);
            setNotice({ type: 'success', text: editingId ? 'Événement mis à jour.' : 'Événement créé.' });
        } else {
            const error = await res.json();
            setNotice({ type: 'error', text: error.error || 'Enregistrement impossible' });
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/sisters/events?id=${deleteTarget._id}`, {
                method: 'DELETE',
                headers: authHeaders(),
            });
            if (!res.ok) throw new Error('Suppression impossible');
            await fetchEvents();
            if (expandedEventId === deleteTarget._id) {
                setExpandedEventId(null);
                setParticipants([]);
            }
            setDeleteTarget(null);
            setNotice({ type: 'success', text: 'Événement supprimé.' });
        } catch (error) {
            setNotice({ type: 'error', text: error.message });
        } finally {
            setDeleting(false);
        }
    };

    const exportToCSV = () => {
        if (!participants.length) return;

        const headers = ["Nom", "Email", "Téléphone", "Date d'inscription"];
        const rows = participants.map(p => [
            p.name,
            p.email,
            p.phone || "",
            new Date(p.registered_at).toLocaleDateString("fr-FR")
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        const event = events.find(e => e._id === expandedEventId);
        link.download = `inscriptions_${event?.title_fr || event?.title}_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
    };

    return (
        <>
            <RoleGuard allowedRoles={PERMISSIONS.CALENDAR}>
              <HeaderAdmin />
              <div className={styles.container}>
                <AdminNotice notice={notice} onClose={() => setNotice(null)} />
                <div className={styles.header}>
                    <h1>Calendrier des Sœurs</h1>
                    <button onClick={() => setShowForm(!showForm)} className={styles.addButton}>
                        {showForm ? 'Fermer' : 'Nouvel événement'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <input
                                type="text"
                                placeholder="Titre (FR)"
                                value={form.title_fr}
                                onChange={(e) => setForm({ ...form, title_fr: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Titre (EN)"
                                value={form.title_en}
                                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <input
                                type="datetime-local"
                                value={form.start}
                                onChange={(e) => setForm({ ...form, start: e.target.value })}
                                required
                            />
                            <input
                                type="datetime-local"
                                value={form.end}
                                onChange={(e) => setForm({ ...form, end: e.target.value })}
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Lieu"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                        />

                        <input
                            type="text"
                            placeholder="Responsable"
                            value={form.organizer}
                            onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                        />

                        <input
                            type="number"
                            placeholder="Nombre max de participants"
                            value={form.max_participants}
                            onChange={(e) => setForm({ ...form, max_participants: parseInt(e.target.value) })}
                        />

                        <textarea
                            placeholder="Description (FR)"
                            value={form.description_fr}
                            onChange={(e) => setForm({ ...form, description_fr: e.target.value })}
                            rows="3"
                        />

                        <textarea
                            placeholder="Description (EN)"
                            value={form.description_en}
                            onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                            rows="3"
                        />

                        <button type="submit" className={styles.submitButton}>
                            {editingId ? 'Mettre à jour' : 'Créer l\'événement'}
                        </button>
                    </form>
                )}

                <div className={styles.eventsList}>
                    {events.map(event => (
                        <div key={event._id} className={styles.eventCard}>
                            <div className={styles.eventHeader}>
                                <div>
                                    <h3>{event.title_fr || event.title}</h3>
                                    <div className={styles.eventMeta}>
                                        <span>
                                            {new Date(event.start).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span>
                                            {new Date(event.start).toLocaleTimeString('fr-FR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <span className={event.is_active ? styles.activeBadge : styles.inactiveBadge}>
                                    {event.is_active ? 'Actif' : 'Inactif'}
                                </span>
                            </div>

                            <div className={styles.eventInfo}>
                                {event.location && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Lieu</span>
                                        <span className={styles.infoValue}>{event.location}</span>
                                    </div>
                                )}
                                {event.organizer && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Responsable</span>
                                        <span className={styles.infoValue}>{event.organizer}</span>
                                    </div>
                                )}
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Inscriptions</span>
                                    <span className={styles.infoValue}>
                                        <span className={styles.participantCount}>
                                            {event.participants?.length || 0} / {event.max_participants}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <div className={styles.eventActions}>
                                <button
                                    className={styles.editButton}
                                    onClick={() => {
                                        setForm({
                                            ...event,
                                            start: event.start ? new Date(event.start).toISOString().slice(0, 16) : '',
                                            end: event.end ? new Date(event.end).toISOString().slice(0, 16) : ''
                                        });
                                        setEditingId(event._id);
                                        setShowForm(true);
                                    }}
                                >
                                    Modifier
                                </button>
                                {can('CALENDAR_DELETE') && (
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => setDeleteTarget(event)}
                                    >
                                        Supprimer
                                    </button>
                                )}
                                <button
                                    className={styles.participantsButton}
                                    onClick={() => handleToggleParticipants(event._id)}
                                >
                                    {expandedEventId === event._id ? 'Masquer' : 'Voir les inscrites'}
                                </button>
                            </div>

                            {expandedEventId === event._id && (
                                <div className={styles.participantsSection}>
                                    <div className={styles.participantsHeader}>
                                        <h4>Personnes inscrites</h4>
                                        {participants.length > 0 && (
                                            <button onClick={exportToCSV} className={styles.exportButton}>
                                                Exporter en CSV
                                            </button>
                                        )}
                                    </div>

                                    {loadingParticipants ? (
                                        <div className={styles.loaderSmall}></div>
                                    ) : participants.length === 0 ? (
                                        <div className={styles.emptyParticipants}>
                                            Aucune inscription pour cet événement.
                                        </div>
                                    ) : (
                                        <div className={styles.tableWrapper}>
                                            <table className={styles.participantsTable}>
                                                <thead>
                                                    <tr>
                                                        <th>Nom</th>
                                                        <th>Email</th>
                                                        <th>Téléphone</th>
                                                        <th>Date inscription</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {participants.map((p, index) => (
                                                        <tr key={index}>
                                                            <td>{p.name}</td>
                                                            <td>{p.email}</td>
                                                            <td>{p.phone || '-'}</td>
                                                            <td>{new Date(p.registered_at).toLocaleDateString('fr-FR')}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <AdminConfirmDialog open={Boolean(deleteTarget)} title="Supprimer cet événement ?" message={deleteTarget ? `L’événement « ${deleteTarget.title_fr || deleteTarget.title} » sera supprimé définitivement.` : ''} busy={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
              </div>
            </RoleGuard>
        </>
    );
}
