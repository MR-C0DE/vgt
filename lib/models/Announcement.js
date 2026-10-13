// models/mongodb/Announcement.js
import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
    author: { type: String, required: true },
    title_fr: { type: String, required: true },
    title_en: { type: String, required: true },
    content_fr: { type: String, required: true },
    content_en: { type: String, required: true },
    date: { type: Date, required: true },
    is_active: { type: Boolean, default: true },
    image_url: String, // Nouveau champ pour les images
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
