import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  telephone: String,
  objet: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  state: { type: String, enum: ['read', 'no-read'], default: 'no-read' },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
