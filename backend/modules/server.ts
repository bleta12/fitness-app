// src/server.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import aiRouter from "./ai/ai.resource";

const app = express();

// Middleware
app.use(express.json());

// Enable CORS for frontend (adjust origin if needed)
app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
}));

// Routes
app.use("/api/ai", aiRouter);

// Connect to MongoDB Atlas
mongoose.connect(
  "mongodb+srv://bletemorina_db_fitnes:SyljC456mAsdm3vV@cluster0.u03sheh.mongodb.net/fitness-app?retryWrites=true&w=majority"
)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
