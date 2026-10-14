// models/mongodb/Album.js - ALBUM PHOTO INNOVANT
import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
    url: { type: String, required: true, maxlength: 2048 },
    thumbnail_url: { type: String, maxlength: 2048 },
    title: { type: String, maxlength: 200 },
    title_fr: { type: String, maxlength: 200 },
    title_en: { type: String, maxlength: 200 },
    description: { type: String, maxlength: 2000 },
    description_fr: { type: String, maxlength: 2000 },
    description_en: { type: String, maxlength: 2000 },
    tags: [String],
    category: { type: String, enum: ['history', 'events', 'worship', 'fellowship', 'other'], default: 'other' },
    uploaded_by: mongoose.Schema.Types.ObjectId,
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    is_featured: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

const AlbumSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 200 },
    name_fr: { type: String, trim: true, maxlength: 200 },
    name_en: { type: String, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 5000 },
    cover_image: { type: String, maxlength: 2048 },
    photos: [PhotoSchema],
    event_date: Date,
    is_public: { type: Boolean, default: true },
    created_by: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export const Photo = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);
export default mongoose.models.Album || mongoose.model('Album', AlbumSchema);
