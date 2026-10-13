import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AdminConfirmDialog, AdminNotice } from "./AdminFeedback";
import { usePermissions } from "@/hooks/usePermissions";
import styles from "./stylesheets/MessageList.module.css";
import {
  FiMail,
  FiCheck,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiRefreshCw,
  FiInbox,
  FiUser,
  FiCalendar,
  FiPhone,
  FiMessageSquare,
  FiArrowLeft,
  FiArchive,
} from "react-icons/fi";

const MessageList = () => {
  const router = useRouter();
  const { can } = usePermissions();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await axios.get("/api/controllers/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/controllers/messages?id=${id}`,
        { state: "read" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessages(
        messages.map((msg) =>
          msg._id === id ? { ...msg, state: "read" } : msg,
        ),
      );

      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, state: "read" });
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      }
    }
  };

  const deleteMessage = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/controllers/messages?id=${deleteTarget}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(messages.filter((msg) => msg._id !== deleteTarget));

      if (selectedMessage?._id === deleteTarget) {
        setSelectedMessage(null);
        setShowDetail(false);
      }
      setDeleteTarget(null);
      setNotice({ type: "success", text: "Message supprimé." });
    } catch (error) {
      console.error("Error deleting message:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      } else {
        setNotice({ type: "error", text: error.response?.data?.error || "Suppression impossible" });
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setShowDetail(true);

    if (message.state === "no-read") {
      markAsRead(message._id);
    }

    if (isMobile) {
      document.body.style.overflow = "hidden";
    }
  };

  const handleBackToList = () => {
    setShowDetail(false);
    document.body.style.overflow = "auto";
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      (msg.firstname?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (msg.lastname?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (msg.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (msg.objet?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    if (filter === "read") return matchesSearch && msg.state === "read";
    if (filter === "unread") return matchesSearch && msg.state === "no-read";
    return matchesSearch;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("fr-FR", { weekday: "short" });
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Chargement des messages...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminNotice notice={notice} onClose={() => setNotice(null)} />
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>
            <FiMail className={styles.headerIcon} />
            {!isMobile || !showDetail ? "Boîte de réception" : "Message"}
          </h1>
          {(!isMobile || !showDetail) && (
            <button
              className={styles.refreshButton}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FiRefreshCw className={refreshing ? styles.spinning : ""} />
              {!isMobile && "Actualiser"}
            </button>
          )}
          {isMobile && showDetail && (
            <button className={styles.backButton} onClick={handleBackToList}>
              <FiArrowLeft /> Retour
            </button>
          )}
        </div>

        {(!isMobile || !showDetail) && (
          <>
            <div className={styles.filters}>
              <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Rechercher un message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Tous</option>
                <option value="unread">Non lus</option>
                <option value="read">Lus</option>
              </select>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <FiMail />
                <span>{messages.length} total</span>
              </div>
              <div className={styles.stat}>
                <FiEyeOff />
                <span>
                  {messages.filter((m) => m.state === "no-read").length} non lus
                </span>
              </div>
              <div className={styles.stat}>
                <FiEye />
                <span>
                  {messages.filter((m) => m.state === "read").length} lus
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={styles.mailbox}>
        <div
          className={`${styles.messageList} ${
            isMobile && showDetail ? styles.hideOnMobile : ""
          }`}
        >
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className={`${styles.messageListItem} ${
                  msg.state === "no-read" ? styles.unread : ""
                } ${
                  selectedMessage?._id === msg._id && !isMobile
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleSelectMessage(msg)}
              >
                <div className={styles.messageListHeader}>
                  <div className={styles.messageListSender}>
                    <FiUser className={styles.senderIcon} />
                    <span className={styles.senderName}>
                      {msg.firstname} {msg.lastname}
                    </span>
                  </div>
                  <span className={styles.messageListDate}>
                    {formatDate(msg.date)}
                  </span>
                </div>
                <div className={styles.messageListSubject}>
                  <strong>{msg.objet}</strong>
                </div>
                <div className={styles.messageListPreview}>
                  {msg.message.substring(0, 60)}...
                </div>
                <div className={styles.messageListFooter}>
                  <span className={styles.messageListEmail}>{msg.email}</span>
                  <span
                    className={`${styles.messageListStatus} ${
                      msg.state === "no-read"
                        ? styles.statusUnread
                        : styles.statusRead
                    }`}
                  >
                    {msg.state === "no-read" ? "Non lu" : "Lu"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyList}>
              <FiInbox size={48} />
              <p>Aucun message trouvé</p>
              {searchTerm && (
                <button
                  className={styles.clearSearchButton}
                  onClick={() => setSearchTerm("")}
                >
                  Effacer la recherche
                </button>
              )}
            </div>
          )}
        </div>

        <div
          className={`${styles.messageDetail} ${
            isMobile && showDetail ? styles.showOnMobile : ""
          } ${!selectedMessage ? styles.empty : ""}`}
        >
          {selectedMessage ? (
            <>
              <div className={styles.detailHeader}>
                <h2>{selectedMessage.objet}</h2>
                <div className={styles.detailActions}>
                  {can("MESSAGES_DELETE") && (
                    <button
                      onClick={() => setDeleteTarget(selectedMessage._id)}
                      className={styles.detailDeleteButton}
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.detailMeta}>
                <div className={styles.detailMetaItem}>
                  <FiUser className={styles.metaIcon} />
                  <span>
                    <strong>De:</strong> {selectedMessage.firstname}{" "}
                    {selectedMessage.lastname}
                  </span>
                </div>
                <div className={styles.detailMetaItem}>
                  <FiMail className={styles.metaIcon} />
                  <span>
                    <strong>Email:</strong> {selectedMessage.email}
                  </span>
                </div>
                {selectedMessage.telephone &&
                  selectedMessage.telephone !== "000-000-000" && (
                    <div className={styles.detailMetaItem}>
                      <FiPhone className={styles.metaIcon} />
                      <span>
                        <strong>Tél:</strong> {selectedMessage.telephone}
                      </span>
                    </div>
                  )}
                <div className={styles.detailMetaItem}>
                  <FiCalendar className={styles.metaIcon} />
                  <span>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedMessage.date).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </div>
              </div>

              <div className={styles.detailContent}>
                <FiMessageSquare className={styles.contentIcon} />
                <div className={styles.messageBody}>
                  <p>{selectedMessage.message}</p>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.noSelection}>
              <FiMail size={64} />
              <p>Sélectionnez un message pour lire son contenu</p>
            </div>
          )}
        </div>
      </div>
      <AdminConfirmDialog open={Boolean(deleteTarget)} title="Supprimer ce message ?" message="Ce message sera supprimé définitivement." busy={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={deleteMessage} />
    </div>
  );
};

export default MessageList;
