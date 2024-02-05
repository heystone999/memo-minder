const User = require('../models/userModel');

class UserService {
  constructor() {
    this.users = [];
  }

  addUser(username, password) {
    const user = new User(username, password);
    this.users.push(user);
    return user;
  }

  findUser(username) {
    return this.users.find(user => user.username === username);
  }
}

module.exports = new UserService();
