import { db } from "../lib/db";

class Participant {
  static async findAll() {
    const [rows] = await db.query("SELECT * FROM participants ORDER BY createdAt DESC");
    return rows;
  }

  static async create({ name, adults, children, browserId }) {
    const now = new Date();
    const [result] = await db.query(
      "INSERT INTO participants (name, adults, children, browserId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [name, adults, children, browserId, now, now]
    );
    return { id: result.insertId, name, adults, children, browserId, createdAt: now, updatedAt: now };
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM participants WHERE id = ?", [id]);
    return rows[0] || null;
  }

  static async update(id, { name, adults, children }) {
    const now = new Date();
    await db.query(
      "UPDATE participants SET name = ?, adults = ?, children = ?, updatedAt = ? WHERE id = ?",
      [name, adults, children, now, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.query("DELETE FROM participants WHERE id = ?", [id]);
  }
}

export default Participant;
