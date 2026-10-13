// models/mongodb/Event.js
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: Date,
    category: { type: String, enum: ['réunion', 'formation', 'culte', 'autre'], default: 'réunion' },
    location: String,
    leader: String,
    audience: String,
    notes: String,
    allDay: { type: Boolean, default: false },
    browserId: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
