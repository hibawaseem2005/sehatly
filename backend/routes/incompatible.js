import express from "express";
import Incompatible from "../models/Incompatible.js";

const router = express.Router();
console.log("✅ Incompatible routes loaded");

router.post("/add", async (req, res) => {
  try {
    const { drugA, drugB } = req.body;
    const pair = await Incompatible.create({ drugA, drugB });
    res.json({ message: "Pair added", pair });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/check", async (req, res) => {
  const { medicines } = req.body;

  // get all incompatible pairs
  const allPairs = await Incompatible.find();

  let conflictPairs = [];

  for (let i = 0; i < medicines.length; i++) {
    for (let j = i + 1; j < medicines.length; j++) {
      const a = medicines[i];
      const b = medicines[j];

      const found = allPairs.find(
        (p) =>
          (p.drugA === a && p.drugB === b) ||
          (p.drugA === b && p.drugB === a)
      );

      if (found) conflictPairs.push([a, b]);
    }
  }

  if (conflictPairs.length > 0) {
    return res.json({ conflict: true, pairs: conflictPairs });
  }

  res.json({ conflict: false });
});
// Get all existing conflicts
router.get("/all", async (req, res) => {
  try {
    const pairs = await Incompatible.find();
    res.json({ success: true, pairs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
