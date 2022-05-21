const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  UserType: {
    type: String,
    required: true,
  },
  UserName: {
    type: String,
    required: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  ProjectName: {
    type: String,
  },
  CollegeName:{
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
