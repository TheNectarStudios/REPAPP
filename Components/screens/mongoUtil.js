import mongoose from 'mongoose';

const uri = 'mongodb+srv://nepalsss008:TheCreator@cluster0.jay2vcd.mongodb.net/test';

let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedDb = mongoose.connection;
    console.log('Connected to MongoDB');

    return cachedDb;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default connectToDatabase;
