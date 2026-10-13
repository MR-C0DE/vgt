import { connectToDatabase } from '@/lib/mongodb';
import Announcement from '@/lib/models/Announcement';
import { ObjectId } from 'mongodb';
import { authenticateRequest } from '@/utils/authMiddleware';

export default async function handler(req, res) {
  await connectToDatabase();

  // GET public (pas d'auth)
  if (req.method === 'GET' && !req.query.admin) {
    const announcements = await Announcement.find({ is_active: true })
      .sort({ date: -1, created_at: -1 })
      .limit(10);
    return res.status(200).json(announcements);
  }

  // Pour le reste, vérifier l'auth
  const allowedRoles = req.method === 'DELETE' ? ['admin'] : ['admin', 'editor'];
  if (!authenticateRequest(req, res, allowedRoles)) return;

  switch (req.method) {
    case 'GET': {
      const { id } = req.query;
      if (id) {
        let announcement = null;
        if (ObjectId.isValid(id)) {
          announcement = await Announcement.findById(id);
        }
        if (!announcement && !isNaN(parseInt(id))) {
          announcement = await Announcement.findOne({ id: parseInt(id) });
        }
        if (!announcement) return res.status(404).json({ error: "Annonce non trouvée" });
        return res.status(200).json(announcement);
      }
      const announcements = await Announcement.find().sort({ date: -1, created_at: -1 });
      return res.status(200).json(announcements);
    }

    case 'POST': {
      const { author, title_fr, title_en, content_fr, content_en, date, is_active } = req.body;
      const announcement = await Announcement.create({
        author, title_fr, title_en, content_fr, content_en, date, is_active
      });
      return res.status(201).json(announcement);
    }

    case 'PUT': {
      const { id } = req.query;
      const updateData = req.body;
      delete updateData._id;
      updateData.updated_at = new Date();

      let announcement = null;
      if (ObjectId.isValid(id)) {
        announcement = await Announcement.findByIdAndUpdate(id, updateData, { new: true });
      }
      if (!announcement && !isNaN(parseInt(id))) {
        announcement = await Announcement.findOneAndUpdate({ id: parseInt(id) }, updateData, { new: true });
      }

      if (!announcement) return res.status(404).json({ error: "Annonce non trouvée" });
      return res.status(200).json(announcement);
    }

    case 'DELETE': {
      const { id } = req.query;

      let deleted = null;
      if (ObjectId.isValid(id)) {
        deleted = await Announcement.findByIdAndDelete(id);
      } else if (!isNaN(parseInt(id))) {
        deleted = await Announcement.findOneAndDelete({ id: parseInt(id) });
      } else {
        return res.status(400).json({ error: "ID invalide" });
      }

      if (!deleted) return res.status(404).json({ error: "Annonce non trouvée" });
      return res.status(200).json({ success: true });
    }

    default:
      return res.status(405).json({ error: "Méthode non autorisée" });
  }
}
