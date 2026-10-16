import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { PERMISSIONS } from '@/constants/roles';
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiMaximize, FiMinimize, FiX } from 'react-icons/fi';
import styles from '../styles/projector.module.css';

const makeSlides = text => {
  const normalized=(text||'').replace(/\r/g,'').trim(); if(!normalized)return [];
  const paragraphs=normalized.split(/\n\s*\n/).map(part=>part.trim()).filter(Boolean);
  if(paragraphs.length>1)return paragraphs;
  const lines=normalized.split('\n').map(line=>line.trim()).filter(Boolean); const slides=[];
  for(let index=0;index<lines.length;index+=4)slides.push(lines.slice(index,index+4).join('\n'));
  return slides;
};

export default function Projector(){
  const router=useRouter(); const stageRef=useRef(null); const [hymn,setHymn]=useState(null); const [loading,setLoading]=useState(true); const [language,setLanguage]=useState('fr'); const [slide,setSlide]=useState(0); const [fullscreen,setFullscreen]=useState(false);
  useEffect(()=>{if(!router.query.id)return; fetch(`/api/hymns?id=${router.query.id}`,{headers:{Authorization:`Bearer ${localStorage.getItem('token')||''}`}}).then(async response=>{if(!response.ok)throw new Error();const data=await response.json();setHymn(data);setLanguage(data.lyrics_fr?'fr':'en')}).catch(()=>router.replace('/admin/projecteur')).finally(()=>setLoading(false))},[router]);
  const slides=useMemo(()=>makeSlides(language==='fr'?hymn?.lyrics_fr:hymn?.lyrics_en),[hymn,language]);
  useEffect(()=>setSlide(0),[language]);
  useEffect(()=>{const keys=event=>{if(event.key==='ArrowRight'||event.key===' ')setSlide(current=>Math.min(current+1,slides.length-1));if(event.key==='ArrowLeft')setSlide(current=>Math.max(current-1,0));if(event.key==='Escape'&&document.fullscreenElement)document.exitFullscreen()};document.addEventListener('keydown',keys);const change=()=>setFullscreen(Boolean(document.fullscreenElement));document.addEventListener('fullscreenchange',change);return()=>{document.removeEventListener('keydown',keys);document.removeEventListener('fullscreenchange',change)}},[slides.length]);
  const toggleFullscreen=()=>document.fullscreenElement?document.exitFullscreen():stageRef.current?.requestFullscreen();
  if(loading)return <div className={styles.projectorLoading}>Préparation de la présentation…</div>;
  return <RoleGuard allowedRoles={PERMISSIONS.RESOURCES}><Head><title>{hymn?.title_fr||hymn?.title_en||'Projecteur'} | VGT</title></Head><div className={styles.projectorShell}><div className={styles.projectorBar}><Link href="/admin/projecteur"><FiArrowLeft/> Retour</Link><div className={styles.projectorTitle}><strong>{language==='fr'?(hymn?.title_fr||hymn?.title_en):(hymn?.title_en||hymn?.title_fr)}</strong><span>{slide+1} / {slides.length||1}</span></div><div className={styles.projectorTools}>{hymn?.lyrics_fr&&<button className={language==='fr'?styles.selected:''} onClick={()=>setLanguage('fr')}>FR</button>}{hymn?.lyrics_en&&<button className={language==='en'?styles.selected:''} onClick={()=>setLanguage('en')}>EN</button>}<button onClick={toggleFullscreen} aria-label="Plein écran">{fullscreen?<FiMinimize/>:<FiMaximize/>}</button></div></div><section className={styles.stage} ref={stageRef}><div className={styles.stageBrand}>VOICE OF GOD TABERNACLE</div><div className={styles.slideText}>{slides[slide]?.split('\n').map((line,index)=><span key={`${line}-${index}`}>{line}</span>)||<span>Aucune parole dans cette langue</span>}</div><div className={styles.stageFooter}>{language==='fr'?(hymn?.title_fr||hymn?.title_en):(hymn?.title_en||hymn?.title_fr)}</div><button className={styles.previous} onClick={()=>setSlide(current=>Math.max(current-1,0))} disabled={slide===0} aria-label="Slide précédente"><FiChevronLeft/></button><button className={styles.next} onClick={()=>setSlide(current=>Math.min(current+1,slides.length-1))} disabled={slide>=slides.length-1} aria-label="Slide suivante"><FiChevronRight/></button>{fullscreen&&<button className={styles.exit} onClick={toggleFullscreen} aria-label="Quitter le plein écran"><FiX/></button>}</section><p className={styles.keyboardHelp}>Utilisez les flèches du clavier ou la barre d’espace pour avancer.</p></div></RoleGuard>
}
