import React from "react";
import type { Workout } from "./AI";
import { DumbbellIcon } from "lucide-react";

interface AIHandlingProps {
  createForm: {
    focus: string;
    duration: string;
    intensity: string;
    equipment: string;
  };
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentGeneratedWorkout: React.Dispatch<React.SetStateAction<Workout | null>>;
}

const AIHandling: React.FC<AIHandlingProps> = ({
  createForm,
  loading,
  setLoading,
  setCurrentGeneratedWorkout,
}) => {
  const generateWorkout = async () => {
    setLoading(true);
    setCurrentGeneratedWorkout(null);

    const apiKey = import.meta.env.VITE_GROQ_API;
    const prompt = `Create a ${createForm.duration}-minute ${createForm.focus} workout plan at ${createForm.intensity} intensity, using ${createForm.equipment}. Provide a detailed, easy-to-read plan. Format the response with a title, distinct sections for warm-up, main circuit, and cool-down, using bold, colors and list bullets, and npt html tags.`;

    let generatedPlan = "An error occurred. Please try again later.";

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
        }),
      });

      const result = await res.json();
      const text = result?.choices?.[0]?.message?.content;
      if (text) {
        // Cleanup extra newlines
        generatedPlan = text.replace(/\n{2,}/g, "\n\n");
      }
    } catch (error) {
      console.error("Groq API call failed:", error);
    } finally {
      const newWorkout: Workout = {
        id: crypto.randomUUID(),
        title: `${createForm.duration}-Min ${createForm.focus} Workout`,
        duration: createForm.duration,
        focus: createForm.focus,
        intensity: createForm.intensity,
        equipment: createForm.equipment,
        plan: generatedPlan,
      };

      setCurrentGeneratedWorkout(newWorkout);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generateWorkout}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.01] ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 shadow-xl"
      }`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <DumbbellIcon className="h-5 w-5" />
          <span>Generate Workout</span>
        </>
      )}
    </button>
  );
};

export default AIHandling;
