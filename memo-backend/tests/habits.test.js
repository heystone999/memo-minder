const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Habit = require('../models/habit');

describe('POST /api/habits', () => {
  beforeEach(async () => {
    // Clear the Habit collection before each test
    await Habit.deleteMany({});
  });

  afterAll(async () => {
    // Close the Mongoose connection after all tests
    await mongoose.connection.close();
  });

  it('should add a new habit', async () => {
    const habitData = {
      userId: '609c6b415c2c8a001d0d837a',
      title: 'Exercise',
      type: 'positive'
    };

    // Send a POST request to create a new habit
    const res = await request(app)
      .post('/api/habits')
      .send(habitData)
      .expect(201);

    // Check response body
    expect(res.body).toHaveProperty('message', 'Habit added successfully');
    expect(res.body.habit).toMatchObject({
      title: habitData.title,
      type: habitData.type,
      user: habitData.userId // Ensure the correct user ID is assigned
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const habitData = {
      userId: '609c6b415c2c8a001d0d837a', // Assuming a valid user ID
      // Missing title field intentionally
      type: 'positive'
    };

    await request(app)
      .post('/api/habits')
      .send(habitData)
      .expect(400);
  });

  it('should return 400 if invalid habit type is provided', async () => {
    const habitData = {
      userId: '609c6b415c2c8a001d0d837a', // Assuming a valid user ID
      title: 'Exercise',
      type: 'invalid' // Invalid type intentionally
    };

    await request(app)
      .post('/api/habits')
      .send(habitData)
      .expect(400);
  });
});