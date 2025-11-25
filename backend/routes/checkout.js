import express from "express";
import Incompatible from "../models/Incompatible.js";

const router = express.Router();

router.post("/check", async (req, res) => {
  try {
    const { cart } = req.body; // cart = ["Panadol", "Ibuprofen", "Vitamin C"]

    let warnings = [];

    // Check all pairs
    for (let i = 0; i < cart.length; i++) {
      for (let j = i + 1; j < cart.length; j++) {
        const drugA = cart[i];
        const drugB = cart[j];

        const exists = await Incompatible.findOne({
          $or: [
            { drugA, drugB },
            { drugA: drugB, drugB: drugA }
          ]
        });

        if (exists) warnings.push([drugA, drugB]);
      }
    }

    res.json({
      unsafe: warnings.length > 0,
      warnings
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
