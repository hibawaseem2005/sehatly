import Reminder from "../models/Reminder.js"; // your Mongoose model

export const getMyReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.userId }).sort({ nextTrigger: 1 });
    res.json(reminders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addReminder = async (req, res) => {
  try {
    const { medicine, timeValue, timeUnit, nextTrigger } = req.body;

    const newReminder = new Reminder({
      medicine,
      timeValue,
      timeUnit,
      nextTrigger,
      user: req.user.userId, // attach logged-in user
    });

    await newReminder.save();
    res.json(newReminder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { nextTrigger } = req.body;
    const updated = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { nextTrigger },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    res.json({ message: "Reminder deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
