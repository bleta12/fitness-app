import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight: number;
    duration?: number;
}

interface Workout {
    id: string;
    date: string;
    exercises: Exercise[];
}

const ProgressPage = ({ workouts }: { workouts: Workout[] }) => {
    const allExercises = workouts.flatMap(w => w.exercises.map(e => e.name.toLowerCase()));
    const uniqueExercises = Array.from(new Set(allExercises));
    const [selectedExercise, setSelectedExercise] = useState(uniqueExercises[0] || '');

    useEffect(() => {
        if (uniqueExercises.length > 0 && (!selectedExercise || !uniqueExercises.includes(selectedExercise))) {
            setSelectedExercise(uniqueExercises[0]);
        }
    }, [uniqueExercises]);
    
    const chartData = workouts
        .filter(w => w.exercises.some(e => e.name.toLowerCase() === selectedExercise))
        .map(w => {
            const exercise = w.exercises.find(e => e.name.toLowerCase() === selectedExercise);
            return {
                date: w.date,
                weight: exercise?.weight || 0,
            };
        })
        .slice(0, 10)
        .reverse();

    return (
        <div className="flex flex-col items-center p-4 w-full text-gray-800">
            <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                Progress Charts
            </h2>
            <div className="relative z-10 p-6 rounded-3xl shadow-xl backdrop-blur-md bg-white bg-opacity-70 border border-gray-300 w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.01] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl -z-10"></div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-lg font-semibold mb-2">Select Exercise</label>
                    <select
                        value={selectedExercise}
                        onChange={(e) => setSelectedExercise(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        {uniqueExercises.length > 0 ? (
                            uniqueExercises.map(ex => (
                                <option key={ex} value={ex}>{ex}</option>
                            ))
                        ) : (
                            <option value="">No exercises logged</option>
                        )}
                    </select>
                </div>
                {chartData.length > 1 ? (
                    <div className="mt-8 flex flex-col items-center">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">{selectedExercise} Weight Progress</h3>
                        <div className="w-full h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#6B7280"
                                        tickFormatter={(dateStr: string) => new Date(dateStr).toLocaleDateString()}
                                    />
                                    <YAxis stroke="#6B7280" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', color: '#1F2937' }}
                                        labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                                        formatter={(value, name) => [`${value} kg`, name]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#8B5CF6"
                                        strokeWidth={3}
                                        dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 5 }}
                                        activeDot={{ r: 8, strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-8">
                        <p>Log at least two workouts with this exercise to see a chart!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const WorkoutTracking = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [newWorkoutDate, setNewWorkoutDate] = useState('');
    const [newExercises, setNewExercises] = useState<Exercise[]>([]);
    const [isAddingExercise, setIsAddingExercise] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<Exercise>({
        id: '',
        name: '',
        sets: 0,
        reps: 0,
        weight: 0,
        duration: 0
    });
    const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [today, setToday] = useState('');

    useEffect(() => {
        const todayDate = new Date().toISOString().split('T')[0];
        setToday(todayDate);
        setNewWorkoutDate(todayDate);

        try {
            const storedWorkouts = localStorage.getItem('workouts');
            if (storedWorkouts) {
                const parsedWorkouts: Workout[] = JSON.parse(storedWorkouts);
                parsedWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setWorkouts(parsedWorkouts);
            } else {
                const dummyWorkouts = [
                    {
                        id: crypto.randomUUID(),
                        date: todayDate,
                        exercises: [
                            { id: crypto.randomUUID(), name: 'Barbell Squats', sets: 3, reps: 8, weight: 60, duration: 15 },
                            { id: crypto.randomUUID(), name: 'Bench Press', sets: 3, reps: 10, weight: 40, duration: 10 },
                            { id: crypto.randomUUID(), name: 'Pull-ups', sets: 3, reps: 5, weight: 0, duration: 10 }
                        ]
                    },
                    {
                        id: crypto.randomUUID(),
                        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                        exercises: [
                            { id: crypto.randomUUID(), name: 'Barbell Squats', sets: 3, reps: 8, weight: 55, duration: 15 },
                            { id: crypto.randomUUID(), name: 'Overhead Press', sets: 3, reps: 10, weight: 20, duration: 10 }
                        ]
                    },
                    {
                        id: crypto.randomUUID(),
                        date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
                        exercises: [
                            { id: crypto.randomUUID(), name: 'Barbell Squats', sets: 3, reps: 8, weight: 50, duration: 15 },
                            { id: crypto.randomUUID(), name: 'Bench Press', sets: 3, reps: 10, weight: 35, duration: 10 }
                        ]
                    }
                ];
                localStorage.setItem('workouts', JSON.stringify(dummyWorkouts));
                setWorkouts(dummyWorkouts);
            }
        } catch (e) {
            console.error("Error loading workouts from localStorage:", e);
            setWorkouts([]);
        }
    }, []);

    useEffect(() => {
        console.log("Saving workouts to localStorage:", workouts);
        try {
            if (workouts.length > 0) {
                 localStorage.setItem('workouts', JSON.stringify(workouts));
            }
        } catch (e) {
            console.error("Failed to save workouts to localStorage:", e);
        }
    }, [workouts]);

const fetchAiSuggestions = async () => {
    setAiLoading(true);
    setAiError('');
    setAiSuggestions(null);

    try {
     

        // MOCKED data  just for testing
        const mockedSuggestions = ['Squats', 'Pushups', 'Deadlifts', 'Overhead Press', 'Pull-ups'];  // to be replaced with :const response = await fetch('/api/ai-suggestions');
//const data = await response.json();
//setAiSuggestions(data.suggestions);

        
        
        await new Promise(res => setTimeout(res, 500));

        setAiSuggestions(mockedSuggestions);
    } catch (error: any) {
        console.error("Error fetching AI suggestions:", error);
        setAiError('Failed to fetch AI suggestions.');
    } finally {
        setAiLoading(false);
    }
};

    const handleSaveWorkout = () => {
        if (!newWorkoutDate || newExercises.length === 0) {
            console.error("Cannot save workout. Missing data.");
            return;
        }

        try {
            const newWorkout = {
                id: crypto.randomUUID(),
                date: newWorkoutDate,
                exercises: newExercises,
            };
            const updatedWorkouts = [...workouts, newWorkout];
            updatedWorkouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            setWorkouts(updatedWorkouts);
            
            setNewWorkoutDate(today);
            setNewExercises([]);
            setCurrentPage('dashboard');
            console.log("Workout saved successfully to local storage.");

        } catch (e) {
            console.error("Error saving workout to local storage: ", e);
        }
    };

    const handleAddExercise = () => {
        if (currentExercise.name && currentExercise.sets > 0 && currentExercise.reps > 0) {
            const newId = crypto.randomUUID();
            const exerciseToAdd = {
                ...currentExercise,
                id: newId,
                name: currentExercise.name.toLowerCase(),
                duration: currentExercise.duration || 0
            };
            setNewExercises([...newExercises, exerciseToAdd]);
            setCurrentExercise({ id: '', name: '', sets: 0, reps: 0, weight: 0, duration: 0 });
            setIsAddingExercise(false);
        }
    };

    const handleDeleteWorkout = (workoutId: string) => {
        try {
            const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
            setWorkouts(updatedWorkouts);
            console.log("Workout deleted successfully from local storage.");
        } catch (e) {
            console.error("Error deleting workout from local storage: ", e);
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return (
                    <div className="flex flex-col items-center p-4 w-full">
                        <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                            Your Dashboard
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                            <div
                                onClick={() => setCurrentPage('addWorkout')}
                                className="relative overflow-hidden group p-8 rounded-3xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md bg-white bg-opacity-70 border border-gray-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-indigo-100 opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus text-purple-600"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                                <span className="mt-4 text-xl font-semibold text-gray-800">Add New Workout</span>
                            </div>
                            <div
                                onClick={() => setCurrentPage('workoutList')}
                                className="relative overflow-hidden group p-8 rounded-3xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md bg-white bg-opacity-70 border border-gray-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list text-blue-600"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                                <span className="mt-4 text-xl font-semibold text-gray-800">View History</span>
                            </div>
                            <div
                                onClick={() => setCurrentPage('progress')}
                                className="relative overflow-hidden group p-8 rounded-3xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center text-center backdrop-blur-md bg-white bg-opacity-70 border border-gray-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-green-100 opacity-50 group-hover:opacity-70 transition-opacity duration-300 -z-10"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2 text-emerald-600"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                                <span className="mt-4 text-xl font-semibold text-gray-800">Track Progress</span>
                            </div>
                        </div>

                        <div className="mt-12 p-8 rounded-3xl shadow-xl backdrop-blur-md bg-white bg-opacity-70 border border-gray-300 w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.01] overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-gray-800">AI Suggestions</h3>
                                <button
                                    onClick={fetchAiSuggestions}
                                    className="relative overflow-hidden group px-4 py-2 rounded-lg font-semibold text-white transform active:scale-95 transition-all duration-300 shadow-lg"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
                                    <span className="relative z-10 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles inline-block mr-1"><path d="M9.91 1.05C8.97 2.95 6.43 4.88 4.29 6.24c-1.89 1.15-3 3.39-2.58 5.62a3.86 3.86 0 0 0 1.29 2.12c1.03.95 2.14 1.84 3.1 2.92l.85 1.03c.53.64 1.35 1.48 2.21 1.95a3.86 3.86 0 0 0 3.79-.11c.88-.6 1.74-1.28 2.45-2.07l.95-.97c.54-.56.97-1.18 1.44-1.84a3.86 3.86 0 0 0 .53-3.41c-1.39-2.43-3.95-4.46-6.42-5.74-1.8-1.28-3.34-3.11-4.22-5.06l-.42-.94Z"/><path d="M12 21.68c-.69-.9-1.26-2.14-1.76-3.49"/><path d="M11 11.23c-1.18 2.22-3.21 4.19-5.18 5.48"/><path d="M22 17.02c-1.18-2.22-3.21-4.19-5.18-5.48"/><path d="M16 1.07c.69.9 1.26 2.14 1.76 3.49"/></svg>
                                        Get Tips
                                    </span>
                                </button>
                            </div>
                            {aiLoading ? (
                                <p className="text-center text-gray-500">Generating suggestions...</p>
                            ) : aiError ? (
                                <p className="text-center text-red-600">{aiError}</p>
                            ) : aiSuggestions ? (
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {aiSuggestions.map((suggestion, index) => (
                                        <li key={index} className="bg-white bg-opacity-60 p-3 rounded-lg shadow-sm border border-gray-300">{suggestion}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-500">Click "Get Tips" for exercise suggestions.</p>
                            )}
                        </div>
                    </div>
                );

            case 'addWorkout':
                return (
                    <div className="flex flex-col items-center p-4 w-full">
                        <h2 className="text-3xl font-extrabold mb-6 text-[#008b8b] bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                            New Workout
                        </h2>
                        <div className="relative z-10 p-6 rounded-3xl shadow-xl backdrop-blur-md bg-[#778899]/80 border border-gray-300 w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.01] overflow-hidden">
                            <div className="absolute inset-0 bg-[#5f9ea0]/20 rounded-3xl -z-10"></div>
                            <div className="mb-4">
                                <label className="block text-black text-xl font-semibold mb-4">Workout Date</label>
                                <input
                                    type="date"
                                    value={newWorkoutDate}
                                    onChange={(e) => setNewWorkoutDate(e.target.value)}
                                    min={today}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-black">Exercises</h3>
                            {newExercises.length > 0 ? (
                                <div className="space-y-4 mb-6">
                                    {newExercises.map((exercise) => (
                                        <div key={exercise.id} className="bg-gray-200/80 p-4 rounded-lg shadow-sm flex justify-between items-center border border-gray-300">
                                            <div>
                                                <p className="font-bold text-lg text-gray-800">{exercise.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {exercise.sets} sets x {exercise.reps} reps
                                                    {exercise.weight > 0 && <span> @ {exercise.weight} kg</span>}
                                                    {exercise.duration !== undefined && <span> for {exercise.duration} min</span>}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setNewExercises(newExercises.filter(e => e.id !== exercise.id))}
                                                className="p-2 text-red-600 hover:text-red-800 transition duration-200 rounded-full"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic mb-4">No exercises added yet.</p>
                            )}
                            
                            {isAddingExercise ? (
                                <div className="bg-gray-200/80 p-4 rounded-lg shadow-inner mb-4 border border-gray-300">
                                    <h4 className="font-bold mb-2 text-gray-800">Add New Exercise</h4>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Exercise Name (e.g., Squats)"
                                            value={currentExercise.name}
                                            onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                                        />
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            <input
                                                type="number"
                                                placeholder="Sets"
                                                value={currentExercise.sets || ''}
                                                onChange={(e) => setCurrentExercise({ ...currentExercise, sets: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Reps"
                                                value={currentExercise.reps || ''}
                                                onChange={(e) => setCurrentExercise({ ...currentExercise, reps: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Weight (kg)"
                                                value={currentExercise.weight || ''}
                                                onChange={(e) => setCurrentExercise({ ...currentExercise, weight: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Duration (min)"
                                                value={currentExercise.duration || ''}
                                                onChange={(e) => setCurrentExercise({ ...currentExercise, duration: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 mt-4">
                                        <button
                                            onClick={handleAddExercise}
                                            className="relative overflow-hidden group flex-1 py-2 rounded-lg font-semibold text-white transform active:scale-95 transition-all duration-300 shadow-lg"
                                        >
                                            <span className="absolute inset-0 bg-[#008080]/80 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
                                            <span className="relative z-10">Save Exercise</span>
                                        </button>
                                        <button
                                            onClick={() => setIsAddingExercise(false)}
                                            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAddingExercise(true)}
                                    className="w-full flex items-center justify-center bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition border border-gray-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Add Exercise
                                </button>
                            )}
                            <button
                                onClick={handleSaveWorkout}
                                disabled={!newWorkoutDate || newExercises.length === 0}
                                className={`w-full mt-6 py-3 rounded-lg font-bold text-black transition ${
                                    !newWorkoutDate || newExercises.length === 0
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                                        : 'bg-gray-700 hover:bg-gray-800 shadow-md transform active:scale-95'
                                }`}
                            >
                                Save Workout
                            </button>
                        </div>
                    </div>
                );
            case 'workoutList':
                return (
                    <div className="flex flex-col items-center p-4 w-full">
                        <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                            Workout History
                        </h2>
                        <div className="w-full max-w-4xl space-y-6">
                            {workouts.length > 0 ? (
                                workouts.map((workout) => (
                                    <div key={workout.id} className="relative p-6 rounded-2xl shadow-xl backdrop-blur-sm
                                    bg-white/70 border border-gray-300 overflow-hidden transform
                                    transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl">
                                        
                                        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                                        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

                                        <button
                                            onClick={() => handleDeleteWorkout(workout.id)}
                                            className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition duration-200 z-10"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                        </button>
                                        
                                        <p className="relative z-10 text-2xl font-extrabold text-gray-800 mb-4 drop-shadow-sm tracking-wide">
                                            {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        
                                        <div className="relative z-10 space-y-4">
                                            {workout.exercises.map((exercise, index) => (
                                                <div key={index} className="relative p-4 rounded-xl shadow-md flex items-center bg-white border border-gray-200
                                                transform transition-transform duration-200 hover:scale-[1.02]">
                                                    <span className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-l-xl"></span>
                                                    <div className="pl-4">
                                                        <p className="text-lg font-semibold text-gray-800">{exercise.name}</p>
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium text-gray-700">{exercise.sets}</span> sets x <span className="font-medium text-gray-700">{exercise.reps}</span> reps
                                                            {exercise.weight > 0 && <span> @ <span className="font-medium text-gray-700">{exercise.weight}</span> kg</span>}
                                                            {exercise.duration !== undefined && <span> for <span className="font-medium text-gray-700">{exercise.duration}</span> min</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-6 rounded-2xl bg-white/70 border border-gray-300 shadow-lg">
                                    <p className="text-gray-500 italic">No workouts logged yet. Add your first workout!</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'progress':
                return <ProgressPage workouts={workouts} />;
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans antialiased flex flex-col items-center">
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <header className="w-full max-w-4xl p-4 flex justify-between items-center z-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
                    Workout<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Tracker</span>
                </h1>
                <nav className="flex space-x-4">
                    <button onClick={() => setCurrentPage('dashboard')} className={`text-lg font-semibold px-4 py-2 rounded-lg transition ${currentPage === 'dashboard' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}>Dashboard</button>
                    <button onClick={() => setCurrentPage('addWorkout')} className={`text-lg font-semibold px-4 py-2 rounded-lg transition ${currentPage === 'addWorkout' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}>Add Workout</button>
                    <button onClick={() => setCurrentPage('progress')} className={`text-lg font-semibold px-4 py-2 rounded-lg transition ${currentPage === 'progress' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}>Progress</button>
                </nav>
            </header>

            <main className="w-full flex justify-center items-start mt-8 z-10">
                {renderPage()}
            </main>
        </div>
    );
};

export default WorkoutTracking;