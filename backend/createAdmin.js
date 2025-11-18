import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

const createAdmin = async () => {
  try {
    await User.deleteOne({ email: "admin@gmail.com" });
    console.log("Old admin (if any) removed.");

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = new User({
      name: "Main Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ NEW ADMIN CREATED SUCCESSFULLY!");
    console.log("Email: admin@gmail.com");
    console.log("Password: Admin@123");

    mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
};

createAdmin();
