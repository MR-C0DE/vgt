import { randomUUID } from 'node:crypto';
import { createDocumentUploadUrl } from '@/lib/s3';
import { authenticateActiveRequest } from '@/utils/authMiddleware';

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
]);
const MAX_SIZE = 25 * 1024 * 1024;

function safeFilename(value) {
  return String(value || 'document').normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').slice(-140);
}

export default async function handler(req, res) {
  const user = await authenticateActiveRequest(req, res, ['admin', 'editor']);
  if (!user) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const filename = safeFilename(req.body?.filename);
  const contentType = String(req.body?.contentType || '');
  const size = Number(req.body?.size || 0);
  if (!ALLOWED_TYPES.has(contentType)) return res.status(400).json({ error: 'Format non accepté. Utilisez PDF, Word, PowerPoint, Excel ou texte.' });
  if (!Number.isFinite(size) || size <= 0 || size > MAX_SIZE) return res.status(400).json({ error: 'Le fichier doit faire moins de 25 Mo.' });

  try {
    const key = `training-documents/${new Date().getUTCFullYear()}/${randomUUID()}-${filename}`;
    const uploadUrl = await createDocumentUploadUrl({ key, contentType });
    return res.status(200).json({ uploadUrl, key, filename });
  } catch (error) {
    console.error('Training document upload signing error:', error);
    return res.status(503).json({ error: 'Le stockage des documents n’est pas encore configuré.' });
  }
}
