import { db } from "../lib/db";

class Contribution {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM contributions ORDER BY createdAt DESC");
    return rows;
  }

  static async create({ name, contribution, browserId }) {
    const now = new Date();
    const [result] = await db.query(
      "INSERT INTO contributions (name, contribution, browserId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
      [name, contribution, browserId, now, now]
    );
    return { id: result.insertId, name, contribution, browserId, createdAt: now, updatedAt: now };
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM contributions WHERE id = ?", [id]);
    return rows[0] || null;
  }

  static async update(id, { name, contribution }) {
    const now = new Date();
    await db.query(
      "UPDATE contributions SET name = ?, contribution = ?, updatedAt = ? WHERE id = ?",
      [name, contribution, now, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.query("DELETE FROM contributions WHERE id = ?", [id]);
  }
}

export default Contribution;
