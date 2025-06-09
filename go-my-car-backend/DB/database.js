const mongoose = require('mongoose');

const db = () => {
  mongoose
    .connect(process.env.MONGODB)
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = db;