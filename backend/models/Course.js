const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    instructor: { type: String, default: 'TBA' },
    credits: { type: Number, default: 3 },
    capacity: { type: Number, default: 30 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', code: 'text', description: 'text', instructor: 'text' });

module.exports = mongoose.model('Course', courseSchema);
