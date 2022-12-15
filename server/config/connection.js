const mongoose = require('mongoose');

//connect to DB using either MONGODB_URI or local host url 
// mongoose.set('debug', true);
// mongoose.set('strictQuery', true);


mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/book-search', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

module.exports = mongoose.connection;
