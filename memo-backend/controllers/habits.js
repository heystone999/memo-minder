const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Habit = require('../models/habit');

router.post('/', async (req, res) => {
  try {
    const { userId, title, note, type } = req.body;

    // Validate input
    if (!userId || !title || !type) {
      return res.status(400).json({ message: 'userId, title, and type are required' });
    }

    // Check if the type is valid
    const validTypes = ['positive', 'negative', 'both', 'neutral'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid habit type' });
    }

    // Create the habit object
    const habit = new Habit({
        title,
        type,
        user: userId
    });
    // Add optional note if provided
    if (note) {
        habit.note = note;
    }
    // Save the habit object to the database
    await habit.save();

    res.status(201).json({ message: 'Habit added successfully', habit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;