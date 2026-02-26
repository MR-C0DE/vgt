import User from '../../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'voiceofgodtabernacle_secret_key_2026';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères" });
    }

    // Récupérer l'utilisateur avec son mot de passe
    const user = await User.getUserByIdWithPassword(userId);
    
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect" });
    }

    // Mettre à jour le mot de passe
    await User.updatePassword(userId, newPassword);

    return res.status(200).json({ 
      message: "Mot de passe changé avec succès" 
    });

  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}