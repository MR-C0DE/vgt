import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import { ObjectId } from 'mongodb';
import { authenticateRequest } from '@/utils/authMiddleware';

export default async function handler(req, res) {
  await connectToDatabase();

  // GET public (pas d'auth nécessaire)
  if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      // Chercher par ObjectId ou par ancien ID numérique
      let event = null;
      if (ObjectId.isValid(id)) {
        event = await Event.findById(id);
      }
      if (!event && !isNaN(parseInt(id))) {
        event = await Event.findOne({ id: parseInt(id) });
      }
      if (!event) return res.status(404).json({ error: "Event not found" });
      return res.status(200).json(event);
    }
    const events = await Event.find().sort({ start: 1 });
    return res.status(200).json(events);
  }

  // Pour POST, PUT, DELETE : vérifier l'auth
  const allowedRoles = req.method === 'DELETE' ? ['admin'] : ['admin', 'editor'];
  if (!authenticateRequest(req, res, allowedRoles)) return;

  switch (req.method) {
    case 'POST': {
      const { title, start, end, category, location, leader, audience, notes, allDay, browserId } = req.body;
      const event = await Event.create({
        title, start, end, category, location, leader, audience, notes, allDay, browserId
      });
      return res.status(201).json(event);
    }

    case 'PUT': {
      const { id } = req.body;
      const data = req.body;
      delete data.id;
      delete data._id;
      data.updatedAt = new Date();

      let event = null;
      // Chercher par ObjectId
      if (ObjectId.isValid(id)) {
        event = await Event.findByIdAndUpdate(id, data, { new: true });
      }
      // Sinon chercher par ancien ID numérique
      if (!event && !isNaN(parseInt(id))) {
        event = await Event.findOneAndUpdate({ id: parseInt(id) }, data, { new: true });
      }

      if (!event) return res.status(404).json({ error: "Event not found" });
      return res.status(200).json(event);
    }

    case 'DELETE': {
      const { id } = req.body;

      if (ObjectId.isValid(id)) {
        await Event.findByIdAndDelete(id);
      } else if (!isNaN(parseInt(id))) {
        await Event.findOneAndDelete({ id: parseInt(id) });
      } else {
        return res.status(400).json({ error: "ID invalide" });
      }

      return res.status(200).json({ success: true });
    }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
