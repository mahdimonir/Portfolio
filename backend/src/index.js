import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error: ", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`⚙️ Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MongooDB connection failed !!! ", err);
  });
