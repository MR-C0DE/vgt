import { connectToDatabase } from '@/lib/mongodb';
import SisterEvent from '@/lib/models/SisterEvent';
import { enforceRateLimit } from '@/utils/rateLimit';

export default async function handler(req, res) {
    if (!enforceRateLimit(req, res, { name: 'sisters-register', limit: 10, windowMs: 10 * 60_000 })) return;
    await connectToDatabase();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const { eventId, name, email, phone } = req.body;

        if ([name, email, phone].some(value => typeof value === 'string' && value.length > 254)) {
            return res.status(400).json({ error: 'Données trop longues' });
        }

        if (!eventId || !name || !email) {
            return res.status(400).json({ error: 'Nom et email requis' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const event = await SisterEvent.findOneAndUpdate(
            {
                _id: eventId,
                is_active: true,
                'participants.email': { $ne: normalizedEmail },
                $expr: { $lt: [{ $size: '$participants' }, '$max_participants'] },
            },
            {
                $push: {
                    participants: {
                        name: name.trim(),
                        email: normalizedEmail,
                        phone: phone?.trim() || '',
                        registered_at: new Date(),
                    },
                },
            },
            { new: true }
        );

        if (!event) {
            const existingEvent = await SisterEvent.findById(eventId).select('participants.email max_participants is_active');
            if (!existingEvent || !existingEvent.is_active) {
                return res.status(404).json({ error: 'Événement non trouvé' });
            }
            if (existingEvent.participants.some(participant => participant.email === normalizedEmail)) {
                return res.status(400).json({ error: 'Vous êtes déjà inscrit à cet événement' });
            }
            return res.status(400).json({ error: 'Plus de places disponibles' });
        }

        return res.status(200).json({
            success: true,
            message: 'Inscription réussie',
            remaining_places: event.max_participants - event.participants.length
        });

    } catch (error) {
        console.error('Erreur inscription:', error);
        return res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
}
