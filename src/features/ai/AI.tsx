import React, { useState, type ChangeEvent } from "react";
import Navbar from "@/components/Navbar"; // No .ts extension needed

// Define AI API response structure
interface AIResponse {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
}

const workoutFocusOptions: string[] = ["Legs", "Upper Body", "Full Body", "Cardio"];
const equipmentOptions: string[] = ["None", "Dumbbells", "Resistance Bands", "Full Gym"];
const intensityOptions: string[] = ["Low", "Medium", "High"];

const AI: React.FC = () => {
    const [workoutPlan, setWorkoutPlan] = useState<string>("");
    const [selectedFocus, setSelectedFocus] = useState<string>("Legs");
    const [loading, setLoading] = useState<boolean>(false);
    const [duration, setDuration] = useState<string>("30");
    const [equipment, setEquipment] = useState<string>("None");
    const [intensity, setIntensity] = useState<string>("Medium");

    const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => setDuration(e.target.value);
    const handleEquipmentChange = (e: ChangeEvent<HTMLSelectElement>) => setEquipment(e.target.value);
    const handleIntensityChange = (e: ChangeEvent<HTMLSelectElement>) => setIntensity(e.target.value);

    const generateWorkout = async () => {
        setLoading(true);
        setWorkoutPlan("");

        const prompt = `Create a ${duration}-minute ${selectedFocus} workout plan at ${intensity} intensity, using ${equipment}. Provide a title and a list of exercises with sets and reps. Format the response in HTML or markdown.`;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };

        const apiKey = "YOUR_API_KEY";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result: AIResponse = await response.json();
            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            setWorkoutPlan(
                text ||
                "Sorry, I could not generate a workout plan at this time. Please try again."
            );
        } catch (error) {
            console.error("API call failed:", error);
            setWorkoutPlan("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 flex flex-col space-y-8 p-6 md:p-12">
                <header className="text-center md:text-left">
                    <h2 className="text-4xl font-bold text-gray-900">AI Workout Plans</h2>
                    <p className="text-gray-500 mt-2">
                        Generate a custom workout based on your goals, duration, and equipment.
                    </p>
                </header>

                {/* Focus Buttons */}
                <div className="flex flex-wrap gap-3">
                    {workoutFocusOptions.map((focus) => (
                        <button
                            key={focus}
                            onClick={() => setSelectedFocus(focus)}
                            className={`px-5 py-2 rounded-full font-semibold transition-colors ${
                                selectedFocus === focus
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
                            }`}
                        >
                            {focus}
                        </button>
                    ))}
                </div>


                {/* Additional Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Duration (minutes)</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={handleDurationChange}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Equipment</label>
                        <select
                            value={equipment}
                            onChange={handleEquipmentChange}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        >
                            {equipmentOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Intensity</label>
                        <select
                            value={intensity}
                            onChange={handleIntensityChange}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        >
                            {intensityOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generateWorkout}
                    disabled={loading}
                    className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white transition-colors ${
                        loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Generating..." : `Generate ${selectedFocus} Workout`}
                </button>

                {/* AI-generated plan */}
                <div className="bg-white p-8 rounded-2xl shadow-lg min-h-[300px]">
                    {loading && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-xl text-gray-500">Generating your workout...</p>
                        </div>
                    )}
                    {!loading && workoutPlan && (
                        <div className="prose max-w-none text-gray-800">
                            <div dangerouslySetInnerHTML={{ __html: workoutPlan }} />
                        </div>
                    )}
                    {!loading && !workoutPlan && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-xl text-gray-400">Your custom workout plan will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AI;
