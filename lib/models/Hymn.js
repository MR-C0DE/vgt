import mongoose from 'mongoose';

const HymnSchema = new mongoose.Schema({
  title_fr: { type: String, trim: true, maxlength: 200, default: '' },
  title_en: { type: String, trim: true, maxlength: 200, default: '' },
  lyrics_fr: { type: String, maxlength: 50000, default: '' },
  lyrics_en: { type: String, maxlength: 50000, default: '' },
  created_by: mongoose.Schema.Types.ObjectId,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

HymnSchema.pre('validate', function validateContent() {
  if (!this.title_fr && !this.title_en) this.invalidate('title_fr', 'Un titre est requis');
  if (!this.lyrics_fr && !this.lyrics_en) this.invalidate('lyrics_fr', 'Les paroles sont requises');
});

export default mongoose.models.Hymn || mongoose.model('Hymn', HymnSchema);
