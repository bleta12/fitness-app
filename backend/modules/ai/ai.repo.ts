import { WorkoutModel, IWorkout } from "./ai.model";

export class AIRepository {
  async createWorkout(workoutData: Partial<IWorkout>): Promise<IWorkout> {
    const workout = new WorkoutModel(workoutData);
    return workout.save();
  }

  async getAllWorkouts(): Promise<IWorkout[]> {
    return WorkoutModel.find().sort({ createdAt: -1 }).exec();
  }

  async getWorkoutById(id: string): Promise<IWorkout | null> {
    return WorkoutModel.findById(id).exec();
  }

  async deleteWorkout(id: string): Promise<void> {
    await WorkoutModel.findByIdAndDelete(id).exec();
  }
}
