const userService = require('../services/userService');

class UserController {
  register(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username and pwd cannot be null' });
    }

    if (userService.findUser(username)) {
      return res.status(400).json({ error: 'username has existed' });
    }

    const newUser = userService.addUser(username, password);
    res.json({ message: 'register successfully', user: newUser });
  }

  login(req, res) {
    const { username, password } = req.body;
    const user = userService.findUser(username);

    if (user && user.password === password) {
      res.json({ message: 'login successfully', user });
    } else {
      res.status(401).json({ error: 'username or pwd wrong' });
    }
  }
}

module.exports = new UserController();
