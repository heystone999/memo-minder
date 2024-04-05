const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const Habit = require('../models/habit');
const api = supertest(app)
const mongoose = require('mongoose');

describe('Habit routes', () => {
  let token;

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeAll(async () => {
    const userData = {
      email: "18yp18@queensu.ca",
      password: "123123123",
      username: "testjude"
    };
    const response_re = await api
    .post('/api/users')
    .send(userData)
    .expect(201)
    .expect('Content-Type', /application\/json/);

    // Making a POST request to the login route to obtain a JWT token
    const response = await api
      .post('/api/login')
      .send(userData)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    // Extracting the token from the response body
    token = response.body.token;
    console.log(response.status);
  });


  // Now you can use the obtained token to authenticate requests to your habits routes
  it('should add a new habit for the authenticated user', async () => {
    const newHabitData = {
      title: 'Exercise',
      note: "do exercise",
      type: 'positive'
    };
    console.log(token);
    // Making a POST request to add a new habit, authenticated with the obtained token
    const response = await api
      .post('/api/habits')
      .set('Authorization', `${token}`)
      .send(newHabitData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Habit added successfully');
    expect(response.body.habit.title).toBe('Exercise');
    expect(response.body.habit.type).toBe('positive');
  });

  // Test GET /api/habits/user/:userId
  it('should fetch all habits for a specific user', async () => {
    const userId = 'user123'; // Replace with actual user ID

    const response = await api
      .get(`/api/habits/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.habits).toBeDefined();
    expect(response.body.habits.length).toBeGreaterThan(0);
  });

  // Test PUT /api/habits/:habitId
  it('should modify an existing habit', async () => {
    const habitId = 'habit123'; // Replace with actual habit ID
    const habitData = {
      title: 'New Habit Title',
      note: 'Updated notes about the habit',
    };

    const response = await api
      .put(`/api/habits/${habitId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(habitData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Habit modified successfully');
    expect(response.body.habit.title).toBe('New Habit Title');
    expect(response.body.habit.note).toBe('Updated notes about the habit');
  });

  // Test DELETE /api/habits/:habitId
  it('should delete an existing habit', async () => {
    const habitId = 'habit123'; // Replace with actual habit ID

    const response = await api
      .delete(`/api/habits/${habitId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Habit deleted successfully');
  });
});