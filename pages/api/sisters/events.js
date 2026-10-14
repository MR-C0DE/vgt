import { connectToDatabase } from '@/lib/mongodb';
import SisterEvent from '@/lib/models/SisterEvent';
import { authenticateActiveRequest } from '@/utils/authMiddleware';

export default async function handler(req, res) {
    await connectToDatabase();

    const adminRequest = req.method === 'GET' && req.query.admin === 'true';
    const allowedRoles = req.method === 'DELETE' ? ['admin'] : ['admin', 'editor'];
    if ((req.method !== 'GET' || adminRequest) && !await authenticateActiveRequest(req, res, allowedRoles)) {
        return;
    }

    // GET - Récupérer les événements
    if (req.method === 'GET') {
        try {
            const { id } = req.query;

            if (id) {
                const event = await SisterEvent.findOne(adminRequest ? { _id: id } : { _id: id, is_active: true }).select('-participants');
                if (!event) return res.status(404).json({ error: 'Événement non trouvé' });
                return res.status(200).json(event);
            }

            const query = adminRequest ? {} : { is_active: true };

            const events = await SisterEvent.find(query).select('-participants')
                .sort({ start: 1 });

            return res.status(200).json(events);
        } catch (error) {
            console.error('Erreur GET events:', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    // POST - Créer un événement
    if (req.method === 'POST') {
        try {
            const {
                title, title_fr, title_en,
                start, end, location,
                description, description_fr, description_en,
                organizer, max_participants
            } = req.body;

            const event = await SisterEvent.create({
                title: title || title_fr || title_en,
                title_fr,
                title_en,
                start,
                end,
                location,
                description,
                description_fr,
                description_en,
                organizer,
                max_participants: max_participants || 50,
                is_active: true,
                participants: [],
                created_at: new Date(),
                updated_at: new Date()
            });

            return res.status(201).json(event);
        } catch (error) {
            console.error('Erreur POST event:', error);
            return res.status(500).json({ error: 'Erreur lors de la création' });
        }
    }

    // PUT - Modifier un événement
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const { _id, participants, created_at, ...updateData } = req.body;
            updateData.updated_at = new Date();

            const event = await SisterEvent.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!event) return res.status(404).json({ error: 'Événement non trouvé' });

            return res.status(200).json(event);
        } catch (error) {
            console.error('Erreur PUT event:', error);
            return res.status(500).json({ error: 'Erreur lors de la modification' });
        }
    }

    // DELETE - Supprimer un événement
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            const event = await SisterEvent.findByIdAndDelete(id);
            if (!event) return res.status(404).json({ error: 'Événement non trouvé' });
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Erreur DELETE event:', error);
            return res.status(500).json({ error: 'Erreur lors de la suppression' });
        }
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
}
