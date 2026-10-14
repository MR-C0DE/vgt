// models/mongodb/Announcement.js
import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
    author: { type: String, required: true, trim: true, maxlength: 120 },
    title_fr: { type: String, required: true, trim: true, maxlength: 200 },
    title_en: { type: String, required: true, trim: true, maxlength: 200 },
    content_fr: { type: String, required: true, trim: true, maxlength: 5000 },
    content_en: { type: String, required: true, trim: true, maxlength: 5000 },
    date: { type: Date, required: true },
    is_active: { type: Boolean, default: true },
    image_url: { type: String, maxlength: 2048 },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
