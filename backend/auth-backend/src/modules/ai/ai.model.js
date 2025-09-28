// src/ai/ai.model.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const workoutSchema = new Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  focus: { type: String, required: true, enum: ["Legs", "Upper Body", "Full Body", "Cardio"] },
  intensity: { type: String, required: true, enum: ["Low", "Medium", "High"] },
  equipment: { type: String, required: true, enum: ["None", "Dumbbells", "Resistance Bands", "Full Gym"] },
  plan: { type: String, required: true },
}, { timestamps: true });

const WorkoutModel = model("Workout", workoutSchema);

export default WorkoutModel; // ✅ ES Module export
