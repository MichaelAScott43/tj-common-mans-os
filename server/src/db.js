const mongoose = require('mongoose');

let dbReady = false;

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set. Using in-memory TJ store.');
    return { connected: false };
  }

  if (dbReady) return { connected: true };

  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB || 'steady'
  });
  dbReady = true;
  console.log('Connected to MongoDB Atlas.');
  return { connected: true };
}

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDatabase, isDatabaseConnected };
