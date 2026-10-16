import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { HeaderAdmin } from '@/components/HeaderAdmin';
import { AdminConfirmDialog, AdminNotice } from '@/components/AdminFeedback';
import RoleGuard from '@/components/RoleGuard';
import { PERMISSIONS } from '@/constants/roles';
import { usePermissions } from '@/hooks/usePermissions';
import { FiBookOpen, FiEdit2, FiExternalLink, FiFileText, FiPlus, FiSearch, FiTrash2, FiUploadCloud, FiX } from 'react-icons/fi';
import styles from './styles/training.module.css';

const CATEGORIES = ['Toutes', 'Formation', 'Guide', 'Procédure', 'Référence', 'Autre'];
const EMPTY = { title: '', category: 'Formation', description: '', document_url: '', storage_key: '', original_filename: '' };

export default function FormationsPage() {
  return <RoleGuard allowedRoles={PERMISSIONS.RESOURCES}><Head><title>Documents & formations | Espace VGT</title></Head><HeaderAdmin /><TrainingWorkspace /></RoleGuard>;
}

function TrainingWorkspace() {
  const { can } = usePermissions();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Toutes');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const headers = useCallback(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` }), []);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/training-documents', { headers: headers() });
      if (!response.ok) throw new Error('Impossible de charger les documents.');
      setDocuments(await response.json());
    } catch (error) { setNotice({ type: 'error', text: error.message }); }
    finally { setLoading(false); }
  }, [headers]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('fr');
    return documents.filter(item => {
      const matchesCategory = category === 'Toutes' || item.category === category;
      const matchesSearch = !term || `${item.title} ${item.description} ${item.category}`.toLocaleLowerCase('fr').includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [category, documents, search]);

  const openCreate = () => { setEditingId(null); setForm(EMPTY); setFile(null); setFormOpen(true); setNotice(null); };
  const openEdit = item => { setEditingId(item._id); setForm({ title:item.title || '', category:item.category || 'Formation', description:item.description || '', document_url:item.storage_key ? '' : item.document_url || '', storage_key:item.storage_key || '', original_filename:item.original_filename || '' }); setFile(null); setFormOpen(true); setNotice(null); };
  const closeForm = () => { setFormOpen(false); setEditingId(null); setForm(EMPTY); setFile(null); };
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async event => {
    event.preventDefault(); setSaving(true); setNotice(null);
    try {
      if (!file && !form.document_url && !form.storage_key) throw new Error('Choisissez un fichier ou ajoutez un lien.');
      let payload = form.document_url ? { ...form, storage_key: '', original_filename: '' } : { ...form };
      if (file) {
        const signingResponse = await fetch('/api/uploads/training-document', { method: 'POST', headers: headers(), body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }) });
        const signing = await signingResponse.json();
        if (!signingResponse.ok) throw new Error(signing.error || 'Préparation du téléversement impossible.');
        const uploadResponse = await fetch(signing.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
        if (!uploadResponse.ok) throw new Error('Le téléversement du fichier a échoué.');
        payload = { ...payload, document_url: '', storage_key: signing.key, original_filename: file.name };
      }
      const response = await fetch(editingId ? `/api/training-documents?id=${editingId}` : '/api/training-documents', { method: editingId ? 'PUT' : 'POST', headers: headers(), body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Enregistrement impossible.');
      closeForm(); setNotice({ type: 'success', text: editingId ? 'Document mis à jour.' : 'Document ajouté.' }); await load();
    } catch (error) { setNotice({ type: 'error', text: error.message }); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/training-documents?id=${deleteTarget._id}`, { method: 'DELETE', headers: headers() });
      if (!response.ok) throw new Error('Suppression impossible.');
      setDeleteTarget(null); setNotice({ type: 'success', text: 'Document supprimé.' }); await load();
    } catch (error) { setNotice({ type: 'error', text: error.message }); }
    finally { setDeleting(false); }
  };

  return <main className={styles.container}>
    <header className={styles.hero}><div><p>Transmission</p><h1>Documents & formations</h1><span>Une bibliothèque claire pour retrouver les guides, formations et références de l’équipe.</span></div>{can('TRAINING_EDIT') && <button onClick={openCreate}><FiPlus /> Ajouter un document</button>}</header>
    <AdminNotice notice={notice} onClose={() => setNotice(null)} />
    <section className={styles.toolbar}><label><FiSearch /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Rechercher un document…" /></label><select value={category} onChange={event => setCategory(event.target.value)} aria-label="Filtrer par catégorie">{CATEGORIES.map(item => <option key={item}>{item}</option>)}</select><span>{filtered.length} document{filtered.length === 1 ? '' : 's'}</span></section>

    {formOpen && <section className={styles.formCard}><div className={styles.formHeader}><div><p>{editingId ? 'Modification' : 'Nouvelle ressource'}</p><h2>{editingId ? 'Modifier le document' : 'Ajouter un document'}</h2></div><button onClick={closeForm} aria-label="Fermer"><FiX /></button></div><form onSubmit={submit}><div className={styles.formGrid}><label>Titre<input name="title" value={form.title} onChange={update} maxLength="200" required /></label><label>Catégorie<select name="category" value={form.category} onChange={update}>{CATEGORIES.slice(1).map(item => <option key={item}>{item}</option>)}</select></label></div><label>Description<textarea name="description" value={form.description} onChange={update} rows="4" maxLength="1000" placeholder="Présentez brièvement le contenu et son utilité." /></label><label className={styles.uploadField}><span>Fichier</span><span className={styles.uploadBox}><FiUploadCloud /><strong>{file?.name || form.original_filename || 'Choisir un document'}</strong><small>PDF, Word, PowerPoint, Excel ou texte · 25 Mo maximum</small><input type="file" onChange={event => setFile(event.target.files?.[0] || null)} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" /></span></label><div className={styles.divider}><span>ou utiliser un lien</span></div><label>Lien externe<input name="document_url" type="url" value={form.document_url} onChange={update} placeholder="https://…" /></label><div className={styles.formActions}><button type="button" onClick={closeForm}>Annuler</button><button type="submit" disabled={saving}>{saving ? 'Téléversement…' : 'Enregistrer'}</button></div></form></section>}

    {loading ? <div className={styles.empty}>Chargement des documents…</div> : filtered.length === 0 ? <div className={styles.empty}><FiBookOpen /><h2>{search || category !== 'Toutes' ? 'Aucun résultat' : 'La bibliothèque est vide'}</h2><p>{search || category !== 'Toutes' ? 'Modifiez votre recherche ou le filtre.' : 'Ajoutez la première ressource de formation de l’équipe.'}</p>{!search && category === 'Toutes' && can('TRAINING_EDIT') && <button onClick={openCreate}><FiPlus /> Ajouter un document</button>}</div> : <div className={styles.documentGrid}>{filtered.map(item => <article className={styles.documentCard} key={item._id}><div className={styles.cardIcon}><FiFileText /></div><div className={styles.cardBody}><span className={styles.category}>{item.category}</span><h2>{item.title}</h2>{item.description && <p>{item.description}</p>}{item.original_filename && <small className={styles.filename}>{item.original_filename}</small>}<small>Mis à jour le {new Intl.DateTimeFormat('fr-CA', { dateStyle: 'medium' }).format(new Date(item.updated_at))}</small></div><div className={styles.cardActions}>{item.document_url ? <a href={item.document_url} target="_blank" rel="noreferrer"><FiExternalLink /> Consulter</a> : <span className={styles.unavailable}>Stockage indisponible</span>}{can('TRAINING_EDIT') && <button onClick={() => openEdit(item)}><FiEdit2 /> Modifier</button>}{can('TRAINING_DELETE') && <button className={styles.delete} onClick={() => setDeleteTarget(item)} aria-label={`Supprimer ${item.title}`}><FiTrash2 /></button>}</div></article>)}</div>}
    <AdminConfirmDialog open={Boolean(deleteTarget)} title="Supprimer ce document ?" message={`« ${deleteTarget?.title || ''} » sera retiré de la bibliothèque. Le fichier externe ne sera pas supprimé.`} busy={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={remove} />
  </main>;
}
