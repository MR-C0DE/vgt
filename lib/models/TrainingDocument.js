import mongoose from 'mongoose';

const TrainingDocumentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  category: {
    type: String,
    enum: ['Formation', 'Guide', 'Procédure', 'Référence', 'Autre'],
    default: 'Formation',
  },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  document_url: { type: String, trim: true, maxlength: 2000, default: '' },
  storage_key: { type: String, trim: true, maxlength: 1000, default: '' },
  original_filename: { type: String, trim: true, maxlength: 255, default: '' },
  created_by: mongoose.Schema.Types.ObjectId,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

TrainingDocumentSchema.pre('validate', function validateLocation() {
  if (!this.document_url && !this.storage_key) this.invalidate('document_url', 'Un document est requis');
});

export default mongoose.models.TrainingDocument || mongoose.model('TrainingDocument', TrainingDocumentSchema);
