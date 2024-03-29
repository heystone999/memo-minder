const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)
const mongoose = require('mongoose');

describe('User endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /api/users returns all users', async () => {
    await User.create({ username: 'user1', email: '123456@qq.com', passwordHash: 'hashedPassword' })

    const response = await api.get('/api/users').expect(200).expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(1)
  })

  test('POST /api/users creates a new user', async () => {
    const newUser = {
      username: 'newuser',
      email: 'newemail@mail.com',
      password: 'newpassword'
    }

    const response = await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

    expect(response.body.username).toBe(newUser.username)
    expect(response.body.email).toBe(newUser.email)

    const users = await User.find({})
    expect(users).toHaveLength(1)
    expect(users[0].username).toBe(newUser.username)

    const passwordMatches = await bcrypt.compare(newUser.password, users[0].passwordHash)
    expect(passwordMatches).toBe(true)
  })

  test('POST /api/users returns 400 if username is less than 3 characters', async () => {
    const newUser = { username: 'us', email: '123456@qq.com', password: 'password' }

    await api.post('/api/users').send(newUser).expect(400)
  })

  test('POST /api/users returns 400 if password is less than 3 characters', async () => {
    const newUser = { username: 'validusername', email: '123456@qq.com', password: 'pw' }

    await api.post('/api/users').send(newUser).expect(400)
  })


})
