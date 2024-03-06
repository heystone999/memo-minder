const supertest = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

describe('Login endpoint', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password', 10);
    const user = new User({
      username: 'testuser',
      passwordHash: passwordHash,
      email: 'testemail@mail.com'
    });
    await user.save();
  });

  test('Login with correct credentials should return a token', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.token).toBeDefined();
    expect(response.body.username).toBe('testuser');
    expect(response.body.email).toBe('testemail@mail.com');
  });

  test('Login with incorrect credentials should return 401', async () => {
    await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'wrongpassword' })
      .expect(401)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(async () => {
  // Clean up after testing
  await User.deleteMany({});
});
