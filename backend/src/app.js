import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import { v4 as uuidv4 } from "uuid";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

dotenv.config();

// Initialize Express app
const app = express();

// Trust proxy (required for Vercel/Heroku etc)
app.set("trust proxy", 1);

// Add request ID middleware for tracking requests
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    abortOnLimit: true,
    responseOnLimit: "File size limit has been reached (5MB)",
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});
app.use(limiter);

// Routes
app.get("/", (req, res) => {
  res.json({ success: true, message: "Portfolio API is running" });
});

// API routes
app.use("/api/v1", routes);

// 404 handler - must be placed after all routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Error handler - must be the last middleware
app.use(errorHandler);

export { app };
