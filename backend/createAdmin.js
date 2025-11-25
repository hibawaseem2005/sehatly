import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import dotenv from "dotenv";
dotenv.config();

// Get command-line arguments
// Usage: node createAdmin.js email@example.com Password123 "Admin Name"
const [,, email, password, name] = process.argv;

if (!email || !password || !name) {
  console.log("Usage: node createAdmin.js <email> <password> <name>");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });

const createAdmin = async () => {
  try {
    // Check if an admin with this email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`⚠️ Admin with email "${email}" already exists.`);
      return mongoose.connection.close();
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("✅ NEW ADMIN CREATED SUCCESSFULLY!");
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
