import User from '../../models/user';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'voiceofgodtabernacle_secret_key_2026';

export default async function handler(req, res) {
  // Vérifier l'authentification
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Vérifier que l'utilisateur est admin (sauf pour GET qui peut être accessible aux admins et editors)
    if (req.method !== 'GET' && decoded.role !== 'admin') {
      return res.status(403).json({ error: "Accès interdit - Réservé aux administrateurs" });
    }

    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ error: "Méthode non autorisée" });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Token invalide" });
  }
}

// GET - Récupérer tous les utilisateurs ou un seul
async function handleGet(req, res) {
  try {
    const { id } = req.query;
    
    if (id) {
      const user = await User.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      // Ne pas renvoyer le mot de passe
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } else {
      const users = await User.getAllUsers();
      return res.status(200).json(users);
    }
  } catch (error) {
    console.error("Error in GET users:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

// POST - Créer un nouvel utilisateur
async function handlePost(req, res) {
  try {
    const { username, password, firstName, lastName, email, phone, role } = req.body;

    // Validation
    if (!username || !password || !firstName || !lastName || !email) {
      return res.status(400).json({ error: "Tous les champs requis ne sont pas remplis" });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Ce nom d'utilisateur existe déjà" });
    }

    const newUser = await User.createUser(username, password, firstName, lastName, email, phone, role || 'editor');
    
    return res.status(201).json({ 
      message: "Utilisateur créé avec succès",
      user: newUser 
    });
  } catch (error) {
    console.error("Error in POST users:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

// PUT - Mettre à jour un utilisateur
async function handlePut(req, res) {
  try {
    const { id } = req.query;
    const userData = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID requis" });
    }

    const existingUser = await User.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    await User.updateUser(id, userData);
    
    return res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
  } catch (error) {
    console.error("Error in PUT users:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

// DELETE - Supprimer un utilisateur
async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID requis" });
    }

    // Empêcher la suppression de son propre compte
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.id === parseInt(id)) {
      return res.status(400).json({ error: "Vous ne pouvez pas supprimer votre propre compte" });
    }

    const existingUser = await User.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    await User.deleteUser(id);
    
    return res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Error in DELETE users:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}