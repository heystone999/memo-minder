const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Habit = require('../models/habit');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Existing user credentials
const username = 'testuser_HABITS';
const password = 'password';

let token; // Store the generated JWT token

beforeAll(async () => {
  // Create a new user for testing
  /* const userData = {
    username: 'testuser_HABITS',
    email: 'testuser@example.com',
    password: bcrypt.hashSync('password', 10)
  };

  // Register the user
  await request(app)
    .post('/api/users')
    .send(userData);
  */
  // Send a login request to obtain a JWT token
  const res = await request(app)
    .post('/api/login')
    .send({ username: username, password: password })
    .expect(200);

  // Extract the token from the response body
  token = res.body.token;
});

describe('POST /api/habits', () => {
  beforeEach(async () => {
    // Clear the Habit collection before each test
    await Habit.deleteMany({});
  });

  afterAll(async () => {
    // Close the Mongoose connection after all tests
    await mongoose.disconnect();
  });

  it('should add a new habit', async () => {
    const habitData = {
      title: 'Exercise',
      type: 'positive'
    };

    // Send a POST request to create a new habit with the obtained token
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send(habitData)
      .expect(201);

    // Check response body
    expect(res.body).toHaveProperty('message', 'Habit added successfully');
  });
});