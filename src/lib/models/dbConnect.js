import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

export async function connectDB() {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}