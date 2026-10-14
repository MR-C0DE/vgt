import { connectToDatabase } from '@/lib/mongodb';
import User from '@/lib/models/UserModel';
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
    const {
      email,
      phone,
      first_name = req.body.firstName,
      last_name = req.body.lastName,
    } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({ error: "Les champs prénom, nom et email sont requis" });
    }

    const existingUser = await User.findOne({ email, _id: { $ne: decoded.id } });
    if (existingUser) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { first_name, last_name, email, phone, updated_at: new Date() },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    // Générer nouveau token
    const newToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        auth_version: decoded.auth_version || 0
      },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return res.status(200).json({ message: "Profil mis à jour", user, token: newToken });
  } catch (error) {
    return res.status(401).json({ error: "Token invalide" });
  }
}
