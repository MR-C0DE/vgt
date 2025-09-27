import { db } from "../lib/db";

class Testimony {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM testimonies ORDER BY createdAt DESC");
    return rows;
  }

  static async create({ name, type, browserId }) {
    const now = new Date();
    const [result] = await db.query(
      "INSERT INTO testimonies (name, type, browserId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
      [name, type, browserId, now, now]
    );
    return { id: result.insertId, name, type, browserId, createdAt: now, updatedAt: now };
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM testimonies WHERE id = ?", [id]);
    return rows[0] || null;
  }

  static async update(id, { name, type }) {
    const now = new Date();
    await db.query(
      "UPDATE testimonies SET name = ?, type = ?, updatedAt = ? WHERE id = ?",
      [name, type, now, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.query("DELETE FROM testimonies WHERE id = ?", [id]);
  }
}

export default Testimony;
