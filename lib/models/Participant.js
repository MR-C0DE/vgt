import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';

const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adults: { type: Number, required: true },
  children: { type: Number, required: true },
  browserId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ParticipantModel =
  mongoose.models.Participant || mongoose.model('Participant', ParticipantSchema);

const normalize = (doc) => {
  if (!doc) return null;
  const data = doc.toObject ? doc.toObject() : doc;
  return { ...data, id: data._id?.toString() || data.id };
};

class Participant {
  static async findAll() {
    await connectToDatabase();
    const participants = await ParticipantModel.find().sort({ createdAt: -1 });
    return participants.map(normalize);
  }

  static async create({ name, adults, children, browserId }) {
    await connectToDatabase();
    const participant = await ParticipantModel.create({ name, adults, children, browserId });
    return normalize(participant);
  }

  static async findById(id) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return normalize(await ParticipantModel.findById(id));
  }

  static async update(id, { name, adults, children }) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return normalize(
      await ParticipantModel.findByIdAndUpdate(
        id,
        { name, adults, children, updatedAt: new Date() },
        { new: true }
      )
    );
  }

  static async delete(id) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return ParticipantModel.findByIdAndDelete(id);
  }
}

export default Participant;
