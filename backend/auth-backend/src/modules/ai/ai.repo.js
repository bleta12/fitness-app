import WorkoutModel from "./ai.model.js"; // note the .js extension

class AIRepository {
  async createWorkout(workoutData) {
    const workout = new WorkoutModel(workoutData);
    return workout.save();
  }

  async getAllWorkouts() {
    return WorkoutModel.find().sort({ createdAt: -1 }).exec();
  }

  async getWorkoutById(id) {
    return WorkoutModel.findById(id).exec();
  }

  async deleteWorkout(id) {
    await WorkoutModel.findByIdAndDelete(id).exec();
  }
}

export default AIRepository; // ✅ ES Module export
