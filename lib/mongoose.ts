import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGO_URI) {
    return console.log("MONGO_URI not found");
  }

  if (isConnected) {
    return console.log("Already connected to database");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "stack-overflow-clone",
    });

    isConnected = true;
    console.log("Connected to database");
  } catch (err) {
    console.log("Error connecting to database", err);
  }
};
