import mongoose from "mongoose";

const TestimonySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["testimony", "song"], required: true },
  browserId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Testimony || mongoose.model("Testimony", TestimonySchema);
