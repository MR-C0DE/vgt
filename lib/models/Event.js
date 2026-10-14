// models/mongodb/Event.js
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    start: { type: Date, required: true },
    end: Date,
    category: { type: String, enum: ['réunion', 'formation', 'culte', 'autre'], default: 'réunion' },
    location: { type: String, trim: true, maxlength: 300 },
    leader: { type: String, trim: true, maxlength: 150 },
    audience: { type: String, trim: true, maxlength: 150 },
    notes: { type: String, trim: true, maxlength: 5000 },
    allDay: { type: Boolean, default: false },
    browserId: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
