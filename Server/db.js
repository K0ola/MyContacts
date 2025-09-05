const mongoose = require('mongoose');

async function connectDB(uri) {
  mongoose.set('strictQuery', true);

  try {

    await mongoose.connect(uri, {
    });
    console.log('MongoDB good');

  } catch (err) {

    console.error(err.message);
    process.exit(1);

  }
}

module.exports = connectDB;
