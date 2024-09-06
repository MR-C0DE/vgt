// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Messages } from "../../models/message";

export default async function handler(req, res) {
  // Gestion des différentes méthodes HTTP
  switch (req.method) {
    case 'POST':
      return await handlePost(req, res);
    case 'GET':
      return await handleGet(req, res);
    case 'DELETE':
      return await handleDelete(req, res);
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

    const newMessage = await Messages.insertMessage(firstname, lastname, email, telephone ? telephone : "000-000-000", object, message, new Date(), "no-read");

    return res.status(200).json({ message: 'Form submission successful', data: req.body, message: newMessage });
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
      const message = await Messages.selectMessageById(id);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
      return res.status(200).json({ message: 'Message retrieved successfully', data: message });
    } else {
      const messages = await Messages.selectMessages();
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

    const deletedMessage = await Messages.deleteMessage(id);
    if (deletedMessage.affectedRows === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
