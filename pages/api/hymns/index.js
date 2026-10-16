import { connectToDatabase } from '@/lib/mongodb';
import Hymn from '@/lib/models/Hymn';
import { authenticateActiveRequest } from '@/utils/authMiddleware';

const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';

export default async function handler(req, res) {
  const allowedRoles = req.method === 'DELETE' ? ['admin'] : ['admin', 'editor', 'viewer'];
  const user = await authenticateActiveRequest(req, res, allowedRoles);
  if (!user) return;
  if (['POST', 'PUT'].includes(req.method) && !['admin', 'editor'].includes(user.role)) return res.status(403).json({ error: 'Accès interdit' });

  try {
    await connectToDatabase();
    if (req.method === 'GET') {
      const { id, q = '' } = req.query;
      if (id) {
        const hymn = await Hymn.findById(id).lean();
        return hymn ? res.status(200).json(hymn) : res.status(404).json({ error: 'Cantique introuvable' });
      }
      const term = clean(q, 100);
      const query = term ? { $or: [{ title_fr: { $regex: term, $options: 'i' } }, { title_en: { $regex: term, $options: 'i' } }] } : {};
      return res.status(200).json(await Hymn.find(query).sort({ title_fr: 1, title_en: 1 }).lean());
    }
    if (req.method === 'POST') {
      const hymn = await Hymn.create({ title_fr: clean(req.body.title_fr, 200), title_en: clean(req.body.title_en, 200), lyrics_fr: clean(req.body.lyrics_fr, 50000), lyrics_en: clean(req.body.lyrics_en, 50000), created_by: user.id });
      return res.status(201).json(hymn);
    }
    if (req.method === 'PUT') {
      const hymn = await Hymn.findByIdAndUpdate(req.query.id, { title_fr: clean(req.body.title_fr, 200), title_en: clean(req.body.title_en, 200), lyrics_fr: clean(req.body.lyrics_fr, 50000), lyrics_en: clean(req.body.lyrics_en, 50000) }, { new: true, runValidators: true });
      return hymn ? res.status(200).json(hymn) : res.status(404).json({ error: 'Cantique introuvable' });
    }
    if (req.method === 'DELETE') {
      const hymn = await Hymn.findByIdAndDelete(req.query.id);
      return hymn ? res.status(200).json({ success: true }) : res.status(404).json({ error: 'Cantique introuvable' });
    }
    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Hymns API error:', error);
    if (error.name === 'ValidationError') return res.status(400).json({ error: 'Ajoutez au moins un titre et les paroles correspondantes.' });
    if (error.name === 'CastError') return res.status(400).json({ error: 'Identifiant invalide' });
    return res.status(500).json({ error: 'Une erreur est survenue' });
  }
}
