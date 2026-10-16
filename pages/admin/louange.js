import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { HeaderAdmin } from '@/components/HeaderAdmin';
import { AdminConfirmDialog, AdminNotice } from '@/components/AdminFeedback';
import RoleGuard from '@/components/RoleGuard';
import { PERMISSIONS } from '@/constants/roles';
import { usePermissions } from '@/hooks/usePermissions';
import { FiEdit2, FiGlobe, FiMusic, FiPlay, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import styles from './styles/hymns.module.css';

const EMPTY = { title_fr: '', title_en: '', lyrics_fr: '', lyrics_en: '' };

export default function HymnsPage() {
  return <RoleGuard allowedRoles={PERMISSIONS.RESOURCES}><Head><title>Louange & cantiques | Espace VGT</title></Head><HeaderAdmin /><HymnsWorkspace /></RoleGuard>;
}

function HymnsWorkspace() {
  const { can } = usePermissions();
  const [hymns, setHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const headers = useCallback(() => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` }), []);
  const load = useCallback(async () => {
    setLoading(true);
    try { const response = await fetch('/api/hymns', { headers: headers() }); if (!response.ok) throw new Error('Impossible de charger les cantiques.'); setHymns(await response.json()); }
    catch (error) { setNotice({ type: 'error', text: error.message }); }
    finally { setLoading(false); }
  }, [headers]);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('fr');
    return term ? hymns.filter(item => `${item.title_fr} ${item.title_en}`.toLocaleLowerCase('fr').includes(term)) : hymns;
  }, [hymns, search]);

  const openCreate = () => { setEditingId(null); setForm(EMPTY); setFormOpen(true); setNotice(null); };
  const openEdit = hymn => { setEditingId(hymn._id); setForm({ title_fr:hymn.title_fr || '', title_en:hymn.title_en || '', lyrics_fr:hymn.lyrics_fr || '', lyrics_en:hymn.lyrics_en || '' }); setFormOpen(true); setNotice(null); };
  const closeForm = () => { setFormOpen(false); setEditingId(null); setForm(EMPTY); };
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async event => {
    event.preventDefault(); setSaving(true); setNotice(null);
    try {
      const response = await fetch(editingId ? `/api/hymns?id=${editingId}` : '/api/hymns', { method:editingId ? 'PUT' : 'POST', headers:headers(), body:JSON.stringify(form) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Enregistrement impossible.');
      closeForm(); setNotice({ type:'success', text:editingId ? 'Cantique mis à jour.' : 'Cantique ajouté.' }); await load();
    } catch (error) { setNotice({ type:'error', text:error.message }); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    if (!deleteTarget) return; setDeleting(true);
    try { const response = await fetch(`/api/hymns?id=${deleteTarget._id}`, { method:'DELETE', headers:headers() }); if (!response.ok) throw new Error('Suppression impossible.'); setDeleteTarget(null); setNotice({ type:'success', text:'Cantique supprimé.' }); await load(); }
    catch (error) { setNotice({ type:'error', text:error.message }); }
    finally { setDeleting(false); }
  };

  return <main className={styles.container}>
    <header className={styles.hero}><div><p>Ministère de la louange</p><h1>Louange & cantiques</h1><span>Conservez les titres et les paroles, puis affichez-les directement sur le projecteur.</span></div>{can('HYMNS_EDIT') && <button onClick={openCreate}><FiPlus /> Ajouter un cantique</button>}</header>
    <AdminNotice notice={notice} onClose={() => setNotice(null)} />
    <div className={styles.toolbar}><label><FiSearch /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Rechercher un cantique…" /></label><span>{filtered.length} cantique{filtered.length === 1 ? '' : 's'}</span></div>

    {formOpen && <section className={styles.formCard}><div className={styles.formHeader}><div><p>{editingId ? 'Modification' : 'Nouveau cantique'}</p><h2>{editingId ? 'Modifier le cantique' : 'Ajouter un cantique'}</h2></div><button onClick={closeForm} aria-label="Fermer"><FiX /></button></div><form onSubmit={submit}><div className={styles.languageGrid}><fieldset><legend><span>FR</span> Version française</legend><label>Titre français<input name="title_fr" value={form.title_fr} onChange={update} maxLength="200" /></label><label>Paroles françaises<textarea name="lyrics_fr" value={form.lyrics_fr} onChange={update} rows="14" /></label></fieldset><fieldset><legend><span>EN</span> English version</legend><label>Titre anglais<input name="title_en" value={form.title_en} onChange={update} maxLength="200" /></label><label>Paroles anglaises<textarea name="lyrics_en" value={form.lyrics_en} onChange={update} rows="14" /></label></fieldset></div><p className={styles.hint}>Ajoutez au moins un titre et les paroles correspondantes. Une ligne vide séparera les slides.</p><div className={styles.formActions}><button type="button" onClick={closeForm}>Annuler</button><button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button></div></form></section>}

    {loading ? <div className={styles.empty}>Chargement des cantiques…</div> : filtered.length === 0 ? <div className={styles.empty}><FiMusic /><h2>{search ? 'Aucun résultat' : 'Aucun cantique pour le moment'}</h2><p>{search ? 'Essayez un autre titre.' : 'Ajoutez le premier cantique pour commencer le répertoire.'}</p>{!search && can('HYMNS_EDIT') && <button onClick={openCreate}><FiPlus /> Ajouter un cantique</button>}</div> : <div className={styles.hymnGrid}>{filtered.map(hymn => <article className={styles.hymnCard} key={hymn._id}><div className={styles.cardTop}><div className={styles.musicIcon}><FiMusic /></div><div className={styles.titles}><h2>{hymn.title_fr || hymn.title_en}</h2>{hymn.title_fr && hymn.title_en && <p>{hymn.title_en}</p>}</div></div><div className={styles.languages}><span className={hymn.lyrics_fr ? styles.available : ''}><FiGlobe /> FR</span><span className={hymn.lyrics_en ? styles.available : ''}><FiGlobe /> EN</span></div><div className={styles.cardActions}><Link href={`/admin/projecteur/${hymn._id}`}><FiPlay /> Projeter</Link>{can('HYMNS_EDIT') && <button onClick={() => openEdit(hymn)}><FiEdit2 /> Modifier</button>}{can('HYMNS_DELETE') && <button className={styles.delete} onClick={() => setDeleteTarget(hymn)}><FiTrash2 aria-label="Supprimer" /></button>}</div></article>)}</div>}
    <AdminConfirmDialog open={Boolean(deleteTarget)} title="Supprimer ce cantique ?" message={`Le cantique « ${deleteTarget?.title_fr || deleteTarget?.title_en || ''} » sera supprimé définitivement.`} busy={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={remove} />
  </main>;
}
