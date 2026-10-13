import mongoose from 'mongoose';

const SisterEventSchema = new mongoose.Schema({
    title: { type: String, default: '' },  // Plus requis
    title_fr: { type: String, required: true },  // Requis
    title_en: String,
    start: { type: Date, required: true },
    end: Date,
    location: String,
    description: String,
    description_fr: String,
    description_en: String,
    organizer: String,
    max_participants: { type: Number, default: 50 },
    participants: [{
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        registered_at: { type: Date, default: Date.now }
    }],
    is_active: { type: Boolean, default: true },
    created_by: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.models.SisterEvent || mongoose.model('SisterEvent', SisterEventSchema);
