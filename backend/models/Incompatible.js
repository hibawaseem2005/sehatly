import mongoose from "mongoose";

const incompatibleSchema = new mongoose.Schema({
  drugA: { type: String, required: true },
  drugB: { type: String, required: true }
});

export default mongoose.model("Incompatible", incompatibleSchema);
