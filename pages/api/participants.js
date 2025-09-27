import Participant from "./models/Participant";

export default async function handler(req, res) {
  const { method } = req;
  const browserId = req.headers["x-browser-id"];
  if (!browserId) return res.status(400).json({ error: "Browser ID missing" });

  switch (method) {
    case "GET":
      try {
        const participants = await Participant.findAll();
        return res.status(200).json(participants);
      } catch {
        return res.status(500).json({ error: "Failed to fetch participants" });
      }

    case "POST":
      try {
        const { name, adults, children } = req.body;
        if (!name || adults === undefined || children === undefined)
          return res.status(400).json({ error: "All fields required" });
        const newParticipant = await Participant.create({ name, adults, children, browserId });
        return res.status(201).json(newParticipant);
      } catch {
        return res.status(500).json({ error: "Failed to create participant" });
      }

    case "PUT":
      try {
        const { id, newName, newAdults, newChildren } = req.body;
        const existing = await Participant.findById(id);
        if (!existing) return res.status(404).json({ error: "Participant not found" });
        if (existing.browserId !== browserId) return res.status(403).json({ error: "Not allowed" });

        const updated = await Participant.update(id, {
          name: newName || existing.name,
          adults: newAdults !== undefined ? newAdults : existing.adults,
          children: newChildren !== undefined ? newChildren : existing.children,
        });
        return res.status(200).json(updated);
      } catch {
        return res.status(500).json({ error: "Failed to update participant" });
      }

    case "DELETE":
      try {
        const { id } = req.query;
        const existing = await Participant.findById(id);
        if (!existing) return res.status(404).json({ error: "Participant not found" });
        if (existing.browserId !== browserId) return res.status(403).json({ error: "Not allowed" });

        await Participant.delete(id);
        return res.status(204).end();
      } catch {
        return res.status(500).json({ error: "Failed to delete participant" });
      }

    default:
      return res.status(405).end();
  }
}
