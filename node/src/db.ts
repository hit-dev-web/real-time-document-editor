// src/db.ts
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/practical_demo'; // Replace with your actual MongoDB URI

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, );
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};
