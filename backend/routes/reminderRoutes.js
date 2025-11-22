import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  addReminder,
  getMyReminders,
  updateReminder,
  deleteReminder,
} from "../controllers/reminderController.js";

const router = express.Router();

// get logged-in user's reminders
router.get("/my-reminders", verifyToken, getMyReminders);

// add reminder
router.post("/add", verifyToken, addReminder);

// update next trigger (snooze)
router.put("/:id", verifyToken, updateReminder);

// delete reminder
router.delete("/:id", verifyToken, deleteReminder);

export default router;
