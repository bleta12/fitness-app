import { Schema, model, Document } from "mongoose";

export interface IWorkout extends Document {
  title: string;
  duration: string;
  focus: "Legs" | "Upper Body" | "Full Body" | "Cardio";
  intensity: "Low" | "Medium" | "High";
  equipment: "None" | "Dumbbells" | "Resistance Bands" | "Full Gym";
  plan: string;
  createdAt: Date;
}

const workoutSchema = new Schema<IWorkout>({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  focus: { type: String, required: true },
  intensity: { type: String, required: true },
  equipment: { type: String, required: true },
  plan: { type: String, required: true },
}, { timestamps: true });

export const WorkoutModel = model<IWorkout>("Workout", workoutSchema);
