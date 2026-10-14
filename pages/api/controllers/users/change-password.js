import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/UserModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateActiveRequest, getJwtSecret } from '@/utils/authMiddleware';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const decoded = await authenticateActiveRequest(req, res);
    if (!decoded) return;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    if (newPassword.length < 12) {
      return res.status(400).json({ error: "Le nouveau mot de passe doit contenir au moins 12 caractères" });
    }

    const user = await User.findById(decoded.id).select('+auth_version');
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.auth_version = (user.auth_version || 0) + 1;
    user.updated_at = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        auth_version: user.auth_version,
      },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return res.status(200).json({ message: "Mot de passe changé avec succès", token });
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
}
