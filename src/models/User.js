const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user','writer', 'admin'], default: 'user' },


  ProfilePic: {type:String, default: ""},
  CoverPic: {type:String, default: ""},

  friends: [
    {   _id: {type:  mongoose.Schema.Types.ObjectId},}
  ]
});

module.exports = mongoose.model('User', userSchema);