import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(MONGO_URI);
    console.log(`Connected to database: ${connection.connections[0].name}`);
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};

export default connectToDB;