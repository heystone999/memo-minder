const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Habit = require('../models/habit');


// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
      return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
      const decoded = jwt.verify(token, process.env.SECRET); // Use process.env.SECRET
      req.user = decoded; // Attach user information to request object
      next(); // Move to the next middleware
  } catch (error) {
      return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, note, type } = req.body;
    const userId = req.user.id;

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

// Route to fetch all habits for a specific user
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
    // Find all habits for the specified user
    const habits = await Habit.find({ user: userId });
    res.status(200).json({ habits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a habit
router.delete('/:habitId', verifyToken, async (req, res) => {
  try {
      const habitId = req.params.habitId;
      const userId = req.user.id; // Extract user ID from token

      // Ensure that the requested habit belongs to the authenticated user
      const habit = await Habit.findOne({ _id: habitId, user: userId });
      if (!habit) {
          return res.status(404).json({ message: 'Habit not found' });
      }

      // Delete the habit
      await Habit.findByIdAndDelete(habitId);
      res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to increment the positive counter for a habit
router.put('/:habitId/increment/positive', verifyToken, async (req, res) => {
  try {
    const habitId = req.params.habitId;
    const userId = req.user.id;

    // Find the habit and ensure it belongs to the authenticated user
    const habit = await Habit.findOne({ _id: habitId, user: userId });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Increment the positive counter
    habit.positiveCount += 1;
    await habit.save();

    res.status(200).json({ message: 'Positive counter incremented successfully', habit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to increment the negative counter for a habit
router.put('/:habitId/increment/negative', verifyToken, async (req, res) => {
  try {
    const habitId = req.params.habitId;
    const userId = req.user.id;

    // Find the habit and ensure it belongs to the authenticated user
    const habit = await Habit.findOne({ _id: habitId, user: userId });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Increment the negative counter
    habit.negativeCount += 1;
    await habit.save();

    res.status(200).json({ message: 'Negative counter incremented successfully', habit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;