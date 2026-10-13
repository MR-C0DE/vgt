import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    currency: { type: String, default: 'CAD' },
    donor_name: String,
    donor_email: String,
    is_anonymous: { type: Boolean, default: false },
    category: { type: String, enum: ['tithe', 'offering', 'building', 'missions'], default: 'offering' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transaction_id: String,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
