import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {});

    connection.isConnected = db.connections[0].readyState;

    console.log("Connected to database successfully");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
};

export default dbConnect;
