import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import { HeaderAdmin } from "@/components/HeaderAdmin";
import RoleGuard from "@/components/RoleGuard";
import { PERMISSIONS } from "@/constants/roles";
import { useRole } from "@/contexts/RoleContext";
import { usePermissions } from "@/hooks/usePermissions";
import styles from "./styles/Dashboard.module.css";
import { FiMail, FiCalendar, FiUsers, FiBell, FiArrowRight, FiImage, FiBookOpen, FiMusic, FiMonitor, FiCheckCircle, FiClock } from "react-icons/fi";

export default function Dashboard() {
  const [stats, setStats] = useState({ messages:{total:0,unread:0,recent:[]}, events:{upcoming:0,thisMonth:0,recent:[]}, users:{total:0,admins:0}, announcements:{total:0,active:0} });
  const [loading, setLoading] = useState(true);
  const { user } = useRole();
  const { can } = usePermissions();

  useEffect(() => {
    axios.get("/api/controllers/dashboard/stats", { headers:{ Authorization:`Bearer ${localStorage.getItem("token") || ""}` } })
      .then(({data}) => setStats(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const tools = [
    can("GALLERY") && { href:"/admin/gallery", icon:FiImage, title:"Galerie", text:"Albums et photos du site", status:"Disponible" },
    { href:"/admin/formations", icon:FiBookOpen, title:"Documents & formations", text:"Guides, cours et documents d’équipe", status:"À configurer" },
    { href:"/admin/louange", icon:FiMusic, title:"Louange & cantiques", text:"Répertoire des titres et des paroles", status:"Disponible" },
    { href:"/admin/projecteur", icon:FiMonitor, title:"Présentations projecteur", text:"Afficher les paroles en plein écran", status:"Disponible" },
  ].filter(Boolean);

  return <RoleGuard allowedRoles={PERMISSIONS.DASHBOARD}><Head><title>Espace de travail | Voice of God Tabernacle</title></Head><HeaderAdmin />
    <main className={styles.dashboard}>
      <section className={styles.welcome}><div><p className={styles.eyebrow}>Espace de travail VGT</p><h1>Bonjour {user?.firstName || user?.username || ""}</h1><p>Retrouvez ici les outils, les contenus et les activités de Voice of God Tabernacle.</p></div><div className={styles.today}>{new Date().toLocaleDateString("fr-CA",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div></section>

      <section aria-labelledby="essentiel"><div className={styles.sectionTitle}><div><p className={styles.eyebrow}>Aujourd’hui</p><h2 id="essentiel">À surveiller</h2></div></div>
        <div className={styles.statsGrid}>
          {can("MESSAGES") && <Link href="/admin/messages" className={styles.statCard}><FiMail /><div><strong>{loading ? "—" : stats.messages.unread}</strong><span>message{stats.messages.unread === 1 ? "" : "s"} non lu{stats.messages.unread === 1 ? "" : "s"}</span></div><FiArrowRight /></Link>}
          {can("CALENDAR") && <Link href="/admin/calendrier" className={styles.statCard}><FiCalendar /><div><strong>{loading ? "—" : stats.events.upcoming}</strong><span>événement{stats.events.upcoming === 1 ? "" : "s"} à venir</span></div><FiArrowRight /></Link>}
          {can("ANNOUNCEMENTS") && <Link href="/admin/announcements" className={styles.statCard}><FiBell /><div><strong>{loading ? "—" : stats.announcements.active}</strong><span>annonce{stats.announcements.active === 1 ? "" : "s"} active{stats.announcements.active === 1 ? "" : "s"}</span></div><FiArrowRight /></Link>}
          {can("USERS") && <Link href="/admin/users" className={styles.statCard}><FiUsers /><div><strong>{loading ? "—" : stats.users.total}</strong><span>membre{stats.users.total === 1 ? "" : "s"} de l’équipe</span></div><FiArrowRight /></Link>}
        </div>
      </section>

      <section aria-labelledby="ministeres"><div className={styles.sectionTitle}><div><p className={styles.eyebrow}>Ressources de l’église</p><h2 id="ministeres">Outils de travail</h2></div><Link href="/admin/ressources">Voir l’organisation complète <FiArrowRight /></Link></div>
        <div className={styles.toolsGrid}>{tools.map(({href,icon:Icon,title,text,status}) => <Link href={href} className={styles.toolCard} key={href}><div className={styles.toolIcon}><Icon /></div><div className={styles.toolBody}><div><h3>{title}</h3><p>{text}</p></div><span className={status === "Disponible" ? styles.ready : styles.pending}>{status === "Disponible" ? <FiCheckCircle /> : <FiClock />}{status}</span></div><FiArrowRight className={styles.arrow} /></Link>)}</div>
      </section>

      <section className={styles.activity} aria-labelledby="activite"><div className={styles.sectionTitle}><div><p className={styles.eyebrow}>Vie de l’église</p><h2 id="activite">Activité récente</h2></div></div><div className={styles.activityGrid}>
        <article><h3>Prochains événements</h3>{stats.events.recent?.length ? stats.events.recent.slice(0,3).map(event => <Link href="/admin/calendrier" key={event._id}><span><FiCalendar />{event.title}</span><small>{new Date(event.start).toLocaleDateString("fr-CA")}</small></Link>) : <p>Aucun événement à venir.</p>}</article>
        <article><h3>État de l’espace</h3><ul><li><FiCheckCircle /> Galerie prête à être utilisée</li><li><FiCheckCircle /> Répertoire des cantiques opérationnel</li><li><FiCheckCircle /> Projection des paroles opérationnelle</li><li><FiClock /> Stockage des documents à choisir</li></ul></article>
      </div></section>
    </main>
  </RoleGuard>;
}
