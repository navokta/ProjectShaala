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
      // required: [true, "Password is required"],
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
        enum: ['pending', 'approved', 'rejected'],
        default: null,
      },
      submittedAt: Date,
      reviewedAt: Date,
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
    portfolio: [
      {
        title: String,
        description: String,
        link: String,
        image: String,
      },
    ],
    emailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },

    // 🔐 PASSWORD RESET FIELDS (NEW)
    resetPasswordToken: {
      type: String,
      select: false, // Never return in queries by default
    },
    resetPasswordExpiry: {
      type: Date,
      select: false,
    },

    // 🔐 EMAIL VERIFICATION TOKEN (Bonus - for future use)
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
      select: false,
    },
    // lib/models/User.js – add these fields to the schema
    googleId: {
      type: String,
      sparse: true, // allows multiple users without this field
    },
    githubId: {
      type: String,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

// 🔐 Instance Method: Generate password reset token
userSchema.methods.generateResetToken = function () {
  const crypto = require("crypto");

  // Generate random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token before storing (security best practice)
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiry: 1 hour from now
  this.resetPasswordExpiry = Date.now() + 60 * 60 * 1000;

  // Return unhashed token for email link
  return resetToken;
};

// 🔐 Instance Method: Check if reset token is valid
userSchema.methods.isResetTokenValid = function () {
  return this.resetPasswordExpiry && this.resetPasswordExpiry > Date.now();
};

// 🔐 Instance Method: Clear reset token fields
userSchema.methods.clearResetToken = function () {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpiry = undefined;
};

// ✉️ Instance Method: Generate email verification token (bonus)
userSchema.methods.generateEmailVerificationToken = function () {
  const crypto = require("crypto");

  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // 24 hours expiry
  this.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000;

  return verificationToken;
};

// Remove sensitive data when converting to JSON
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

// 🔐 Pre-save middleware: Clear expired tokens
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

export default mongoose.models.User || mongoose.model("User", userSchema);
