import styles from "./stylesheets/HeaderAdmin.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { usePermissions } from "@/hooks/usePermissions";
import {
  FiHome,
  FiMail,
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiX,
  FiUsers,
  FiBell,
  FiUser,
  FiKey,
  FiChevronDown,
  FiUserPlus,
  FiImage,
} from "react-icons/fi";

const HeaderAdmin = () => {
  const router = useRouter();
  const { user, logout } = useRole();
  const { can } = usePermissions();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const closeMenus = () => {
      setMobileMenuOpen(false);
      setProfileMenuOpen(false);
    };

    router.events.on("routeChangeComplete", closeMenus);
    return () => router.events.off("routeChangeComplete", closeMenus);
  }, [router.events]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const isActive = (path) => {
    return router.pathname === path;
  };

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const getRoleLabel = () => {
    if (user?.role === "admin") return "Administrateur";
    if (user?.role === "editor") return "Éditeur";
    return "Lecteur";
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>VGT ADMIN</h1>
        </div>

        <button
          type="button"
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="admin-navigation"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <nav
          id="admin-navigation"
          className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}
        >
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link
                href="/admin"
                className={`${styles.navLink} ${isActive("/admin") ? styles.active : ""}`}
              >
                <FiHome className={styles.icon} />
                <span>Dashboard</span>
              </Link>
            </li>

            {can("MESSAGES") && (
              <li className={styles.navItem}>
                <Link
                  href="/admin/messages"
                  className={`${styles.navLink} ${isActive("/admin/messages") ? styles.active : ""}`}
                >
                  <FiMail className={styles.icon} />
                  <span>Messages</span>
                </Link>
              </li>
            )}

            {can("CALENDAR") && (
              <li className={styles.navItem}>
                <Link
                  href="/admin/calendrier"
                  className={`${styles.navLink} ${isActive("/admin/calendrier") ? styles.active : ""}`}
                >
                  <FiCalendar className={styles.icon} />
                  <span>Événements</span>
                </Link>
              </li>
            )}

            {can("ANNOUNCEMENTS") && (
              <li className={styles.navItem}>
                <Link
                  href="/admin/announcements"
                  className={`${styles.navLink} ${isActive("/admin/announcements") ? styles.active : ""}`}
                >
                  <FiBell className={styles.icon} />
                  <span>Annonces</span>
                </Link>
              </li>
            )}

            {can("GALLERY") && (
              <li className={styles.navItem}>
                <Link
                  href="/admin/gallery"
                  className={`${styles.navLink} ${isActive("/admin/gallery") ? styles.active : ""}`}
                >
                  <FiImage className={styles.icon} />
                  <span>Galerie</span>
                </Link>
              </li>
            )}

            {can("USERS") && (
              <li className={styles.navItem}>
                <Link
                  href="/admin/users"
                  className={`${styles.navLink} ${isActive("/admin/users") ? styles.active : ""}`}
                >
                  <FiUsers className={styles.icon} />
                  <span>Utilisateurs</span>
                </Link>
              </li>
            )}

            {/* Gestion des sœurs */}
            {can("CALENDAR") && (
              <li className={styles.navItem}>
                <Link
                  href="/admin/sisters-calendar"
                  className={`${styles.navLink} ${router.pathname === "/admin/sisters-calendar" ? styles.active : ""}`}
                >
                  <FiUserPlus className={styles.icon} />
                  <span>Activités des sœurs</span>
                </Link>
              </li>
            )}

            {user && (
              <li className={styles.navItem} ref={profileRef}>
                <button
                  type="button"
                  onClick={toggleProfileMenu}
                  className={styles.profileButton}
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="menu"
                >
                  <div className={styles.profileAvatar}>{getInitials()}</div>
                  <span className={styles.profileName}>
                    {user.firstName || user.username}
                  </span>
                  <FiChevronDown
                    className={`${styles.chevron} ${profileMenuOpen ? styles.chevronOpen : ""}`}
                  />
                </button>

                {profileMenuOpen && (
                  <div className={styles.profileMenu}>
                    <div className={styles.profileHeader}>
                      <div className={styles.profileAvatarLarge}>
                        {getInitials()}
                      </div>
                      <div className={styles.profileInfo}>
                        <strong>
                          {user.firstName} {user.lastName}
                        </strong>
                        <span>@{user.username}</span>
                        <span className={styles.profileRole}>
                          {getRoleLabel()}
                        </span>
                      </div>
                    </div>

                    <div className={styles.profileMenuItems}>
                      <Link
                        href="/admin/profile"
                        className={styles.profileMenuItem}
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <FiUser /> Mon profil
                      </Link>
                      <Link
                        href="/admin/change-password"
                        className={styles.profileMenuItem}
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <FiKey /> Changer mot de passe
                      </Link>
                      <div className={styles.profileDivider}></div>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          logout();
                        }}
                        className={styles.profileMenuItem}
                      >
                        <FiLogOut /> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export { HeaderAdmin };
