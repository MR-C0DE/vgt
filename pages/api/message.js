import { connectToDatabase } from '@/lib/mongodb';
import Message from '@/lib/models/MessageModel';
import emailService from "../../utils/emailService";
import { enforceRateLimit } from '@/utils/rateLimit';

export default async function handler(req, res) {
  if (!enforceRateLimit(req, res, { name: 'contact', limit: 5, windowMs: 10 * 60_000 })) return;
  // Vérifie si la méthode est un POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase();

    // Valider et nettoyer les données
    const { firstname, lastname, email, telephone, object, message, language = 'fr' } = req.body;

    if ([firstname, lastname, email, telephone, object, message].some((value) => typeof value === 'string' && value.length > 5000)) {
      return res.status(400).json({ message: 'Payload too large' });
    }

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

    // Sauvegarder dans la base de données
    const insertResult = await Message.create({
      firstname,
      lastname,
      email,
      telephone: telephone || "000-000-000",
      objet: object,
      message,
      date: new Date(),
      state: "no-read",
    });

    // Envoyer les notifications par email
    const emailResult = await emailService.sendNewMessageNotifications(
      { firstname, lastname, email, telephone, object, message },
      language
    );

    if (!emailResult.success) {
      console.warn('Email notifications failed but message was saved:', emailResult.error);
    }

    // Réponse réussie
    return res.status(200).json({ 
      message: 'Form submission successful', 
      data: req.body,
      dbResult: insertResult,
      emailNotifications: emailResult
    });
    
  } catch (error) {
    // Gérer les erreurs
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
