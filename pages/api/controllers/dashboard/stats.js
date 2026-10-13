import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/UserModel';
import Message from '@/lib/models/MessageModel';
import Event from '@/lib/models/Event';
import Announcement from '@/lib/models/Announcement';
import { authenticateRequest } from '@/utils/authMiddleware';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée' });
  if (!authenticateRequest(req, res)) return;
  await connectToDatabase();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [
    totalMessages,
    unreadMessages,
    recentMessages,
    totalEvents,
    upcomingEvents,
    eventsThisMonth,
    recentEvents,
    totalUsers,
    adminUsers,
    editorUsers,
    totalAnnouncements,
    activeAnnouncements,
  ] = await Promise.all([
    Message.countDocuments(),
    Message.countDocuments({ state: 'no-read' }),
    Message.find().sort({ date: -1 }).limit(5).lean(),
    Event.countDocuments(),
    Event.countDocuments({ start: { $gte: now } }),
    Event.countDocuments({ start: { $gte: startOfMonth, $lt: startOfNextMonth } }),
    Event.find({ start: { $gte: now } }).sort({ start: 1 }).limit(5).lean(),
    User.countDocuments(),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ role: 'editor' }),
    Announcement.countDocuments(),
    Announcement.countDocuments({ is_active: true }),
  ]);

  return res.status(200).json({
    messages: {
      total: totalMessages,
      unread: unreadMessages,
      recent: recentMessages
    },
    events: {
      total: totalEvents,
      upcoming: upcomingEvents,
      thisMonth: eventsThisMonth,
      recent: recentEvents,
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
}
