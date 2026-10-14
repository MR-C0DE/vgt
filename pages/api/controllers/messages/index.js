import { connectToDatabase } from '@/lib/mongodb';
import Message from '@/lib/models/MessageModel';
import { ObjectId } from 'mongodb';
import { authenticateActiveRequest } from '@/utils/authMiddleware';

export default async function handler(req, res) {
  await connectToDatabase();

  const allowedRoles = req.method === 'DELETE' ? ['admin'] : ['admin', 'editor'];
  if (!await authenticateActiveRequest(req, res, allowedRoles)) return;

  switch (req.method) {
    case 'GET': {
      const messages = await Message.find().sort({ date: -1 });
      return res.status(200).json(messages);
    }

    case 'DELETE': {
      const { id } = req.query;
      // Convertir l'ID string en ObjectId MongoDB
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID invalide" });
      }
      const deleted = await Message.findByIdAndDelete(new ObjectId(id));
      if (!deleted) return res.status(404).json({ error: "Message introuvable" });
      return res.status(200).json({ success: true });
    }

    case 'PUT': {
      const { id } = req.query;
      const { state } = req.body;

      // Convertir l'ID string en ObjectId MongoDB
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID invalide" });
      }

      const updated = await Message.findByIdAndUpdate(new ObjectId(id), { state });
      if (!updated) return res.status(404).json({ error: "Message introuvable" });
      return res.status(200).json({ success: true });
    }

    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
