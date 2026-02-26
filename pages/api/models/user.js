import { db } from '../lib/db';
import bcrypt from 'bcryptjs';

class User {
  // Créer un utilisateur avec mot de passe hashé
  static async createUser(username, password, firstName, lastName, email, phone, role = 'editor') {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const query = "INSERT INTO users (username, password, first_name, last_name, email, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const values = [username, hashedPassword, firstName, lastName, email, phone, role];
      const [result] = await db.query(query, values);
      
      return { id: result.insertId, username, firstName, lastName, email, phone, role };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Récupérer tous les utilisateurs (sans les mots de passe)
  static async getAllUsers() {
    try {
      const query = "SELECT id, username, first_name, last_name, email, phone, role, created_at FROM users ORDER BY id DESC";
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  // Récupérer un utilisateur par ID (avec mot de passe pour vérification)
  static async getUserById(id) {
    try {
      const query = "SELECT * FROM users WHERE id = ?";
      const [rows] = await db.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error retrieving user by ID:", error);
      throw error;
    }
  }

  // Récupérer un utilisateur par username (pour login)
  static async getUserByUsername(username) {
    try {
      const query = "SELECT * FROM users WHERE username = ?";
      const [rows] = await db.query(query, [username]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error retrieving user by username:", error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  static async updateUser(id, userData) {
    try {
      const { username, firstName, lastName, email, phone, role, password } = userData;
      
      let query, values;
      
      if (password) {
        // Si un nouveau mot de passe est fourni, on le hashe
        const hashedPassword = await bcrypt.hash(password, 10);
        query = "UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ?, phone = ?, role = ?, password = ? WHERE id = ?";
        values = [username, firstName, lastName, email, phone, role, hashedPassword, id];
      } else {
        // Sinon, on met à jour sans changer le mot de passe
        query = "UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ?, phone = ?, role = ? WHERE id = ?";
        values = [username, firstName, lastName, email, phone, role, id];
      }
      
      const [result] = await db.query(query, values);
      return result;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  static async deleteUser(id) {
    try {
      const query = "DELETE FROM users WHERE id = ?";
      const [result] = await db.query(query, [id]);
      return result;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // Rechercher des utilisateurs
  static async searchUsers(keyword) {
    try {
      const query = "SELECT id, username, first_name, last_name, email, phone, role FROM users WHERE username LIKE ? OR first_name LIKE ? OR last_name LIKE ? OR email LIKE ?";
      const searchTerm = `%${keyword}%`;
      const [rows] = await db.query(query, [searchTerm, searchTerm, searchTerm, searchTerm]);
      return rows;
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  }

  // Vérifier le mot de passe
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  // Récupérer un utilisateur par email
  static async getUserByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = ?";
      const [rows] = await db.query(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  }

  // Récupérer un utilisateur avec son mot de passe (pour vérification)
  static async getUserByIdWithPassword(id) {
    try {
      const query = "SELECT * FROM users WHERE id = ?";
      const [rows] = await db.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Error getting user by ID with password:", error);
      throw error;
    }
  }

  // Mettre à jour le mot de passe
  static async updatePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const query = "UPDATE users SET password = ? WHERE id = ?";
      const [result] = await db.query(query, [hashedPassword, id]);
      return result;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }

  // Mettre à jour le profil (sans mot de passe)
  static async updateUser(id, userData) {
    try {
      const { firstName, lastName, email, phone } = userData;
      
      const query = "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?";
      const values = [firstName, lastName, email, phone || null, id];
      const [result] = await db.query(query, values);
      
      return result;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

export default User;