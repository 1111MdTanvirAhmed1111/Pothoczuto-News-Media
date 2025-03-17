const { default: mongoose } = require("mongoose");


const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: String,
  imageUrl: {
    type: String,
    default: null
  },
  category: String,
  date: { type: Date, default: Date.now },
  
});
module.exports = new mongoose.model('Post', PostSchema);


