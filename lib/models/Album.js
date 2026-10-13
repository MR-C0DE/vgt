// models/mongodb/Album.js - ALBUM PHOTO INNOVANT
import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    thumbnail_url: String,
    title: String,
    title_fr: String,
    title_en: String,
    description: String,
    description_fr: String,
    description_en: String,
    tags: [String],
    category: { type: String, enum: ['history', 'events', 'worship', 'fellowship', 'other'], default: 'other' },
    uploaded_by: mongoose.Schema.Types.ObjectId,
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    is_featured: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

const AlbumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    name_fr: String,
    name_en: String,
    description: String,
    cover_image: String,
    photos: [PhotoSchema],
    event_date: Date,
    is_public: { type: Boolean, default: true },
    created_by: mongoose.Schema.Types.ObjectId,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export const Photo = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);
export default mongoose.models.Album || mongoose.model('Album', AlbumSchema);
