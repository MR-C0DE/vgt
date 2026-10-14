import mongoose from 'mongoose';

const SisterEventSchema = new mongoose.Schema({
    title: { type: String, default: '', trim: true, maxlength: 200 },
    title_fr: { type: String, required: true, trim: true, maxlength: 200 },
    title_en: { type: String, trim: true, maxlength: 200 },
    start: { type: Date, required: true },
    end: Date,
    location: { type: String, trim: true, maxlength: 300 },
    description: { type: String, trim: true, maxlength: 5000 },
    description_fr: { type: String, trim: true, maxlength: 5000 },
    description_en: { type: String, trim: true, maxlength: 5000 },
    organizer: { type: String, trim: true, maxlength: 150 },
    max_participants: { type: Number, min: 1, max: 1000, default: 50 },
    participants: [{
        name: { type: String, required: true, trim: true, maxlength: 200 },
        email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
        phone: { type: String, trim: true, maxlength: 40 },
        registered_at: { type: Date, default: Date.now }
    }],
    is_active: { type: Boolean, default: true },
    created_by: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.models.SisterEvent || mongoose.model('SisterEvent', SisterEventSchema);
