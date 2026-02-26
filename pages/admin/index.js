import { HeaderAdmin } from "@/components/HeaderAdmin";
import CheckLogin from "@/components/CheckLogin";
import RoleGuard from "@/components/RoleGuard";
import { PERMISSIONS } from "@/constants/roles";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import axios from "axios";
import styles from "./styles/Dashboard.module.css";
import {
  FiMail,
  FiCalendar,
  FiUsers,
  FiClock,
  FiBell,
  FiMessageSquare,
  FiUserCheck,
  FiEye,
  FiEyeOff,
  FiTrendingUp,
  FiArrowRight
} from "react-icons/fi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    messages: { total: 0, unread: 0, recent: [] },
    events: { total: 0, upcoming: 0, thisMonth: 0 },
    users: { total: 0, admins: 0, editors: 0 },
    announcements: { total: 0, active: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchStats();
    setGreeting(getGreeting());
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/controllers/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401) {
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <HeaderAdmin />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Chargement du tableau de bord...</p>
        </div>
      </>
    );
  }

  return (
    <>
       <RoleGuard allowedRoles={PERMISSIONS.DASHBOARD}>
      <Head>
        <title>Dashboard - Admin | Voice of God Tabernacle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <HeaderAdmin />

      <div className={styles.dashboard}>
        {/* En-tête avec message de bienvenue */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Tableau de bord</h1>
            <p className={styles.greeting}>
              {greeting}, <span className={styles.userName}>Administrateur</span>
            </p>
          </div>
          <div className={styles.dateDisplay}>
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
        </div>

        {/* Statistiques principales */}
        <div className={styles.statsGrid}>
          {/* Messages */}
          <Link href="/admin/messages" className={styles.statLink}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#fff9e6' }}>
                <FiMail color="#ffc107" size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>{stats.messages.total}</h3>
                <p>Messages totaux</p>
              </div>
              <div className={styles.statBadge}>
                <FiEyeOff size={14} />
                <span>{stats.messages.unread} non lus</span>
              </div>
            </div>
          </Link>

          {/* Événements */}
          <Link href="/admin/calendrier" className={styles.statLink}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#e6f7ff' }}>
                <FiCalendar color="#17a2b8" size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>{stats.events.upcoming}</h3>
                <p>À venir</p>
              </div>
              <div className={styles.statBadge}>
                <FiCalendar size={14} />
                <span>{stats.events.thisMonth} ce mois</span>
              </div>
            </div>
          </Link>

          {/* Utilisateurs */}
          <Link href="/admin/users" className={styles.statLink}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#e8f5e8' }}>
                <FiUsers color="#28a745" size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>{stats.users.total}</h3>
                <p>Utilisateurs</p>
              </div>
              <div className={styles.statBadge}>
                <FiUserCheck size={14} />
                <span>{stats.users.admins} admins</span>
              </div>
            </div>
          </Link>

          {/* Annonces */}
          <Link href="/admin/announcements" className={styles.statLink}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: '#fff9e6' }}>
                <FiBell color="#ffc107" size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>{stats.announcements.total}</h3>
                <p>Annonces</p>
              </div>
              <div className={styles.statBadge}>
                {stats.announcements.active > 0 ? (
                  <>
                    <FiEye size={14} />
                    <span>{stats.announcements.active} actives</span>
                  </>
                ) : (
                  <>
                    <FiEyeOff size={14} />
                    <span>Aucune active</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Section des graphiques / aperçus */}
        <div className={styles.dashboardGrid}>
          {/* Messages récents */}
          <div className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <h2>
                <FiMessageSquare className={styles.sectionIcon} />
                Messages récents
              </h2>
              <Link href="/admin/messages" className={styles.viewAllLink}>
                Voir tout <FiArrowRight />
              </Link>
            </div>

            <div className={styles.recentList}>
              {stats.messages.recent.length > 0 ? (
                stats.messages.recent.map((msg) => (
                  <Link 
                    href="/admin/messages" 
                    key={msg.id} 
                    className={styles.recentItemLink}
                  >
                    <div className={styles.recentItem}>
                      <div className={styles.recentHeader}>
                        <div className={styles.recentSender}>
                          <strong>{msg.firstname} {msg.lastname}</strong>
                          <span className={msg.state === 'no-read' ? styles.unreadBadge : styles.readBadge}>
                            {msg.state === 'no-read' ? 'Non lu' : 'Lu'}
                          </span>
                        </div>
                        <span className={styles.recentTime}>
                          {formatDate(msg.date)}
                        </span>
                      </div>
                      <p className={styles.recentSubject}>{msg.objet}</p>
                      <p className={styles.recentPreview}>
                        {msg.message.substring(0, 80)}...
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <FiMail size={32} />
                  <p>Aucun message récent</p>
                </div>
              )}
            </div>
          </div>

          {/* Événements à venir */}
          <div className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <h2>
                <FiCalendar className={styles.sectionIcon} />
                Événements à venir
              </h2>
              <Link href="/admin/calendrier" className={styles.viewAllLink}>
                Voir tout <FiArrowRight />
              </Link>
            </div>

            <div className={styles.recentList}>
              <div className={styles.emptyState}>
                <FiCalendar size={32} />
                <p>Fonctionnalité à venir</p>
              </div>
            </div>
          </div>

          {/* Annonces actives */}
          <div className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <h2>
                <FiBell className={styles.sectionIcon} />
                Annonces actives
              </h2>
              <Link href="/admin/announcements" className={styles.viewAllLink}>
                Voir tout <FiArrowRight />
              </Link>
            </div>

            <div className={styles.recentList}>
              <div className={styles.statOverview}>
                <div className={styles.overviewItem}>
                  <span className={styles.overviewValue}>{stats.announcements.total}</span>
                  <span className={styles.overviewLabel}>Total</span>
                </div>
                <div className={styles.overviewItem}>
                  <span className={styles.overviewValue}>{stats.announcements.active}</span>
                  <span className={styles.overviewLabel}>Actives</span>
                </div>
                <div className={styles.overviewItem}>
                  <span className={styles.overviewValue}>
                    {stats.announcements.total - stats.announcements.active}
                  </span>
                  <span className={styles.overviewLabel}>Inactives</span>
                </div>
              </div>
              
              <Link href="/admin/announcements" className={styles.quickAction}>
                <FiBell /> Gérer les annonces
              </Link>
            </div>
          </div>

          {/* Utilisateurs */}
          <div className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <h2>
                <FiUsers className={styles.sectionIcon} />
                Utilisateurs
              </h2>
              <Link href="/admin/users" className={styles.viewAllLink}>
                Voir tout <FiArrowRight />
              </Link>
            </div>

            <div className={styles.recentList}>
              <div className={styles.statOverview}>
                <div className={styles.overviewItem}>
                  <span className={styles.overviewValue}>{stats.users.total}</span>
                  <span className={styles.overviewLabel}>Total</span>
                </div>
                <div className={styles.overviewItem}>
                  <span className={styles.overviewValue}>{stats.users.admins}</span>
                  <span className={styles.overviewLabel}>Admins</span>
                </div>
                <div className={styles.overviewItem}>
                  <span className={styles.overviewValue}>{stats.users.editors}</span>
                  <span className={styles.overviewLabel}>Éditeurs</span>
                </div>
              </div>

              <Link href="/admin/users" className={styles.quickAction}>
                <FiUserCheck /> Gérer les utilisateurs
              </Link>
            </div>
          </div>
        </div>
      </div>
      </RoleGuard>
    </>
  );
}