import { connectToDatabase } from '@/lib/mongodb';
import Album from '@/lib/models/Album';
import { authenticateRequest } from '@/utils/authMiddleware';

export default async function handler(req, res) {
    await connectToDatabase();

    const adminRequest = req.method === 'GET' && req.query.admin === 'true';
    const allowedRoles = req.method === 'DELETE' ? ['admin'] : ['admin', 'editor'];
    if ((req.method !== 'GET' || adminRequest) && !authenticateRequest(req, res, allowedRoles)) {
        return;
    }

    // GET - Récupérer tous les albums
    if (req.method === 'GET') {
        try {
            const { id, featured, limit } = req.query;

            // Si un ID est fourni, récupérer un album spécifique
            if (id) {
                const album = await Album.findOne(adminRequest ? { _id: id } : { _id: id, is_public: true });
                if (!album) {
                    return res.status(404).json({ error: 'Album non trouvé' });
                }
                return res.status(200).json(album);
            }

            // Sinon, récupérer tous les albums publics
            let query = adminRequest ? {} : { is_public: true };
            if (featured === 'true') {
                query = { ...query, 'photos.is_featured': true };
            }

            let albumsQuery = Album.find(query).sort({ event_date: -1, created_at: -1 });

            if (limit) {
                albumsQuery = albumsQuery.limit(parseInt(limit));
            }

            const albums = await albumsQuery;
            return res.status(200).json(albums);

        } catch (error) {
            console.error('Erreur GET albums:', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // POST - Créer un nouvel album
    if (req.method === 'POST') {
        try {
            const { name, name_fr, name_en, description, event_date, photos, cover_image, is_public } = req.body;

            const album = await Album.create({
                name,
                name_fr,
                name_en,
                description,
                event_date: event_date || new Date(),
                photos: photos || [],
                cover_image: cover_image || (photos && photos[0]?.url),
                is_public: is_public !== false,
                created_at: new Date(),
                updated_at: new Date()
            });

            return res.status(201).json(album);

        } catch (error) {
            console.error('Erreur POST album:', error);
            return res.status(500).json({ error: 'Erreur lors de la création' });
        }
    }

    // PUT - Mettre à jour un album
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const { _id, created_at, ...updateData } = req.body;
            updateData.updated_at = new Date();

            const album = await Album.findByIdAndUpdate(id, updateData, { new: true });
            if (!album) {
                return res.status(404).json({ error: 'Album non trouvé' });
            }

            return res.status(200).json(album);

        } catch (error) {
            console.error('Erreur PUT album:', error);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        }
    }

    // DELETE - Supprimer un album
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            const album = await Album.findByIdAndDelete(id);
            if (!album) {
                return res.status(404).json({ error: 'Album non trouvé' });
            }
            return res.status(200).json({ success: true });

        } catch (error) {
            console.error('Erreur DELETE album:', error);
            return res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
}
