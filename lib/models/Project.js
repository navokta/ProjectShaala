import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    deadline: Date,
    skillsRequired: [String],
    category: String,
    attachments: [String], // Cloudinary URLs
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },
    hiredDeveloper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', projectSchema);