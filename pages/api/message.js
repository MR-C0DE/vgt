// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Messages } from "./models/message";

export default async function handler(req, res) {
    // Vérifie si la méthode est un POST
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  
    try {
      // Valider et nettoyer les données
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
  
      // Ici, vous pouvez traiter les données, par exemple les sauvegarder dans une base de données
  
      // Réponse réussie
      
      return res.status(200).json({ message: 'Form submission successful', data: req.body, message: await Messages.insertMessage(firstname, lastname, email, telephone?telephone:"000-000-000", object, message, new Date(), "no-read") });
    } catch (error) {
      // Gérer les erreurs
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  