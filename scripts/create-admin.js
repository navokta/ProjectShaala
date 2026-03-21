// scripts/create-admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables from .env.local (adjust path if needed)
dotenv.config({ path: '.env.local' });

// Import the User model
// You need to adjust the path to your User model
const User = require('../lib/models/User').default;

async function createAdminOrOwner() {
  // Parse command line arguments: email and role
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node scripts/create-admin.js <email> <role>');
    console.error('Role can be "admin" or "owner"');
    process.exit(1);
  }

  const email = args[0];
  const role = args[1].toLowerCase();

  if (role !== 'admin' && role !== 'owner') {
    console.error('Role must be "admin" or "owner"');
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not found in environment. Make sure .env.local is loaded.');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      // Update role
      user.role = role;
      await user.save();
      console.log(`User ${email} updated to role: ${role}`);
    } else {
      // Create new user
      // Generate a simple password (you can change it or prompt)
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Create a username from email (remove special chars)
      let username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
      // Ensure uniqueness if needed (simplified)
      const existing = await User.findOne({ username });
      if (existing) {
        username = username + '_' + Math.random().toString(36).substring(2, 6);
      }

      user = new User({
        name: email.split('@')[0], // temporary name
        email,
        username,
        password: hashedPassword,
        role,
        emailVerified: true,
      });
      await user.save();
      console.log(`New user created with email ${email} and role ${role}`);
      console.log(`Password: ${randomPassword} (please change after login)`);
    }
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdminOrOwner();