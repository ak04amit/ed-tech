const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(
    (error) => {
      console.error('MongoDB connection error:');
      console.error(error);
      process.exit(1);
    }
  );
};