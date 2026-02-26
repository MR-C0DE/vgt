import User from '../../models/User';
import jwt from 'jsonwebtoken';

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

    const { firstName, lastName, email, phone } = req.body;

    // Validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "Les champs prénom, nom et email sont requis" });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const existingUser = await User.getUserByEmail(email);
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    // Mettre à jour l'utilisateur
    await User.updateUser(userId, {
      firstName,
      lastName,
      email,
      phone
    });

    // Récupérer l'utilisateur mis à jour
    const updatedUser = await User.getUserById(userId);
    const { password, ...userWithoutPassword } = updatedUser;

    // Créer un nouveau token avec les informations mises à jour
    const newToken = jwt.sign(
      {
        id: updatedUser.id,
        username: updatedUser.username,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: "Profil mis à jour avec succès",
      user: userWithoutPassword,
      token: newToken
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}