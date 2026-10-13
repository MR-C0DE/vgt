import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';

const TestimonySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  browserId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TestimonyModel =
  mongoose.models.Testimony || mongoose.model('Testimony', TestimonySchema);

const normalize = (doc) => {
  if (!doc) return null;
  const data = doc.toObject ? doc.toObject() : doc;
  return { ...data, id: data._id?.toString() || data.id };
};

class Testimony {
  static async findAll() {
    await connectToDatabase();
    const testimonies = await TestimonyModel.find().sort({ createdAt: -1 });
    return testimonies.map(normalize);
  }

  static async create({ name, type, browserId }) {
    await connectToDatabase();
    const testimony = await TestimonyModel.create({ name, type, browserId });
    return normalize(testimony);
  }

  static async findById(id) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return normalize(await TestimonyModel.findById(id));
  }

  static async update(id, { name, type }) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return normalize(
      await TestimonyModel.findByIdAndUpdate(
        id,
        { name, type, updatedAt: new Date() },
        { new: true }
      )
    );
  }

  static async delete(id) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return TestimonyModel.findByIdAndDelete(id);
  }
}

export default Testimony;
