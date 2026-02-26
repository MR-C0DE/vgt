import { db } from '../lib/db';

class Announcement {
  // Récupérer toutes les annonces
  static async getAll() {
    try {
      const query = "SELECT * FROM announcements ORDER BY date DESC, created_at DESC";
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error getting announcements:", error);
      throw error;
    }
  }

  // Récupérer les annonces actives pour le site public
  static async getActive() {
    try {
      const query = "SELECT * FROM announcements WHERE is_active = true ORDER BY date DESC, created_at DESC LIMIT 10";
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error getting active announcements:", error);
      throw error;
    }
  }

  // Récupérer une annonce par ID
  static async getById(id) {
    try {
      const query = "SELECT * FROM announcements WHERE id = ?";
      const [rows] = await db.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error getting announcement by ID:", error);
      throw error;
    }
  }

  // Créer une annonce
  static async create(announcementData) {
    try {
      const { author, title_fr, title_en, content_fr, content_en, date, is_active = true } = announcementData;
      
      const query = `INSERT INTO announcements 
        (author, title_fr, title_en, content_fr, content_en, date, is_active) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      
      const values = [author, title_fr, title_en, content_fr, content_en, date, is_active];
      const [result] = await db.query(query, values);
      
      return { id: result.insertId, ...announcementData };
    } catch (error) {
      console.error("Error creating announcement:", error);
      throw error;
    }
  }

  // Mettre à jour une annonce
  static async update(id, announcementData) {
    try {
      const { author, title_fr, title_en, content_fr, content_en, date, is_active } = announcementData;
      
      const query = `UPDATE announcements SET 
        author = ?, 
        title_fr = ?, 
        title_en = ?, 
        content_fr = ?, 
        content_en = ?, 
        date = ?, 
        is_active = ? 
        WHERE id = ?`;
      
      const values = [author, title_fr, title_en, content_fr, content_en, date, is_active, id];
      const [result] = await db.query(query, values);
      
      return result;
    } catch (error) {
      console.error("Error updating announcement:", error);
      throw error;
    }
  }

  // Supprimer une annonce
  static async delete(id) {
    try {
      const query = "DELETE FROM announcements WHERE id = ?";
      const [result] = await db.query(query, [id]);
      return result;
    } catch (error) {
      console.error("Error deleting announcement:", error);
      throw error;
    }
  }

  // Activer/Désactiver une annonce
  static async toggleActive(id, is_active) {
    try {
      const query = "UPDATE announcements SET is_active = ? WHERE id = ?";
      const [result] = await db.query(query, [is_active, id]);
      return result;
    } catch (error) {
      console.error("Error toggling announcement:", error);
      throw error;
    }
  }
}

export default Announcement;