import { connectToDatabase } from '@/lib/mongodb';
import SisterEvent from '@/lib/models/SisterEvent';
import { authenticateRequest } from '@/utils/authMiddleware';

export default async function handler(req, res) {
    if (!authenticateRequest(req, res, ['admin', 'editor'])) return;
    await connectToDatabase();

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const { eventId } = req.query;

        if (!eventId) {
            return res.status(400).json({ error: 'eventId requis' });
        }

        const event = await SisterEvent.findById(eventId).select('participants title');

        if (!event) {
            return res.status(404).json({ error: 'Événement non trouvé' });
        }

        return res.status(200).json({
            event_title: event.title,
            total_participants: event.participants.length,
            participants: event.participants
        });

    } catch (error) {
        console.error('Erreur:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}
