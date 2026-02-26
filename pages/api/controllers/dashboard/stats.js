import { Messages } from '../../models/message';
import Event from '../../models/Event';
import User from '../../models/user';
import Announcement from '../../models/Announcement';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'voiceofgodtabernacle_secret_key_2026';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    jwt.verify(token, JWT_SECRET);

    // Récupérer toutes les stats en parallèle
    const [
      messages, 
      events, 
      users, 
      announcements
    ] = await Promise.all([
      Messages.selectMessages(),
      Event.findAll(),
      User.getAllUsers(),
      Announcement.getAll()
    ]);

    // Stats des messages
    const totalMessages = messages.length;
    const unreadMessages = messages.filter(m => m.state === 'no-read').length;
    const recentMessages = messages.slice(0, 5);

    // Stats des événements
    const now = new Date();
    const upcomingEvents = events.filter(e => new Date(e.start) > now).length;
    const eventsThisMonth = events.filter(e => {
      const eventDate = new Date(e.start);
      return eventDate.getMonth() === now.getMonth() && 
             eventDate.getFullYear() === now.getFullYear();
    }).length;

    // Stats des utilisateurs
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const editorUsers = users.filter(u => u.role === 'editor').length;

    // Stats des annonces
    const totalAnnouncements = announcements.length;
    const activeAnnouncements = announcements.filter(a => a.is_active).length;

    return res.status(200).json({
      messages: {
        total: totalMessages,
        unread: unreadMessages,
        recent: recentMessages
      },
      events: {
        total: events.length,
        upcoming: upcomingEvents,
        thisMonth: eventsThisMonth
      },
      users: {
        total: totalUsers,
        admins: adminUsers,
        editors: editorUsers
      },
      announcements: {
        total: totalAnnouncements,
        active: activeAnnouncements
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}