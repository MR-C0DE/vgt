import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';

const AccompagnantSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    age_category: String,
    contribution: String,
    allergies: String,
    medical_details: String,
  },
  { _id: false }
);

const SafariConfirmationSchema = new mongoose.Schema({
  form_submit_id: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  age_category: { type: String, required: true },
  contribution: String,
  medical_issues: String,
  medical_details: String,
  is_driver: Boolean,
  accompagnant_is_driver: Boolean,
  has_space: Boolean,
  capacity: { type: Number, default: 0 },
  vehicle: String,
  phone: String,
  accompagnants: [AccompagnantSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const SafariConfirmationModel =
  mongoose.models.SafariConfirmation ||
  mongoose.model('SafariConfirmation', SafariConfirmationSchema);

const normalize = (doc) => {
  if (!doc) return null;
  const data = doc.toObject ? doc.toObject() : doc;
  return { ...data, id: data._id?.toString() || data.id };
};

const normalizeAccompagnants = (accompagnants = []) =>
  accompagnants.map((acc) => ({
    first_name: acc.first_name ?? acc.firstName,
    last_name: acc.last_name ?? acc.lastName,
    age_category: acc.age_category ?? acc.ageCategory,
    contribution: acc.contribution,
    allergies: acc.allergies,
    medical_details: acc.medical_details ?? acc.medicalDetails,
  }));

class SafariConfirmation {
  static async getAll() {
    await connectToDatabase();
    const confirmations = await SafariConfirmationModel.find().sort({ created_at: -1 });
    return confirmations.map(normalize);
  }

  static async getById(id) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return normalize(await SafariConfirmationModel.findById(id));
  }

  static async insertParticipant(data) {
    await connectToDatabase();
    const confirmation = await SafariConfirmationModel.create(data);
    return confirmation._id.toString();
  }

  static async insertAccompagnants(participantId, accompagnants) {
    await connectToDatabase();
    if (!accompagnants || accompagnants.length === 0) return null;
    if (!mongoose.Types.ObjectId.isValid(participantId)) return null;

    return SafariConfirmationModel.findByIdAndUpdate(
      participantId,
      {
        $push: { accompagnants: { $each: normalizeAccompagnants(accompagnants) } },
        updated_at: new Date(),
      },
      { new: true }
    );
  }

  static async deleteById(id) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return SafariConfirmationModel.findByIdAndDelete(id);
  }

  static async updateById(id, data) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return SafariConfirmationModel.findByIdAndUpdate(
      id,
      { ...data, updated_at: new Date() },
      { new: true }
    );
  }

  static async deleteAccompagnantsByParticipantId(participantId) {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(participantId)) return null;
    return SafariConfirmationModel.findByIdAndUpdate(
      participantId,
      { accompagnants: [], updated_at: new Date() },
      { new: true }
    );
  }
}

export { SafariConfirmation };
