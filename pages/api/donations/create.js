import { connectToDatabase } from '@/lib/mongodb';
import Donation from '@/lib/models/Donation';
import { enforceRateLimit } from '@/utils/rateLimit';

export default async function handler(req, res) {
    if (!enforceRateLimit(req, res, { name: 'donation', limit: 10, windowMs: 10 * 60_000 })) return;
    await connectToDatabase();

    if (req.method === 'POST') {
        const { amount, donor_name, donor_email, is_anonymous, category } = req.body;

        const normalizedAmount = Number(amount);
        if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0 || normalizedAmount > 100000) {
            return res.status(400).json({ error: 'Montant invalide' });
        }

        const donation = await Donation.create({
            amount: normalizedAmount,
            donor_name,
            donor_email,
            is_anonymous,
            category,
            // Un paiement ne doit être marqué comme terminé qu'après confirmation
            // signée par le prestataire de paiement.
            status: 'pending'
        });

        return res.status(201).json({ success: true, donation });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
}
