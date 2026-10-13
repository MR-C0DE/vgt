import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';

const ContributionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contribution: { type: String, required: true },
  browserId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ContributionModel =
  mongoose.models.Contribution || mongoose.model('Contribution', ContributionSchema);

const normalize = (doc) => {
  if (!doc) return null;
  const data = doc.toObject ? doc.toObject() : doc;
  return { ...data, id: data._id?.toString() || data.id };
};

class Contribution {
  static async findAll() {
    await connectToDatabase();
    const contributions = await ContributionModel.find().sort({ createdAt: -1 });
    return contributions.map(normalize);
  }

  static async create({ name, contribution, browserId }) {
    await connectToDatabase();
    const item = await ContributionModel.create({ name, contribution, browserId });
    return normalize(item);
  }

  static async findById(id) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return normalize(await ContributionModel.findById(id));
  }

  static async update(id, { name, contribution }) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return normalize(
      await ContributionModel.findByIdAndUpdate(
        id,
        { name, contribution, updatedAt: new Date() },
        { new: true }
      )
    );
  }

  static async delete(id) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return ContributionModel.findByIdAndDelete(id);
  }
}

export default Contribution;
