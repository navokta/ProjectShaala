// models/Project.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: [{
    type: String,
    required: true,
  }],
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '/placeholder-project.jpg',
  },
  rating: {
    type: Number,
    default: 0,
  },
  seller: {
    type: String,
    required: true,
  },
  license: {
    type: String,
    default: 'MIT',
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;