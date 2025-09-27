import Testimony from "./models/Testimony";

export default async function handler(req, res) {
  const { method } = req;
  const browserId = req.headers["x-browser-id"];
  if (!browserId) return res.status(400).json({ error: "Browser ID missing" });

  switch (method) {
    case "GET":
      try {
        const testimonies = await Testimony.findAll();
        return res.status(200).json(testimonies);
      } catch {
        return res.status(500).json({ error: "Failed to fetch testimonies" });
      }

    case "POST":
      try {
        const { name, type } = req.body;
        if (!name || !type) return res.status(400).json({ error: "All fields required" });
        const newItem = await Testimony.create({ name, type, browserId });
        return res.status(201).json(newItem);
      } catch {
        return res.status(500).json({ error: "Failed to create testimony" });
      }

    case "PUT":
      try {
        const { id, newName, newType } = req.body;
        const existing = await Testimony.findById(id);
        if (!existing) return res.status(404).json({ error: "Testimony not found" });
        if (existing.browserId !== browserId) return res.status(403).json({ error: "Not allowed" });

        const updated = await Testimony.update(id, {
          name: newName || existing.name,
          type: newType || existing.type,
        });
        return res.status(200).json(updated);
      } catch {
        return res.status(500).json({ error: "Failed to update testimony" });
      }

    case "DELETE":
      try {
        const { id } = req.query;
        const existing = await Testimony.findById(id);
        if (!existing) return res.status(404).json({ error: "Testimony not found" });
        if (existing.browserId !== browserId) return res.status(403).json({ error: "Not allowed" });

        await Testimony.delete(id);
        return res.status(204).end();
      } catch {
        return res.status(500).json({ error: "Failed to delete testimony" });
      }

    default:
      return res.status(405).end();
  }
}
