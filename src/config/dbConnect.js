const mongoose = require('mongoose');
const dbConnect =  () => {
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');  })
    .catch((err) => console.log(err.message));
}
module.exports = {dbConnect};