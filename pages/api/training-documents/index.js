import { connectToDatabase } from '@/lib/mongodb';
import TrainingDocument from '@/lib/models/TrainingDocument';
import { authenticateActiveRequest } from '@/utils/authMiddleware';
import { createDocumentReadUrl, deleteStoredDocument } from '@/lib/s3';

const CATEGORIES = ['Formation', 'Guide', 'Procédure', 'Référence', 'Autre'];
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';

function cleanUrl(value) {
  const url = clean(value, 2000);
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol) ? parsed.toString() : '';
  } catch {
    return '';
  }
}

function payload(body = {}) {
  return {
    title: clean(body.title, 200),
    category: CATEGORIES.includes(body.category) ? body.category : 'Autre',
    description: clean(body.description, 1000),
    document_url: cleanUrl(body.document_url),
    storage_key: clean(body.storage_key, 1000),
    original_filename: clean(body.original_filename, 255),
  };
}

async function withAccessUrl(document) {
  if (!document.storage_key) return document;
  try {
    return { ...document, document_url: await createDocumentReadUrl(document.storage_key) };
  } catch {
    return { ...document, document_url: '' };
  }
}

export default async function handler(req, res) {
  const allowedRoles = req.method === 'DELETE' ? ['admin'] : ['admin', 'editor', 'viewer'];
  const user = await authenticateActiveRequest(req, res, allowedRoles);
  if (!user) return;
  if (['POST', 'PUT'].includes(req.method) && !['admin', 'editor'].includes(user.role)) {
    return res.status(403).json({ error: 'Accès interdit' });
  }

  try {
    await connectToDatabase();
    if (req.method === 'GET') {
      const documents = await TrainingDocument.find().sort({ updated_at: -1 }).lean();
      return res.status(200).json(await Promise.all(documents.map(withAccessUrl)));
    }
    if (req.method === 'POST') {
      const data = payload(req.body);
      if (!data.title || (!data.document_url && !data.storage_key)) return res.status(400).json({ error: 'Le titre et un document sont requis.' });
      return res.status(201).json(await TrainingDocument.create({ ...data, created_by: user.id }));
    }
    if (req.method === 'PUT') {
      const data = payload(req.body);
      if (!data.title || (!data.document_url && !data.storage_key)) return res.status(400).json({ error: 'Le titre et un document sont requis.' });
      const previous = await TrainingDocument.findById(req.query.id).lean();
      const document = await TrainingDocument.findByIdAndUpdate(req.query.id, data, { new: true, runValidators: true });
      if (document && previous?.storage_key && previous.storage_key !== data.storage_key) deleteStoredDocument(previous.storage_key).catch(error => console.error('Old document cleanup error:', error));
      return document ? res.status(200).json(document) : res.status(404).json({ error: 'Document introuvable' });
    }
    if (req.method === 'DELETE') {
      const document = await TrainingDocument.findByIdAndDelete(req.query.id);
      if (document?.storage_key) deleteStoredDocument(document.storage_key).catch(error => console.error('Document cleanup error:', error));
      return document ? res.status(200).json({ success: true }) : res.status(404).json({ error: 'Document introuvable' });
    }
    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Training documents API error:', error);
    if (error.name === 'CastError') return res.status(400).json({ error: 'Identifiant invalide' });
    return res.status(500).json({ error: 'Une erreur est survenue' });
  }
}
