// pages/api/controllers/messages/index.js
import { Messages } from "../../models/message";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'voiceofgodtabernacle_secret_key_2026';

export default async function handler(req, res) {
  // Vérifier l'authentification pour toutes les méthodes
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }

  // Gestion des différentes méthodes HTTP
  switch (req.method) {
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

// GET: Récupérer tous les messages
async function handleGet(req, res) {
  try {
    const messages = await Messages.selectMessages();
    return res.status(200).json(messages); // Retourne directement le tableau
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// DELETE: Supprimer un message par ID
async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Message ID is required' });
    }

    const deletedMessage = await Messages.deleteMessage(id);
    if (deletedMessage.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// PUT: Mettre à jour un message (changer l'état)
async function handlePut(req, res) {
  try {
    const { id } = req.query;
    const { state } = req.body;
    
    // Récupérer le message existant
    const existingMessage = await Messages.selectMessageById(id);
    if (!existingMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Mettre à jour uniquement l'état
    const updatedMessage = await Messages.updateMessage(
      id, 
      existingMessage.firstname,
      existingMessage.lastname,
      existingMessage.email,
      existingMessage.telephone,
      existingMessage.objet,
      existingMessage.message,
      existingMessage.date,
      state
    );
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}