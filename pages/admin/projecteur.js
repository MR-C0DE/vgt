import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { HeaderAdmin } from '@/components/HeaderAdmin';
import RoleGuard from '@/components/RoleGuard';
import { PERMISSIONS } from '@/constants/roles';
import { FiArrowRight, FiMonitor, FiMusic, FiPlay } from 'react-icons/fi';
import styles from './styles/projector.module.css';

export default function ProjectorLibrary(){
  const [hymns,setHymns]=useState([]); const [loading,setLoading]=useState(true);
  const load=useCallback(async()=>{try{const response=await fetch('/api/hymns',{headers:{Authorization:`Bearer ${localStorage.getItem('token')||''}`}});if(response.ok)setHymns(await response.json());}finally{setLoading(false)}},[]);
  useEffect(()=>{load()},[load]);
  return <RoleGuard allowedRoles={PERMISSIONS.RESOURCES}><Head><title>Présentations projecteur | Espace VGT</title></Head><HeaderAdmin/><main className={styles.library}><header><div><p>Présentation</p><h1>Projecteur</h1><span>Choisissez un cantique pour afficher ses paroles en plein écran.</span></div><FiMonitor/></header>{loading?<div className={styles.state}>Chargement…</div>:hymns.length===0?<div className={styles.state}><FiMusic/><h2>Aucun cantique disponible</h2><p>Ajoutez d’abord les paroles dans le répertoire.</p><Link href="/admin/louange">Ouvrir les cantiques <FiArrowRight/></Link></div>:<div className={styles.songList}>{hymns.map(hymn=><Link href={`/admin/projecteur/${hymn._id}`} key={hymn._id}><span className={styles.play}><FiPlay/></span><span><strong>{hymn.title_fr||hymn.title_en}</strong>{hymn.title_fr&&hymn.title_en&&<small>{hymn.title_en}</small>}</span><em>{hymn.lyrics_fr&&'FR'}{hymn.lyrics_fr&&hymn.lyrics_en&&' · '}{hymn.lyrics_en&&'EN'}</em><FiArrowRight/></Link>)}</div>}</main></RoleGuard>
}
