import mongoose from "mongoose";

/**
 * Connect to MongoDB using a provided URI
 * @param uri MongoDB connection string
 */
const dbConfig = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default dbConfig;
