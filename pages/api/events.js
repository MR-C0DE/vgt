import Event from "./models/Event";

export default async function handler(req, res) {
  const { method } = req;
  const browserId = req.headers["x-browser-id"];
  const { id } = req.body; // si présent, on cible un événement précis

  if (!browserId) {
    return res.status(400).json({ error: "Browser ID missing" });
  }

  try {
    switch (method) {
      /* 📥 GET */
      case "GET":
        if (id) {
          const event = await Event.findById(id);
          if (!event) return res.status(404).json({ error: "Event not found" });
          return res.status(200).json(event);
        } else {
          const events = await Event.findAll();
          return res.status(200).json(events);
        }

      /* ➕ POST */
      case "POST":
        const { title, start, end, category, location, leader, audience, notes, allDay } = req.body;
        if (!title || !start) return res.status(400).json({ error: "Title and start required" });

        const newEvent = await Event.create({
          title, start, end, category, location, leader, audience, notes, allDay, browserId,
        });
        return res.status(201).json(newEvent);

      /* ✏️ PUT */
      case "PUT":
        if (!id) return res.status(400).json({ error: "Event ID required" });

        const existing = await Event.findById(id);
        if (!existing) return res.status(404).json({ error: "Event not found" });
        if (existing.browserId !== browserId) return res.status(403).json({ error: "Not allowed" });

        const data = req.body;
        const updated = await Event.update(id, {
          title: data.title ?? existing.title,
          start: data.start ?? existing.start,
          end: data.end ?? existing.end,
          category: data.category ?? existing.category,
          location: data.location ?? existing.location,
          leader: data.leader ?? existing.leader,
          audience: data.audience ?? existing.audience,
          notes: data.notes ?? existing.notes,
          allDay: data.allDay ?? existing.allDay,
        });
        return res.status(200).json(updated);

      /* 🗑️ DELETE */
      case "DELETE":
        if (!id) return res.status(400).json({ error: "Event ID required" });

        const toDelete = await Event.findById(id);
        if (!toDelete) return res.status(404).json({ error: "Event not found" });
        if (toDelete.browserId !== browserId) return res.status(403).json({ error: "Not allowed" });

        await Event.delete(id);
        return res.status(204).end();

      default:
        return res.status(405).end();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
