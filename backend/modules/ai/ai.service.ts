import { AIRepository } from "./ai.repo";
import { IWorkout } from "./ai.model";

export class AIService {
  private repo: AIRepository;

  constructor() {
    this.repo = new AIRepository();
  }

  // Generate a new AI workout (can be called from your /generate route)
  async generateWorkout(options: {
    duration: string;
    focus: string;
    intensity: string;
    equipment: string;
    plan?: string; // optional, if you want to pass AI-generated plan from frontend
  }): Promise<IWorkout> {
    // If plan is not passed, generate a mock plan (replace with your Groq AI logic)
    const plan = options.plan || `Warm-Up\n5 min jogging\nMain Circuit\n10 squats\n10 push-ups\nCool-Down\nStretching`;

    const workout: Partial<IWorkout> = {
      title: `${options.focus} Blast`,
      duration: options.duration,
      focus: options.focus as IWorkout["focus"],
      intensity: options.intensity as IWorkout["intensity"],
      equipment: options.equipment as IWorkout["equipment"],
      plan,
    };

    return this.repo.createWorkout(workout);
  }

  async listWorkouts(): Promise<IWorkout[]> {
    return this.repo.getAllWorkouts();
  }

  async getWorkout(id: string): Promise<IWorkout | null> {
    return this.repo.getWorkoutById(id);
  }

  async deleteWorkout(id: string): Promise<void> {
    return this.repo.deleteWorkout(id);
  }
}
