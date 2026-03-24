// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"], // ✅ Uncommented for regular auth
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      trim: true,
    },
    address: String,
    headline: String,
    role: {
      type: String,
      enum: ["buyer", "developer", "admin", "owner"],
      default: "buyer",
    },
    // Developer application data
    developerApplication: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: null,
      },
      submittedAt: Date,
      reviewedAt: Date,
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      // Application details
      githubProfile: String,
      portfolioLink: String,
      topProjects: [String], // array of project URLs/links
      skills: [String],
      bio: String,
    },

    // For owner to manage admins (not needed in user schema, but we'll keep role)
    avatar: {
      type: String,
      default: "",
    },
    bio: String,
    skills: [String],
    // Portfolio items
    portfolio: [
      {
        title: { type: String },
        description: { type: String },
        link: { type: String },
        image: { type: String }, // Cloudinary URL
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // Social links
    social: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    // Profile views count (for analytics)
    profileViews: { type: Number, default: 0 },

    // Additional stats (could be computed, but we can store for performance)
    completedProjects: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },

    // 🔐 PASSWORD RESET FIELDS
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpiry: {
      type: Date,
      select: false,
    },

    // 🔐 EMAIL VERIFICATION FIELDS
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
      select: false,
    },

    // 🔐 SOCIAL AUTH FIELDS
    googleId: {
      type: String,
      sparse: true,
    },
    githubId: {
      type: String,
      sparse: true,
    },
    // Add to existing schema
    title: { type: String, default: '' },
    location: { type: String, default: '' },
    hourlyRate: { type: Number, default: 0 },
    availability: { type: Boolean, default: true },
    // Add to userSchema
  // Privacy settings – which fields are public
  privacySettings: {
    type: Map,
    of: Boolean,
    default: {
      name: true,
      avatar: true,
      title: true,
      location: true,
      hourlyRate: true,
      availability: true,
      bio: true,
      skills: true,
      portfolio: true,
      social: true,
      stats: true,
    },
  },
  // Follow system
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  },
);

// ============================================================================
// 🔐 INSTANCE METHODS
// ============================================================================

// Generate password reset token
userSchema.methods.generateResetToken = function () {
  const crypto = require("crypto");
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

  return resetToken;
};

// Check if reset token is valid
userSchema.methods.isResetTokenValid = function () {
  return this.resetPasswordExpiry && this.resetPasswordExpiry > Date.now();
};

// Clear password reset token fields
userSchema.methods.clearResetToken = function () {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpiry = undefined;
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const crypto = require("crypto");
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// ✅ NEW: Clear email verification token fields (FIXES THE ERROR!)
userSchema.methods.clearVerificationToken = function () {
  this.emailVerificationToken = undefined;
  this.emailVerificationExpiry = undefined;
};

// ============================================================================
// 🔐 JSON TRANSFORM (Hide sensitive fields)
// ============================================================================
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpiry;
    delete ret.emailVerificationToken;
    delete ret.emailVerificationExpiry;
    delete ret.__v;
    return ret;
  },
});

// ============================================================================
// 🔐 PRE-SAVE MIDDLEWARE (Auto-clear expired tokens)
// ============================================================================
userSchema.pre("save", function (next) {
  // Clear expired reset token
  if (this.resetPasswordExpiry && this.resetPasswordExpiry < Date.now()) {
    this.resetPasswordToken = undefined;
    this.resetPasswordExpiry = undefined;
  }

  // Clear expired email verification token
  if (
    this.emailVerificationExpiry &&
    this.emailVerificationExpiry < Date.now()
  ) {
    this.emailVerificationToken = undefined;
    this.emailVerificationExpiry = undefined;
  }

  next();
});

// ============================================================================
// ✅ EXPORT MODEL
// ============================================================================
export default mongoose.models.User || mongoose.model("User", userSchema);
