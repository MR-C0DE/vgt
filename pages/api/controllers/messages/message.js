import { connectToDatabase } from '@/lib/mongodb';
import Message from '@/lib/models/MessageModel';
import { ObjectId } from 'mongodb';
import { authenticateRequest } from '@/utils/authMiddleware';
import { enforceRateLimit } from '@/utils/rateLimit';

export default async function handler(req, res) {
  if (req.method === 'POST' && !enforceRateLimit(req, res, { name: 'contact-legacy', limit: 5, windowMs: 10 * 60_000 })) return;
  const allowedRoles = req.method === 'DELETE' ? ['admin'] : ['admin', 'editor'];
  if (req.method !== 'POST' && !authenticateRequest(req, res, allowedRoles)) return;
  await connectToDatabase();

  // Gestion des différentes méthodes HTTP
  switch (req.method) {
    case 'POST':
      return await handlePost(req, res);
    case 'GET':
      return await handleGet(req, res);
    case 'DELETE':
      return await handleDelete(req, res);
    case 'PUT':
      return await handlePut(req, res);
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// POST: Ajout d'un message
async function handlePost(req, res) {
  try {
    const { firstname, lastname, email, telephone, object, message } = req.body;

    if (!firstname || typeof firstname !== 'string') {
      return res.status(400).json({ message: 'Invalid firstname' });
    }
    if (!lastname || typeof lastname !== 'string') {
      return res.status(400).json({ message: 'Invalid lastname' });
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (telephone && typeof telephone !== 'string') {
      return res.status(400).json({ message: 'Invalid telephone' });
    }
    if (!object || typeof object !== 'string') {
      return res.status(400).json({ message: 'Invalid object' });
    }
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Invalid message' });
    }

    const newMessage = await Message.create({
      firstname,
      lastname,
      email,
      telephone: telephone ? telephone : "000-000-000",
      objet: object,
      message,
      date: new Date(),
      state: "no-read",
    });

    return res.status(201).json({ message: 'Form submission successful', data: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// GET: Récupérer tous les messages ou un message par ID
async function handleGet(req, res) {
  try {
    const { id } = req.query;

    if (id) {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid message ID' });
      }
      const message = await Message.findById(id);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
      return res.status(200).json({ message: 'Message retrieved successfully', data: message });
    } else {
      const messages = await Message.find().sort({ date: -1 });
      return res.status(200).json({ message: 'Messages retrieved successfully', data: messages });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// DELETE: Supprimer un message par ID
async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Message ID is required' });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid message ID' });
    }

    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// PUT: Mettre à jour un message par ID
async function handlePut(req, res) {
  try {
    
    const { id } = req.query;
    const { firstname, lastname, email, telephone, objet, message , date, state} = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid message ID' });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      id,
      { firstname, lastname, email, telephone, objet, message, date, state },
      { new: true }
    );
    
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    return res.status(200).json({ message: 'Message updated successfully', data: updatedMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
