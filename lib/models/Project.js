// lib/models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // Buyer Information
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false, // Hide from public queries
    },
    buyerName: {
      type: String,
      required: true,
      trim: true,
    },
    buyerEmail: {
      type: String,
      required: true,
      trim: true,
    },

    // Project Details
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Mobile App",
        "UI/UX Design",
        "Backend/API",
        "Database",
        "DevOps",
        "AI/ML",
        "Blockchain",
        "Other",
      ],
    },
    skills: {
      type: [String],
      required: true,
      validate: [(val) => val.length > 0, "At least one skill is required"],
    },

    // Budget & Timeline
    budgetType: {
      type: String,
      required: true,
      enum: ["fixed", "hourly"],
      default: "fixed",
    },
    budgetMin: {
      type: Number,
      required: [true, "Minimum budget is required"],
      min: [1000, "Minimum budget must be at least ₹1,000"],
    },
    budgetMax: {
      type: Number,
      required: [true, "Maximum budget is required"],
      min: [1000, "Maximum budget must be at least ₹1,000"],
      validate: [
        function (val) {
          if (this.budgetType === "fixed") {
            return val >= this.budgetMin;
          }
          return true;
        },
        "Maximum budget must be greater than minimum",
      ],
    },
    hourlyRate: {
      type: Number,
      min: [100, "Hourly rate must be at least ₹100"],
    },
    timeline: {
      type: String,
      required: true,
      enum: [
        "Less than 1 week",
        "1-2 weeks",
        "2-4 weeks",
        "1-2 months",
        "2+ months",
      ],
    },

    // Requirements & Features
    requirements: {
      type: [String],
      required: true,
      validate: [(val) => val.length > 0, "At least one requirement is needed"],
    },
    deliverables: {
      type: [String],
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Expert"],
      default: "Intermediate",
    },
    projectType: {
      type: String,
      required: true,
      enum: ["One-time project", "Ongoing collaboration", "Contract to hire"],
      default: "One-time project",
    },

    // Status & Visibility
    status: {
      type: String,
      enum: [
        "draft",
        "open",
        "in-progress",
        "completed",
        "cancelled",
        "closed",
      ],
      default: "open",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    featured: {
      type: Boolean,
      default: false,
    },

    // Bids & Engagement
    bidCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    selectedBid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
      default: null,
    },

    // Attachments
    attachments: {
      type: [String], // Cloudinary URLs
      default: [],
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
projectSchema.index({ buyer: 1, createdAt: -1 });
projectSchema.index({ status: 1, category: 1 });
projectSchema.index({ skills: 1 });
projectSchema.index({ title: "text", description: "text" });

// Update updatedAt on save
projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for budget display
projectSchema.virtual("budgetDisplay").get(function () {
  if (this.budgetType === "hourly") {
    return `₹${this.hourlyRate}/hr`;
  }
  return `₹${this.budgetMin.toLocaleString()} - ₹${this.budgetMax.toLocaleString()}`;
});

// Virtual for age
projectSchema.virtual("age").get(function () {
  const days = Math.floor(
    (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24),
  );
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
});

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
