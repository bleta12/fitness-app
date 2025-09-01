import React, { useState } from "react";
import Navbar from "@/components/Navbar";

const NutritionHydration: React.FC = () => {
    // --- State ---
    const [waterCups, setWaterCups] = useState(6);
    const totalWaterCups = 8;
    const waterPercentage = Math.min((waterCups / totalWaterCups) * 100, 100);

    const [calories, setCalories] = useState(1247);
    const caloriesGoal = 2000;
    const caloriesPercentage = Math.min((calories / caloriesGoal) * 100, 100);

    const carbs = 156;
    const protein = 89;
    const fat = 52;
    const totalMacros = carbs * 4 + protein * 4 + fat * 9;
    const carbsPercent = Math.round((carbs * 4 / totalMacros) * 100);
    const proteinPercent = Math.round((protein * 4 / totalMacros) * 100);
    const fatPercent = Math.round((fat * 9 / totalMacros) * 100);

    // --- Meals State ---
    const [meals, setMeals] = useState<
        { name: string; calories: number; time: string; icon: string; color: string; mealType: string }[]
    >([]);
    const [mealName, setMealName] = useState("");
    const [mealCalories, setMealCalories] = useState<number | "">("");
    const [mealTime, setMealTime] = useState("");
    const [mealType, setMealType] = useState("Breakfast");

    // --- Handlers ---
    const addWater = () => setWaterCups(prev => Math.min(prev + 1, totalWaterCups));
    const addCalories = (amount: number) => setCalories(prev => Math.min(prev + amount, caloriesGoal));

    const addMeal = () => {
        if (mealName && mealCalories && mealTime && mealType) {
            const icons: Record<string, { icon: string; color: string }> = {
                Breakfast: { icon: "☕", color: "bg-orange-500" },
                Lunch: { icon: "🥗", color: "bg-green-500" },
                Snack: { icon: "🍎", color: "bg-lime-500" },
                Dinner: { icon: "🍽️", color: "bg-purple-500" },
            };
            const { icon, color } = icons[mealType] || {
                icon: "🍴",
                color: "bg-gray-400",
            };

            const newMeal = {
                name: mealName,
                calories: Number(mealCalories),
                time: mealTime,
                mealType,
                icon,
                color,
            };

            setMeals(prev => [...prev, newMeal]);
            setCalories(prev => Math.min(prev + newMeal.calories, caloriesGoal));
            setMealName("");
            setMealCalories("");
            setMealTime("");
            setMealType("Breakfast");
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
            {/* Navbar */}
            <Navbar />

            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
                {/* Header */}
                <div className="w-full max-w-3xl">
                    <h1 className="text-2xl font-semibold flex items-center gap-2 text-green-600">
                        🌿 Nutrition & Hydration
                    </h1>
                    <p className="text-lg font-medium mt-4">Today, December 15</p>
                    <p className="text-gray-500 text-sm">Keep tracking your health goals!</p>
                </div>

                {/* Stats Section */}
                <div className="w-full max-w-3xl mt-6 grid grid-cols-2 gap-4">
                    {/* Calories */}
                    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
                        <p className="text-orange-500 font-medium">🔥 Calories</p>
                        <p className="text-3xl font-bold">
                            {calories} <span className="text-gray-400 text-xl">/ {caloriesGoal}</span>
                        </p>
                        <div className="h-2 bg-gray-200 rounded mt-2">
                            <div className="h-2 bg-orange-400 rounded" style={{ width: `${caloriesPercentage}%` }}></div>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">{caloriesGoal - calories} left</p>
                    </div>

                    {/* Water Tracker */}
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                        {/* Header */}
                        <div className="flex justify-between w-full mb-4">
                            <p className="font-medium text-gray-800">💧 Water Intake</p>
                            <p className="text-gray-600">
                                Goal: <span className="text-blue-500 font-semibold">2.0L</span>
                            </p>
                        </div>

                        {/* Circular Progress */}
                        <div className="relative w-28 h-28 flex items-center justify-center mb-4">
                            <div
                                className="absolute w-full h-full rounded-full"
                                style={{
                                    background: `conic-gradient(#3b82f6 ${waterPercentage * 3.6}deg, #e5e7eb 0deg)`,
                                }}
                            />
                            <div className="absolute w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">
                                <span className="text-lg font-bold text-gray-800">{waterPercentage}%</span>
                                <span className="text-xs text-gray-500">completed</span>
                            </div>
                        </div>

                        {/* Cups */}
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            {Array.from({ length: totalWaterCups }, (_, i) => (
                                <div
                                    key={i}
                                    className={`w-8 h-12 rounded-b-lg flex items-center justify-center text-xs font-medium ${i < waterCups
                                        ? "bg-gradient-to-t from-blue-500 to-blue-300 text-white shadow"
                                        : "bg-gray-200 text-gray-400"
                                        }`}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>

                        {/* Button */}
                        <button
                            onClick={addWater}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold hover:from-blue-500 hover:to-blue-700 transition"
                        >
                            + Add Cup of Water
                        </button>
                    </div>
                </div>

                {/* Macronutrients */}
                <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6 mt-6">
                    <p className="font-medium text-gray-700 mb-4">Macronutrients</p>
                    <div className="flex justify-around text-center">
                        <div>
                            <div className="text-green-600 font-bold text-xl">{carbsPercent}%</div>
                            <p className="text-sm text-gray-500">Carbs</p>
                            <p className="font-semibold">{carbs}g</p>
                        </div>
                        <div>
                            <div className="text-red-500 font-bold text-xl">{proteinPercent}%</div>
                            <p className="text-sm text-gray-500">Protein</p>
                            <p className="font-semibold">{protein}g</p>
                        </div>
                        <div>
                            <div className="text-yellow-500 font-bold text-xl">{fatPercent}%</div>
                            <p className="text-sm text-gray-500">Fat</p>
                            <p className="font-semibold">{fat}g</p>
                        </div>
                    </div>
                </div>

                {/* Quick Add */}
                <div className="w-full max-w-3xl mt-6">
                    <p className="font-medium text-gray-700 mb-4">Quick Add</p>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => addCalories(500)} className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold">🍽 Add Meal</button>
                        <button onClick={addWater} className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold">💧 Add Water</button>
                        <button onClick={() => addCalories(200)} className="bg-lime-500 hover:bg-lime-600 text-white py-4 rounded-xl font-semibold">🍪 Add Snack</button>
                        <button className="bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-xl font-semibold">🔍 Search Food</button>
                    </div>
                </div>

                {/* Today's Meals */}
                <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6 mt-6">
                    <p className="font-medium text-gray-700 mb-4">🍴 Today's Meals</p>

                    {/* Add Meal Form */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={mealName}
                            onChange={e => setMealName(e.target.value)}
                            placeholder="Meal name"
                            className="flex-1 border rounded px-3 py-2"
                        />
                        <input
                            type="number"
                            value={mealCalories}
                            onChange={e => setMealCalories(Number(e.target.value))}
                            placeholder="Calories"
                            className="w-28 border rounded px-3 py-2"
                        />
                        <input
                            type="time"
                            value={mealTime}
                            onChange={e => setMealTime(e.target.value)}
                            className="w-32 border rounded px-3 py-2"
                        />
                        <select
                            value={mealType}
                            onChange={e => setMealType(e.target.value)}
                            className="col-span-2 border rounded px-3 py-2"
                        >
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Snack</option>
                            <option>Dinner</option>
                        </select>
                        <button
                            onClick={addMeal}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Add
                        </button>
                    </div>

                    {/* List of Meals */}
                    <div className="space-y-3">
                        {meals.length === 0 && <p className="text-gray-400 text-sm">No meals added yet.</p>}
                        {meals.map((meal, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm"
                            >
                                {/* Icon */}
                                <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-white text-xl ${meal.color}`}>
                                    {meal.icon}
                                </div>

                                {/* Name + Calories */}
                                <div className="flex-1 ml-4">
                                    <p className="font-medium text-gray-800">{meal.name}</p>
                                    <p className="text-sm text-gray-500">{meal.calories} calories</p>
                                </div>

                                {/* Time + Edit */}
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">{meal.time}</p>
                                    <button className="text-green-500 text-sm hover:underline">✏ Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating Button */}
                <button className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg text-2xl">
                    +
                </button>
            </div>
        </div>
    );
};

export default NutritionHydration;
