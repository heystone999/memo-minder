const mongoose = require('mongoose')

module.exports = () => {
  // process.exit(0)
  mongoose.connection.close();
}
