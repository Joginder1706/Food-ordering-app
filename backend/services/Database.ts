import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export default async () => {
  mongoose.connect(MONGO_URI);
  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
  });
};
