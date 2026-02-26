import Event from "./models/Event";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'voiceofgodtabernacle_secret_key_2026';

export default async function handler(req, res) {
  // Vérifier l'authentification pour toutes les méthodes sauf GET public
  if (req.method !== 'GET') {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(process.env.JWT_SECRET);
    
    if (!token) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: "Token invalide" });
    }
  }

  const browserId = req.headers["x-browser-id"];
  
  if (!browserId) {
    return res.status(400).json({ error: "Browser ID missing" });
  }

  try {
    switch (req.method) {
      case "GET":
        // GET avec ID dans l'URL ?id=xxx
        if (req.query.id) {
          const event = await Event.findById(req.query.id);
          if (!event) return res.status(404).json({ error: "Event not found" });
          return res.status(200).json(event);
        } else {
          const events = await Event.findAll();
          return res.status(200).json(events);
        }

      case "POST":
        const { title, start, end, category, location, leader, audience, notes, allDay } = req.body;
        if (!title || !start) return res.status(400).json({ error: "Title and start required" });

        const newEvent = await Event.create({
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
        });
        return res.status(201).json(newEvent);

      case "PUT": {
        // PUT avec ID dans le body
        const { id, ...data } = req.body;
        
        
        if (!id) return res.status(400).json({ error: "Event ID required" });

        const existing = await Event.findById(id);
        if (!existing) return res.status(404).json({ error: "Event not found" });
        
        // Vérifier que l'utilisateur a le droit de modifier
       

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
      }

      case "DELETE": {
        // DELETE avec ID dans le body
        const { id } = req.body;
        
        if (!id) return res.status(400).json({ error: "Event ID required" });

        const toDelete = await Event.findById(id);
        if (!toDelete) return res.status(404).json({ error: "Event not found" });
        
       

        await Event.delete(id);
        return res.status(200).json({ success: true }); // 204 ne renvoie pas de body
      }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}