import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { FiEdit2, FiEye, FiEyeOff, FiImage, FiPlus, FiRefreshCw, FiTrash2, FiX } from 'react-icons/fi';
import { HeaderAdmin } from '@/components/HeaderAdmin';
import { AdminConfirmDialog, AdminNotice } from '@/components/AdminFeedback';
import RoleGuard from '@/components/RoleGuard';
import { PERMISSIONS } from '@/constants/roles';
import { usePermissions } from '@/hooks/usePermissions';
import styles from './styles/gallery-admin.module.css';

const EMPTY_ALBUM = {
  name: '',
  name_fr: '',
  name_en: '',
  description: '',
  event_date: '',
  cover_image: '',
  photoUrls: '',
  existingPhotos: [],
  is_public: true,
};

export default function AdminGallery() {
  return (
    <RoleGuard allowedRoles={PERMISSIONS.GALLERY}>
      <Head><title>Galerie - Administration | VGT</title></Head>
      <HeaderAdmin />
      <GalleryContent />
    </RoleGuard>
  );
}

function GalleryContent() {
  const { can } = usePermissions();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_ALBUM);
  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  }), []);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/albums?admin=true', { headers: authHeaders() });
      if (!response.ok) throw new Error('Impossible de charger les albums');
      setAlbums(await response.json());
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_ALBUM);
    setFormOpen(true);
    setNotice(null);
  };

  const openEdit = (album) => {
    setEditingId(album._id);
    setForm({
      name: album.name || '',
      name_fr: album.name_fr || '',
      name_en: album.name_en || '',
      description: album.description || '',
      event_date: album.event_date ? album.event_date.slice(0, 10) : '',
      cover_image: album.cover_image || '',
      photoUrls: (album.photos || []).map(photo => photo.url).join('\n'),
      existingPhotos: album.photos || [],
      is_public: album.is_public !== false,
    });
    setFormOpen(true);
    setNotice(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    const photos = form.photoUrls
      .split('\n')
      .map(url => url.trim())
      .filter(Boolean)
      .map(url => form.existingPhotos.find(photo => photo.url === url) || { url });
    const { photoUrls, existingPhotos, ...albumFields } = form;
    const payload = { ...albumFields, photos, event_date: form.event_date || null };

    try {
      const response = await fetch(editingId ? `/api/albums?id=${editingId}` : '/api/albums', {
        method: editingId ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Enregistrement impossible');
      setFormOpen(false);
      setNotice({ type: 'success', text: editingId ? 'Album mis à jour.' : 'Album créé.' });
      await fetchAlbums();
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/albums?id=${deleteTarget._id}`, { method: 'DELETE', headers: authHeaders() });
      if (!response.ok) throw new Error('Suppression impossible');
      setNotice({ type: 'success', text: 'Album supprimé.' });
      setDeleteTarget(null);
      await fetchAlbums();
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.pageHeader}>
        <div><p className={styles.eyebrow}>Contenu du site</p><h1>Galerie</h1><p>Gérez les albums et les photos visibles sur le site.</p></div>
        <div className={styles.actions}>
          <button className={styles.secondaryButton} onClick={fetchAlbums}><FiRefreshCw /> Actualiser</button>
          <button className={styles.primaryButton} onClick={openCreate}><FiPlus /> Nouvel album</button>
        </div>
      </div>

      <AdminNotice notice={notice} onClose={() => setNotice(null)} />

      {formOpen && (
        <section className={styles.formCard}>
          <div className={styles.formHeader}><div><h2>{editingId ? 'Modifier l’album' : 'Créer un album'}</h2><p>Une adresse d’image par ligne pour ajouter plusieurs photos.</p></div><button onClick={() => setFormOpen(false)} className={styles.iconButton} aria-label="Fermer"><FiX /></button></div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <label>Nom principal<input name="name" value={form.name} onChange={handleChange} required /></label>
              <label>Date de l’événement<input type="date" name="event_date" value={form.event_date} onChange={handleChange} /></label>
              <label>Nom français<input name="name_fr" value={form.name_fr} onChange={handleChange} /></label>
              <label>Nom anglais<input name="name_en" value={form.name_en} onChange={handleChange} /></label>
              <label className={styles.fullWidth}>Image de couverture<input type="url" name="cover_image" value={form.cover_image} onChange={handleChange} placeholder="https://…" /></label>
              <label className={styles.fullWidth}>Description<textarea name="description" value={form.description} onChange={handleChange} rows="3" /></label>
              <label className={styles.fullWidth}>Adresses des photos<textarea name="photoUrls" value={form.photoUrls} onChange={handleChange} rows="6" placeholder={'https://…/photo-1.jpg\nhttps://…/photo-2.jpg'} /></label>
            </div>
            <label className={styles.checkbox}><input type="checkbox" name="is_public" checked={form.is_public} onChange={handleChange} /> Publier cet album sur le site</label>
            <div className={styles.formActions}><button type="button" className={styles.secondaryButton} onClick={() => setFormOpen(false)}>Annuler</button><button type="submit" className={styles.primaryButton} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button></div>
          </form>
        </section>
      )}

      {loading ? <div className={styles.state}>Chargement des albums…</div> : albums.length === 0 ? (
        <div className={styles.state}><FiImage size={36} /><h2>Aucun album</h2><p>Créez le premier album de la galerie.</p></div>
      ) : (
        <div className={styles.albumGrid}>{albums.map(album => (
          <article className={styles.albumCard} key={album._id}>
            <div className={styles.cover}>{album.cover_image ? <img src={album.cover_image} alt="" /> : <FiImage size={38} />}</div>
            <div className={styles.albumBody}>
              <div className={styles.albumTitle}><h2>{album.name}</h2><span className={album.is_public ? styles.publicBadge : styles.privateBadge}>{album.is_public ? <><FiEye /> Publié</> : <><FiEyeOff /> Privé</>}</span></div>
              <p>{album.photos?.length || 0} photo{album.photos?.length === 1 ? '' : 's'}</p>
              <div className={styles.cardActions}><button onClick={() => openEdit(album)}><FiEdit2 /> Modifier</button>{can('GALLERY_DELETE') && <button className={styles.deleteButton} onClick={() => setDeleteTarget(album)}><FiTrash2 /> Supprimer</button>}</div>
            </div>
          </article>
        ))}</div>
      )}
      <AdminConfirmDialog open={Boolean(deleteTarget)} title="Supprimer cet album ?" message={deleteTarget ? `L’album « ${deleteTarget.name} » sera supprimé définitivement.` : ''} busy={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </main>
  );
}
