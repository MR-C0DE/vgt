import { connectToDatabase } from '@/lib/mongodb';
import Album from '@/lib/models/Album';
import { enforceRateLimit } from '@/utils/rateLimit';

export default async function handler(req, res) {
    if (!enforceRateLimit(req, res, { name: 'album-like', limit: 30, windowMs: 60_000 })) return;
    await connectToDatabase();

    if (req.method === 'POST') {
        try {
            const { albumId, photoId } = req.body;

            const album = await Album.findById(albumId);
            if (!album) {
                return res.status(404).json({ error: 'Album non trouvé' });
            }

            // Trouver la photo et incrémenter les likes
            const photo = album.photos.id(photoId);
            if (photo) {
                photo.likes = (photo.likes || 0) + 1;
                await album.save();
                return res.status(200).json({ likes: photo.likes });
            }

            return res.status(404).json({ error: 'Photo non trouvée' });

        } catch (error) {
            console.error('Erreur like:', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}
