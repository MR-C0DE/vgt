import mongoose from "mongoose";

const ContributionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contribution: { type: String, required: true },
  browserId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Contribution || mongoose.model("Contribution", ContributionSchema);
