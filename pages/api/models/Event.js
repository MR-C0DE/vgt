import { db } from "../lib/db";

class Event {
  static async findAll() {
    const [rows] = await db.query(
      "SELECT * FROM events ORDER BY start ASC"
    );
    return rows;
  }

  static async create({
    title,
    start,
    end,
    category,
    location,
    leader,
    audience,
    notes,
    allDay,
    browserId,
  }) {
    const now = new Date();

    const [result] = await db.query(
      `INSERT INTO events 
      (title, start, end, category, location, leader, audience, notes, allDay, browserId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        start,
        end || null,
        category || null,
        location || null,
        leader || null,
        audience || null,
        notes || null,
        allDay || false,
        browserId,
        now,
        now,
      ]
    );

    return {
      id: result.insertId,
      title,
      start,
      end,
      category,
      location,
      leader,
      audience,
      notes,
      allDay,
      browserId,
      createdAt: now,
      updatedAt: now,
    };
  }

  static async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM events WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  }

  static async update(id, data) {
    const now = new Date();

    await db.query(
      `UPDATE events SET
        title = ?,
        start = ?,
        end = ?,
        category = ?,
        location = ?,
        leader = ?,
        audience = ?,
        notes = ?,
        allDay = ?,
        updatedAt = ?
      WHERE id = ?`,
      [
        data.title,
        data.start,
        data.end,
        data.category,
        data.location,
        data.leader,
        data.audience,
        data.notes,
        data.allDay,
        now,
        id,
      ]
    );

    return this.findById(id);
  }

  static async delete(id) {
    await db.query("DELETE FROM events WHERE id = ?", [id]);
  }
}

export default Event;
