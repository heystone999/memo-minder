const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const path = require('path');


const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const habitsRouter = require('./controllers/habits');
const dailiesRouter = require('./controllers/dailies');
const todosRouter = require('./controllers/todos');

const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

// set this to 1 if running a jest test
const jest_test = 0
if (jest_test) {
    mongoose.connect("mongodb+srv://stone:helsinki@cluster0.opxsuzi.mongodb.net/testMemo?retryWrites=true&w=majority");
} else {
    mongoose.connect(config.MONGODB_URI);
}

app.use(cors())
app.use(express.json())

// app.use(express.static('build'))
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/habits', habitsRouter);

app.use(middleware.errorHandler)

module.exports = app