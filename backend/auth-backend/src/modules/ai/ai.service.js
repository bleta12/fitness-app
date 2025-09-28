// src/ai/ai.service.js
import AIRepository from "./ai.repo.js"; // note the .js extension

class AIService {
  constructor() {
    this.repo = new AIRepository();
  }

  // Generate a new AI workout (can be called from your /generate route)
  async generateWorkout(options) {
    // If plan is not passed, generate a mock plan (replace with your AI logic)
    const plan = options.plan || `Warm-Up\n5 min jogging\nMain Circuit\n10 squats\n10 push-ups\nCool-Down\nStretching`;

    const workout = {
      title: `${options.focus} Blast`,
      duration: options.duration,
      focus: options.focus,
      intensity: options.intensity,
      equipment: options.equipment,
      plan,
    };

    return this.repo.createWorkout(workout);
  }

  async listWorkouts() {
    return this.repo.getAllWorkouts();
  }

  async getWorkout(id) {
    return this.repo.getWorkoutById(id);
  }

  async deleteWorkout(id) {
    return this.repo.deleteWorkout(id);
  }

  async saveWorkout(workoutData) {
    // Simply pass the data to the repository to create/save it
    return this.repo.createWorkout(workoutData);
  }
}

export default AIService; // ✅ ES Module export
