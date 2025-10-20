import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { app } from "../src/app.js";
import connectDB from "../src/db/index.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

dotenv.config({
  path: "./.env",
});

let serverInstance;

export default async function handler(req, res) {
  if (!serverInstance) {
    await connectDB();
    serverInstance = app;
  }
  return serverInstance(req, res);
}
