import Navbar from "@/components/Navbar";
import React, { useState, useEffect, type ChangeEvent } from "react";
import AIHandling from "./AIHandling";

// Workout interface
export interface Workout {
  _id?: string; // MongoDB ID
  id?: string;  // Temporary ID for client preview
  title: string;
  duration: string;
  focus: string;
  intensity: string;
  equipment: string;
  plan: string;
}

// Icons
export const BoltIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
export const DumbbellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="m6.5 6.5 11 11" />
    <path d="m21 21-1-1" />
    <path d="m3 3 1 1" />
    <path d="m18 22 4-4" />
    <path d="m2 6 4-4" />
    <path d="m3 10 7-7" />
    <path d="M14 21l7-7" />
  </svg>
);
export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Card colors
const cardColors: Record<string, string> = {
  "Legs": "from-purple-500 to-indigo-600",
  "Upper Body": "from-red-500 to-pink-600",
  "Full Body": "from-green-500 to-teal-600",
  "Cardio": "from-yellow-500 to-orange-600",
};

// WorkoutCard component
const WorkoutCard = ({ workout, onClick }: { workout: Workout, onClick: () => void }) => (
  <div
    className={`rounded-xl shadow-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] border border-gray-200 bg-gradient-to-br ${cardColors[workout.focus] || 'from-gray-300 to-gray-400'} text-white`}
    onClick={onClick}
  >
    <h3 className="text-xl font-bold">{workout.title}</h3>
    <p className="mt-2 text-sm opacity-90">
      <span className="font-semibold">{workout.duration} min</span> | {workout.focus} | {workout.intensity}
    </p>
  </div>
);

// WorkoutDetailModal component
const WorkoutDetailModal = ({ workout, onClose }: { workout: Workout | null, onClose: () => void }) => {
  if (!workout) return null;

  const renderPlan = (plan: string) => {
    const lines = plan.split("\n").filter(Boolean);

    return lines.map((line, index) => {
      if (/Warm-Up|Main Circuit|Cool-Down/i.test(line)) {
        return <h4 key={index} className="text-blue-600 font-bold text-lg mt-4">{line}</h4>;
      } else if (/\d+\s*(reps|min|minutes|seconds|sets)/i.test(line)) {
        return <p key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded inline-block my-1">{line}</p>;
      } else if (/\b(Low|Medium|High)\b/i.test(line)) {
        return <p key={index} className="text-red-600 font-semibold inline-block my-1">{line}</p>;
      } else {
        return <p key={index} className="text-gray-800 my-1">{line}</p>;
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 pt-20 md:pt-0 backdrop-blur-sm bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl font-light">&times;</button>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{workout.title}</h2>
        <p className="text-gray-500 mb-6">{workout.duration} min | {workout.focus} | {workout.intensity} | {workout.equipment}</p>
        <div className="flex flex-col gap-2">{renderPlan(workout.plan)}</div>
      </div>
    </div>
  );
};

const workoutFocusOptions: string[] = ["Legs", "Upper Body", "Full Body", "Cardio"];
const equipmentOptions: string[] = ["None", "Dumbbells", "Resistance Bands", "Full Gym"];
const intensityOptions: string[] = ["Low", "Medium", "High"];

const AII: React.FC = () => {
  const [workoutCards, setWorkoutCards] = useState<Workout[]>([]);
  const [currentGeneratedWorkout, setCurrentGeneratedWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const [createForm, setCreateForm] = useState({
    focus: "Legs",
    duration: "30",
    equipment: "None",
    intensity: "Medium",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ai");
        const data = await res.json();
        setWorkoutCards(data);
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      }
    };
    fetchWorkouts();
  }, []);

  // Save the current generated workout to backend
const saveWorkout = async () => {
  if (!currentGeneratedWorkout) return;

  try {
    // POST to your backend endpoint
    const res = await fetch("http://localhost:5000/api/ai/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentGeneratedWorkout), // send the full workout object including the plan
    });

    if (!res.ok) throw new Error("Failed to save workout");

    const savedWorkout = await res.json();

    // Add the saved workout to your local state so it shows in the UI
    setWorkoutCards([savedWorkout, ...workoutCards]);

    // Clear the preview
    setCurrentGeneratedWorkout(null);

  } catch (error) {
    console.error("Error saving workout:", error);
  }
};


  return (
    <>
      <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
        <Navbar />
        <div className="flex flex-col w-full min-h-screen font-sans text-gray-900 relative mt-4 md:mt-2">
          <main className="flex-1 flex flex-col space-y-8 pb-20 md:pb-0">
            <div className="w-full max-w-4xl mx-auto rounded-3xl p-6 md:p-12 space-y-8 bg-white shadow-2xl">

              {/* header */}
              <header className="text-center">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">AI Workout Plans</h2>
                <p className="text-gray-600 mt-2 max-w-prose mx-auto">
                  Generate a custom workout based on your goals, duration, and equipment.
                </p>
              </header>

              {/* inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="block text-gray-600 font-medium mb-2 flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-gray-500" />Duration (minutes)
                  </label>
                  <input type="number" name="duration" value={createForm.duration} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    min="1" />
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-600 font-medium mb-2 flex items-center gap-2">
                    <DumbbellIcon className="h-4 w-4 text-gray-500" />Equipment
                  </label>
                  <select name="equipment" value={createForm.equipment} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                    {equipmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block text-gray-600 font-medium mb-2 flex items-center gap-2">
                    <BoltIcon className="h-4 w-4 text-gray-500" />Intensity
                  </label>
                  <select name="intensity" value={createForm.intensity} onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                    {intensityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>

              {/* focus buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                {workoutFocusOptions.map(focus => (
                  <button key={focus} onClick={() => setCreateForm(prev => ({ ...prev, focus }))}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${
                      createForm.focus === focus
                        ? "bg-blue-600 text-white shadow-xl"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}>
                    {focus}
                  </button>
                ))}
              </div>

              {/* AI generate */}
              <AIHandling createForm={createForm} setLoading={setLoading} setCurrentGeneratedWorkout={setCurrentGeneratedWorkout} loading={loading} />

              {/* generated workout preview */}
              {currentGeneratedWorkout && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 pt-8 border-t border-gray-200">Generated Workout Preview</h3>
                  <WorkoutCard workout={currentGeneratedWorkout} onClick={() => setSelectedWorkout(currentGeneratedWorkout)} />
                  <button onClick={saveWorkout}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-md">
                    <DumbbellIcon className="h-5 w-5" />
                    Save Workout
                  </button>
                </div>
              )}

              {/* saved workouts */}
              {workoutCards.length > 0 && (
                <>
                  <h3 className="text-2xl font-bold text-gray-800 pt-8 border-t border-gray-200">Your Saved AI Workouts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {workoutCards.map(workout => <WorkoutCard key={workout._id} workout={workout} onClick={() => setSelectedWorkout(workout)} />)}
                  </div>
                </>
              )}

            </div>
          </main>

          {/* modal */}
          <WorkoutDetailModal workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />
        </div>
      </div>
    </>
  );
};

export default AII;
