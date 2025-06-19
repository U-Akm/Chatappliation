import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    console.log("MongoDB URI:", process.env.MONGODB_CONNECT);
    await mongoose.connect(process.env.MONGODB_CONNECT); // No need to pass options
    console.log("DB connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default dbConnect;
