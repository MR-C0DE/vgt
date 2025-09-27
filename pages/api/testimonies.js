import { connectToDatabase } from "./lib/mongodb";
import Testimony from "./models/Testimony";

export default async function handler(req, res) {
    await connectToDatabase();
    const { method } = req;
    const  browserId  = req.headers["x-browser-id"];
  
    if (!browserId) return res.status(400).json({ error: "Browser ID missing" });
  
    switch (method) {
      case "GET":
        const testimonies = await Testimony.find().sort({ createdAt: -1 });
        return res.status(200).json(testimonies);
  
      case "POST":
        const { name, type } = req.body;
        if (!name || !type) return res.status(400).json({ error: "All fields required" });
        const newItem = await Testimony.create({ name, type, browserId });
        return res.status(201).json(newItem);
  
      case "PUT":
        const { id, newName, newType } = req.body;
        const existing = await Testimony.findById(id);
        if (!existing) return res.status(404).json({ error: "Testimony not found" });
        if (existing.browserId !== browserId) return res.status(403).json({ error: "Not allowed" });
        existing.name = newName || existing.name;
        existing.type = newType || existing.type;
        await existing.save();
        return res.status(200).json(existing);
  
      case "DELETE":
        const { id: deleteId } = req.query;
        const itemDel = await Testimony.findById(deleteId);
        if (!itemDel) return res.status(404).json({ error: "Testimony not found" });
        if (itemDel.browserId !== browserId) return res.status(403).json({ error: "Not allowed" });
        await Testimony.findByIdAndDelete(deleteId);
        return res.status(204).end();
  
      default:
        return res.status(405).end();
    }
  }