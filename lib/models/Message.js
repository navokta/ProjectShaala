import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional now that we have conversationId
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Delete the cached model to prevent old schema validation issues in Dev
if (mongoose.models.Message) {
  delete mongoose.models.Message;
}

export default mongoose.model('Message', messageSchema);