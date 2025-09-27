import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adults: { type: Number, required: true },
  children: { type: Number, required: true },
  browserId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Participant || mongoose.model("Participant", ParticipantSchema);
