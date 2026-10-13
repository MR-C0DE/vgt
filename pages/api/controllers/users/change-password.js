import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/UserModel';
import bcrypt from 'bcryptjs';
import { authenticateRequest } from '@/utils/authMiddleware';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const decoded = authenticateRequest(req, res);
    if (!decoded) return;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères" });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.updated_at = new Date();
    await user.save();

    return res.status(200).json({ message: "Mot de passe changé avec succès" });
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
}
