import styles from "./stylesheets/HeaderAdmin.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { usePermissions } from "@/hooks/usePermissions";
import { FiHome, FiMail, FiCalendar, FiLogOut, FiMenu, FiX, FiUsers, FiBell, FiUser, FiKey, FiChevronDown, FiUserPlus, FiImage, FiBookOpen, FiMusic, FiMonitor, FiFolder } from "react-icons/fi";

const HeaderAdmin = () => {
  const router = useRouter();
  const { user, logout } = useRole();
  const { can } = usePermissions();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const closeOutside = (event) => profileRef.current && !profileRef.current.contains(event.target) && setProfileMenuOpen(false);
    document.addEventListener("mousedown", closeOutside);
    return () => document.removeEventListener("mousedown", closeOutside);
  }, []);
  useEffect(() => {
    const close = () => { setMobileMenuOpen(false); setProfileMenuOpen(false); };
    router.events.on("routeChangeComplete", close);
    return () => router.events.off("routeChangeComplete", close);
  }, [router.events]);

  const active = (path) => router.pathname === path;
  const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "VGT" : "VGT";
  const role = user?.role === "admin" ? "Administrateur" : user?.role === "editor" ? "Éditeur" : "Lecteur";
  const groups = [
    { label: "Communication", links: [can("MESSAGES") && ["/admin/messages", "Messages", FiMail], can("ANNOUNCEMENTS") && ["/admin/announcements", "Annonces", FiBell]].filter(Boolean) },
    { label: "Organisation", links: [can("CALENDAR") && ["/admin/calendrier", "Événements", FiCalendar], can("CALENDAR") && ["/admin/sisters-calendar", "Activités des sœurs", FiUserPlus]].filter(Boolean) },
    { label: "Ressources", links: [["/admin/ressources", "Vue d’ensemble", FiFolder], can("GALLERY") && ["/admin/gallery", "Galerie", FiImage], ["/admin/formations", "Documents & formations", FiBookOpen], ["/admin/louange", "Louange & cantiques", FiMusic], ["/admin/projecteur", "Présentations", FiMonitor]].filter(Boolean) },
  ];

  return <header className={styles.header}><div className={styles.container}>
    <Link href="/admin" className={styles.brand} aria-label="Accueil de l’espace de travail VGT"><span className={styles.brandMark}>VGT</span><span><strong>Espace de travail</strong><small>Voice of God Tabernacle</small></span></Link>
    <button type="button" className={styles.mobileMenuButton} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={mobileMenuOpen} aria-controls="admin-navigation">{mobileMenuOpen ? <FiX /> : <FiMenu />}</button>
    <nav id="admin-navigation" className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}>
      <Link href="/admin" className={`${styles.homeLink} ${active("/admin") ? styles.active : ""}`}><FiHome /><span>Accueil</span></Link>
      {groups.map(group => group.links.length > 0 && <div className={styles.navGroup} key={group.label}><span className={styles.groupLabel}>{group.label}</span><div className={styles.groupLinks}>{group.links.map(([href, label, Icon]) => <Link key={href} href={href} className={`${styles.navLink} ${active(href) ? styles.active : ""}`}><Icon /><span>{label}</span></Link>)}</div></div>)}
      {can("USERS") && <div className={styles.navGroup}><span className={styles.groupLabel}>Équipe</span><div className={styles.groupLinks}><Link href="/admin/users" className={`${styles.navLink} ${active("/admin/users") ? styles.active : ""}`}><FiUsers /><span>Utilisateurs</span></Link></div></div>}
    </nav>
    {user && <div className={styles.profile} ref={profileRef}><button type="button" onClick={() => setProfileMenuOpen(!profileMenuOpen)} className={styles.profileButton} aria-expanded={profileMenuOpen} aria-haspopup="menu"><span className={styles.profileAvatar}>{initials}</span><span className={styles.profileName}>{user.firstName || user.username}</span><FiChevronDown className={profileMenuOpen ? styles.chevronOpen : ""} /></button>
      {profileMenuOpen && <div className={styles.profileMenu}><div className={styles.profileHeader}><span className={styles.profileAvatarLarge}>{initials}</span><div><strong>{user.firstName} {user.lastName}</strong><span>@{user.username}</span><em>{role}</em></div></div><div className={styles.profileMenuItems}><Link href="/admin/profile" className={styles.profileMenuItem}><FiUser /> Mon profil</Link><Link href="/admin/change-password" className={styles.profileMenuItem}><FiKey /> Changer le mot de passe</Link><button type="button" onClick={logout} className={styles.profileMenuItem}><FiLogOut /> Déconnexion</button></div></div>}
    </div>}
  </div></header>;
};
export { HeaderAdmin };
