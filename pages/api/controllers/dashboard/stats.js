import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/UserModel';
import Message from '@/lib/models/MessageModel';
import Event from '@/lib/models/Event';
import Announcement from '@/lib/models/Announcement';
import { authenticateActiveRequest } from '@/utils/authMiddleware';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée' });
  const currentUser = await authenticateActiveRequest(req, res);
  if (!currentUser) return;
  await connectToDatabase();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const canReadMessages = ['admin', 'editor'].includes(currentUser.role);
  const canManageContent = ['admin', 'editor'].includes(currentUser.role);
  const canManageUsers = currentUser.role === 'admin';

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
    canReadMessages ? Message.countDocuments() : Promise.resolve(0),
    canReadMessages ? Message.countDocuments({ state: 'no-read' }) : Promise.resolve(0),
    canReadMessages
      ? Message.find().select('firstname lastname objet message date state').sort({ date: -1 }).limit(5).lean()
      : Promise.resolve([]),
    canManageContent ? Event.countDocuments() : Promise.resolve(0),
    canManageContent ? Event.countDocuments({ start: { $gte: now } }) : Promise.resolve(0),
    canManageContent
      ? Event.countDocuments({ start: { $gte: startOfMonth, $lt: startOfNextMonth } })
      : Promise.resolve(0),
    canManageContent
      ? Event.find({ start: { $gte: now } }).sort({ start: 1 }).limit(5).lean()
      : Promise.resolve([]),
    canManageUsers ? User.countDocuments() : Promise.resolve(0),
    canManageUsers ? User.countDocuments({ role: 'admin' }) : Promise.resolve(0),
    canManageUsers ? User.countDocuments({ role: 'editor' }) : Promise.resolve(0),
    canManageContent ? Announcement.countDocuments() : Promise.resolve(0),
    canManageContent ? Announcement.countDocuments({ is_active: true }) : Promise.resolve(0),
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
