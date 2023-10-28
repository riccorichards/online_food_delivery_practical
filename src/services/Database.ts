import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export default async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB is connedted");
  } catch (error: any) {
    console.log("Error during connection", error.message);
  }
};
