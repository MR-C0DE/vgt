import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';
import { PERMISSIONS } from '@/constants/roles';
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiEyeOff, FiMaximize, FiX } from 'react-icons/fi';
import styles from '../styles/projector.module.css';

const makeSlides = text => {
  const normalized = (text || '').replace(/\r/g, '').trim();
  if (!normalized) return [];
  const paragraphs = normalized.split(/\n\s*\n/).map(part => part.trim()).filter(Boolean);
  if (paragraphs.length > 1) return paragraphs;
  const lines = normalized.split('\n').map(line => line.trim()).filter(Boolean);
  const slides = [];
  for (let index = 0; index < lines.length; index += 4) slides.push(lines.slice(index, index + 4).join('\n'));
  return slides;
};

export default function Projector() {
  const router = useRouter();
  const stageRef = useRef(null);
  const activeThumbnailRef = useRef(null);
  const [hymn, setHymn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('fr');
  const [slide, setSlide] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [blackout, setBlackout] = useState(false);

  useEffect(() => {
    if (!router.query.id) return;
    fetch(`/api/hymns?id=${router.query.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } })
      .then(async response => {
        if (!response.ok) throw new Error();
        const data = await response.json();
        setHymn(data);
        setLanguage(data.lyrics_fr ? 'fr' : 'en');
      })
      .catch(() => router.replace('/admin/projecteur'))
      .finally(() => setLoading(false));
  }, [router]);

  const slides = useMemo(() => makeSlides(language === 'fr' ? hymn?.lyrics_fr : hymn?.lyrics_en), [hymn, language]);
  const title = language === 'fr' ? (hymn?.title_fr || hymn?.title_en) : (hymn?.title_en || hymn?.title_fr);
  const previous = useCallback(() => setSlide(current => Math.max(current - 1, 0)), []);
  const next = useCallback(() => setSlide(current => Math.min(current + 1, Math.max(slides.length - 1, 0))), [slides.length]);

  useEffect(() => { setSlide(0); setBlackout(false); }, [language]);
  useEffect(() => { activeThumbnailRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [slide]);
  useEffect(() => {
    const keys = event => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); next(); }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); previous(); }
      if (event.key === 'Home') setSlide(0);
      if (event.key === 'End') setSlide(Math.max(slides.length - 1, 0));
      if (event.key.toLowerCase() === 'b') setBlackout(current => !current);
      if (event.key === 'Escape' && document.fullscreenElement) document.exitFullscreen();
    };
    const change = () => { setFullscreen(Boolean(document.fullscreenElement)); if (!document.fullscreenElement) setBlackout(false); };
    document.addEventListener('keydown', keys);
    document.addEventListener('fullscreenchange', change);
    return () => { document.removeEventListener('keydown', keys); document.removeEventListener('fullscreenchange', change); };
  }, [next, previous, slides.length]);

  const toggleFullscreen = () => document.fullscreenElement ? document.exitFullscreen() : stageRef.current?.requestFullscreen();

  if (loading) return <div className={styles.projectorLoading}>Préparation de la présentation…</div>;

  return <RoleGuard allowedRoles={PERMISSIONS.RESOURCES}>
    <Head><title>{title || 'Projecteur'} | VGT</title></Head>
    <main className={styles.presenterShell}>
      <header className={styles.presenterHeader}>
        <Link href="/admin/projecteur"><FiArrowLeft /> Cantiques</Link>
        <div><strong>{title}</strong><span>Mode présentateur</span></div>
        <div className={styles.projectorTools}>
          {hymn?.lyrics_fr && <button className={language === 'fr' ? styles.selected : ''} onClick={() => setLanguage('fr')}>FR</button>}
          {hymn?.lyrics_en && <button className={language === 'en' ? styles.selected : ''} onClick={() => setLanguage('en')}>EN</button>}
          <button onClick={toggleFullscreen}><FiMaximize /> <span>Présenter</span></button>
        </div>
      </header>

      <div className={styles.presenterWorkspace}>
        <aside className={styles.slideRail} aria-label="Diapositives">
          <div className={styles.railHeader}><strong>Diapositives</strong><span>{slides.length}</span></div>
          <div className={styles.thumbnails}>{slides.map((content, index) => <button ref={index === slide ? activeThumbnailRef : null} className={index === slide ? styles.activeThumbnail : ''} onClick={() => setSlide(index)} key={`${content}-${index}`}><span>{index + 1}</span><div>{content.split('\n').map((line, lineIndex) => <small key={`${line}-${lineIndex}`}>{line}</small>)}</div></button>)}</div>
        </aside>

        <section className={styles.presenterCanvas}>
          <div className={`${styles.stage} ${blackout ? styles.blackout : ''}`} ref={stageRef}>
            <div className={styles.stageBrand}>VOICE OF GOD TABERNACLE</div>
            <div className={styles.slideText}>{slides[slide]?.split('\n').map((line, index) => <span key={`${line}-${index}`}>{line}</span>) || <span>Aucune parole dans cette langue</span>}</div>
            <div className={styles.stageFooter}>{title}</div>
            <button className={styles.previous} onClick={previous} disabled={slide === 0} aria-label="Diapositive précédente"><FiChevronLeft /></button>
            <button className={styles.next} onClick={next} disabled={slide >= slides.length - 1} aria-label="Diapositive suivante"><FiChevronRight /></button>
            {fullscreen && <button className={styles.exit} onClick={toggleFullscreen} aria-label="Quitter le plein écran"><FiX /></button>}
          </div>

          <footer className={styles.presenterControls}>
            <div className={styles.transport}>
              <button onClick={() => setSlide(0)} disabled={slide === 0} aria-label="Première diapositive"><FiChevronsLeft /></button>
              <button onClick={previous} disabled={slide === 0} aria-label="Diapositive précédente"><FiChevronLeft /></button>
              <strong>{slide + 1} <span>/ {slides.length || 1}</span></strong>
              <button onClick={next} disabled={slide >= slides.length - 1} aria-label="Diapositive suivante"><FiChevronRight /></button>
              <button onClick={() => setSlide(Math.max(slides.length - 1, 0))} disabled={slide >= slides.length - 1} aria-label="Dernière diapositive"><FiChevronsRight /></button>
            </div>
            <div className={styles.controlActions}>
              <button className={blackout ? styles.controlActive : ''} onClick={() => setBlackout(current => !current)} title="Raccourci B"><FiEyeOff /> Écran noir</button>
              <button onClick={toggleFullscreen}><FiMaximize /> Plein écran</button>
            </div>
          </footer>
          <p className={styles.presenterHelp}>← → naviguer · Espace avancer · Début/Fin · B écran noir · Échap quitter</p>
        </section>
      </div>
    </main>
  </RoleGuard>;
}
