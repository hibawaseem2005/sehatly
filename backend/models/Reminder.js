import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  medicine: { type: String, required: true },
  timeValue: { type: Number, required: true },
  timeUnit: { type: String, enum: ["hours", "minutes"], required: true },
  nextTrigger: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Reminder", reminderSchema);
