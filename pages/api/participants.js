import { connectToDatabase } from "./lib/mongodb";
import Participant from "./models/Participant";

export default async function handler(req, res) {
    await connectToDatabase();
    const { method } = req;
    const  browserId  = req.headers["x-browser-id"];
  
    if (!browserId) return res.status(400).json({ error: "Browser ID missing" });
  
    switch (method) {
      case "GET":
        const participants = await Participant.find().sort({ createdAt: -1 });
        return res.status(200).json(participants);
  
      case "POST":
        const { name, adults, children } = req.body;
        if (!name || adults === undefined || children === undefined)
          return res.status(400).json({ error: "All fields required" });
        const newParticipant = await Participant.create({ name, adults, children, browserId });
        return res.status(201).json(newParticipant);
  
      case "PUT":
        const { id, newName, newAdults, newChildren } = req.body;
        const existing = await Participant.findById(id);
        if (!existing) return res.status(404).json({ error: "Participant not found" });
        if (existing.browserId !== browserId) return res.status(403).json({ error: "Not allowed" });
        existing.name = newName || existing.name;
        existing.adults = newAdults !== undefined ? newAdults : existing.adults;
        existing.children = newChildren !== undefined ? newChildren : existing.children;
        await existing.save();
        return res.status(200).json(existing);
  
      case "DELETE":
        const { id: deleteId } = req.query;
        const item = await Participant.findById(deleteId);
        if (!item) return res.status(404).json({ error: "Participant not found" });
        if (item.browserId !== browserId) return res.status(403).json({ error: "Not allowed" });
        await Participant.findByIdAndDelete(deleteId);
        return res.status(204).end();
  
      default:
        return res.status(405).end();
    }
  }