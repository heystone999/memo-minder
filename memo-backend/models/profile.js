const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  health: {
    type: Number,
  },
  level: {
    type: Number,
  },
  coin: {
    type: Number,
  },
})


profileSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Profile = mongoose.model('Profile', profileSchema)
module.exports = Profile