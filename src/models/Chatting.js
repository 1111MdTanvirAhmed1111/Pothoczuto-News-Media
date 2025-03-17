const mongoose = require('mongoose');
 
const ChattingSchema = new mongoose.Schema({
    from: {type:  mongoose.Schema.Types.ObjectId},
    to: {type:  mongoose.Schema.Types.ObjectId},
    messeges: [
        {
            messeger: {type: String},
            content:  {type: String}
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chatting', ChattingSchema);