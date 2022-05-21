const mongoose = require('mongoose')

const LikesSchema = new mongoose.Schema({

  userGuid : {
      type : String,
      required: true
  },
  projectGuid : {
      type : String,
      required: true
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Likes', LikesSchema);
