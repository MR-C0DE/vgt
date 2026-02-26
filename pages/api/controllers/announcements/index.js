import Announcement from '../../models/Announcement';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'voiceofgodtabernacle_secret_key_2026';

export default async function handler(req, res) {
  // Pour GET public, pas besoin d'authentification
  if (req.method === 'GET' && !req.query.admin) {
    return await handlePublicGet(req, res);
  }

  // Pour toutes les autres opérations, vérifier l'authentification
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Vérifier que l'utilisateur a les droits (admin ou editor peuvent gérer les annonces)
    if (decoded.role !== 'admin' && decoded.role !== 'editor') {
      return res.status(403).json({ error: "Accès interdit" });
    }

    switch (req.method) {
      case 'GET':
        return await handleAdminGet(req, res);
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

// GET public pour le site (sans authentification)
async function handlePublicGet(req, res) {
  try {
    const announcements = await Announcement.getActive();
    return res.status(200).json(announcements);
  } catch (error) {
    console.error("Error in public GET announcements:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

// GET admin (avec toutes les annonces)
async function handleAdminGet(req, res) {
  try {
    const { id } = req.query;
    
    if (id) {
      const announcement = await Announcement.getById(id);
      if (!announcement) {
        return res.status(404).json({ error: "Annonce non trouvée" });
      }
      return res.status(200).json(announcement);
    } else {
      const announcements = await Announcement.getAll();
      return res.status(200).json(announcements);
    }
  } catch (error) {
    console.error("Error in admin GET announcements:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

// POST - Créer une annonce
async function handlePost(req, res) {
  try {
    const { author, title_fr, title_en, content_fr, content_en, date, is_active } = req.body;

    // Validation
    if (!author || !title_fr || !title_en || !content_fr || !content_en || !date) {
      return res.status(400).json({ error: "Tous les champs requis ne sont pas remplis" });
    }

    const newAnnouncement = await Announcement.create({
      author, title_fr, title_en, content_fr, content_en, date, is_active: is_active !== undefined ? is_active : true
    });
    
    return res.status(201).json({ 
      message: "Annonce créée avec succès",
      announcement: newAnnouncement 
    });
  } catch (error) {
    console.error("Error in POST announcement:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

// PUT - Mettre à jour une annonce
async function handlePut(req, res) {
  try {
    const { id } = req.query;
    const announcementData = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID requis" });
    }

    const existing = await Announcement.getById(id);
    if (!existing) {
      return res.status(404).json({ error: "Annonce non trouvée" });
    }

    await Announcement.update(id, announcementData);
    
    return res.status(200).json({ message: "Annonce mise à jour avec succès" });
  } catch (error) {
    console.error("Error in PUT announcement:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}

// DELETE - Supprimer une annonce
async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "ID requis" });
    }

    const existing = await Announcement.getById(id);
    if (!existing) {
      return res.status(404).json({ error: "Annonce non trouvée" });
    }

    await Announcement.delete(id);
    
    return res.status(200).json({ message: "Annonce supprimée avec succès" });
  } catch (error) {
    console.error("Error in DELETE announcement:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}