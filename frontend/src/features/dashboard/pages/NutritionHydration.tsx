import React, { useState } from "react";

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
    const [meals, setMeals] = useState<{ name: string; calories: number }[]>([]);
    const [mealName, setMealName] = useState("");
    const [mealCalories, setMealCalories] = useState<number | "">("");

    // --- Handlers ---
    const addWater = () => setWaterCups(prev => Math.min(prev + 1, totalWaterCups));
    const removeWater = () => setWaterCups(prev => Math.max(prev - 1, 0));

    const addCalories = (amount: number) => setCalories(prev => Math.min(prev + amount, caloriesGoal));

    const addMeal = () => {
        if (mealName && mealCalories) {
            const newMeal = { name: mealName, calories: Number(mealCalories) };
            setMeals(prev => [...prev, newMeal]);
            setCalories(prev => Math.min(prev + newMeal.calories, caloriesGoal));
            setMealName("");
            setMealCalories("");
        }
    };

    return (
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

                {/* Water */}
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl shadow p-4 flex flex-col relative">
                    <p className="font-medium">💧 Water</p>
                    <p className="text-3xl font-bold">
                        {waterCups} <span className="text-gray-100 text-xl">/ {totalWaterCups} cups</span>
                    </p>
                    <div className="h-2 bg-blue-300 rounded mt-2">
                        <div className="h-2 bg-white rounded" style={{ width: `${waterPercentage}%` }}></div>
                    </div>
                    <p className="text-sm mt-1">{totalWaterCups - waterCups} cups to go</p>
                    {/* Water controls */}
                    <div className="flex space-x-2 mt-4">
                        <button onClick={removeWater} className="px-4 py-2 bg-blue-700/50 rounded hover:bg-blue-700 transition">-</button>
                        <button onClick={addWater} className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition">+</button>
                    </div>
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
                    <button
                        onClick={addMeal}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Add
                    </button>
                </div>

                {/* List of Meals */}
                <ul className="space-y-2">
                    {meals.length === 0 && <p className="text-gray-400 text-sm">No meals added yet.</p>}
                    {meals.map((meal, idx) => (
                        <li key={idx} className="flex justify-between border-b pb-1">
                            <span>{meal.name}</span>
                            <span className="text-gray-600">{meal.calories} cal</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Floating Button */}
            <button className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg text-2xl">
                +
            </button>
        </div>
    );
};

export default NutritionHydration;
