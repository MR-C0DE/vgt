import { db } from '../lib/db'; 

class User {
  static async createUser(username, password, firstName, lastName, email, phone) {
    try {
      const query = "INSERT INTO users (username, password, first_name, last_name, email, phone) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [username, password, firstName, lastName, email, phone];
      const [result] = await db.query(query, values);
      console.log("User created with ID:", result.insertId);
      return result;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

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

  static async updateUser(id, username, password, firstName, lastName, email, phone) {
    try {
      const query = "UPDATE users SET username = ?, password = ?, first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?";
      const values = [username, password, firstName, lastName, email, phone, id];
      const [result] = await db.query(query, values);
      console.log("User updated with ID:", id);
      return result;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const query = "DELETE FROM users WHERE id = ?";
      const [result] = await db.query(query, [id]);
      console.log("User deleted with ID:", id);
      return result;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  static async searchUsersByKeyword(keyword) {
    try {
      const query = "SELECT * FROM users WHERE CONCAT(username, ' ', first_name, ' ', last_name) LIKE ?";
      const [rows] = await db.query(query, [`%${keyword}%`]);
      console.log("Search results:", rows);
      return rows;
    } catch (error) {
      console.error("Error searching users by keyword:", error);
      throw error;
    }
  }
}

export default User;
