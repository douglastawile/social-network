import mongoose, { connect } from "mongoose";

export const connectionDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.info(`MongoDB Connected on: ${connection.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
