const mongoose = require('mongoose');

// Prefer env, fallback to the expected local database name `grocerydb`
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/grocerydb';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[MongoDB] connected');
  } catch (err) {
    console.error('[MongoDB] connection error:', err.message);
    // Do not throw to allow server to continue running
  }
}

module.exports = { connectDB };
