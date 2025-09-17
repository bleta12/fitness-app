import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

type Meal = {
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    time: string;
    mealType: string;
    icon: string;
    color: string;
    date: string;
};

type Toast = {
    id: number;
    message: string;
};

const NutritionHydration: React.FC = () => {
    // --- State ---
    const [waterCups, setWaterCups] = useState(0);
    const totalWaterCups = 8;

    const [meals, setMeals] = useState<Meal[]>([]);
    const [mealName, setMealName] = useState("");
    const [mealCalories, setMealCalories] = useState<number | "">("");
    const [mealCarbs, setMealCarbs] = useState<number | "">("");
    const [mealProtein, setMealProtein] = useState<number | "">("");
    const [mealFat, setMealFat] = useState<number | "">("");
    const [mealTime, setMealTime] = useState("");
    const [mealType, setMealType] = useState("Breakfast");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

    // Toasts
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 2000);
    };

    // --- LocalStorage load ---
    useEffect(() => {
        const savedMeals = localStorage.getItem("meals");
        const savedWater = localStorage.getItem("waterCups");
        if (savedMeals) setMeals(JSON.parse(savedMeals));
        if (savedWater) setWaterCups(Number(savedWater));
    }, []);

    // --- LocalStorage save ---
    useEffect(() => {
        localStorage.setItem("meals", JSON.stringify(meals));
        localStorage.setItem("waterCups", String(waterCups));
    }, [meals, waterCups]);

    // --- Hydration Reminder (every 2h) ---
    useEffect(() => {
        const reminder = setInterval(() => {
            showToast("💧 Time to drink water!");
        }, 1000 * 60 * 60 * 2);

        return () => clearInterval(reminder);
    }, []);

    // --- Handlers ---
    const addWater = () => {
        setWaterCups((prev) => {
            const newValue = Math.min(prev + 1, totalWaterCups);
            showToast("💧 Great! You drank a cup of water.");
            return newValue;
        });
    };

    const addOrSaveMeal = () => {
        if (
            mealName &&
            mealCalories &&
            mealCarbs !== "" &&
            mealProtein !== "" &&
            mealFat !== "" &&
            mealTime &&
            mealType
        ) {
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

            const newMeal: Meal = {
                name: mealName,
                calories: Number(mealCalories),
                carbs: Number(mealCarbs),
                protein: Number(mealProtein),
                fat: Number(mealFat),
                time: mealTime,
                mealType,
                icon,
                color,
                date: new Date().toISOString().split("T")[0],
            };

            if (editingIndex !== null) {
                setMeals((prev) =>
                    prev.map((m, idx) => (idx === editingIndex ? newMeal : m))
                );
                setEditingIndex(null);
            } else {
                setMeals((prev) => [...prev, newMeal]);
            }

            // Reset form
            setMealName("");
            setMealCalories("");
            setMealCarbs("");
            setMealProtein("");
            setMealFat("");
            setMealTime("");
            setMealType("Breakfast");
        }
    };

    const handleEditMeal = (index: number) => {
        const meal = meals[index];
        setMealName(meal.name);
        setMealCalories(meal.calories);
        setMealCarbs(meal.carbs);
        setMealProtein(meal.protein);
        setMealFat(meal.fat);
        setMealTime(meal.time);
        setMealType(meal.mealType);
        setEditingIndex(index);
    };

    const handleCancelEdit = () => {
        setMealName("");
        setMealCalories("");
        setMealCarbs("");
        setMealProtein("");
        setMealFat("");
        setMealTime("");
        setMealType("Breakfast");
        setEditingIndex(null);
    };

    // --- Filter Meals (daily/weekly) ---
    const today = new Date().toISOString().split("T")[0];
    const last7days = new Date();
    last7days.setDate(last7days.getDate() - 6);

    const filteredMeals = meals.filter((m) => {
        if (viewMode === "daily") return m.date === today;
        return new Date(m.date) >= last7days;
    });

    // --- Totals ---
    const totalCalories = filteredMeals.reduce((a, m) => a + m.calories, 0);
    const totalCarbs = filteredMeals.reduce((a, m) => a + m.carbs, 0);
    const totalProtein = filteredMeals.reduce((a, m) => a + m.protein, 0);
    const totalFat = filteredMeals.reduce((a, m) => a + m.fat, 0);

    const totalMacros = totalCarbs * 4 + totalProtein * 4 + totalFat * 9 || 1;
    const carbsPercent = Math.round((totalCarbs * 4 / totalMacros) * 100);
    const proteinPercent = Math.round((totalProtein * 4 / totalMacros) * 100);
    const fatPercent = Math.round((totalFat * 9 / totalMacros) * 100);

    const caloriesGoal = 2000;
    const caloriesPercentage = Math.min(
        (totalCalories / caloriesGoal) * 100,
        100
    );
    const waterPercentage = Math.min((waterCups / totalWaterCups) * 100, 100);

    // --- Weekly calories helper ---
    const getWeekCalories = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const result: { day: string; cal: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dStr = d.toISOString().split("T")[0];
            const cal = meals
                .filter((m) => m.date === dStr)
                .reduce((a, m) => a + m.calories, 0);
            result.push({ day: days[d.getDay()], cal });
        }
        return result;
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
            {/* Navbar */}
            <Navbar />


            <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {/* Toasts */}
                    <div className="fixed top-4 right-4 space-y-2 z-50">
                        {toasts.map((t) => (
                            <div
                                key={t.id}
                                className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in"
                            >
                                {t.message}
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <header className="mb-6 text-center md:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            🌿 Nutrition & Hydration
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Today: {today}
                        </p>
                    </header>

                    {/* Toggle Daily/Weekly */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setViewMode("daily")}
                            className={`px-4 py-2 rounded ${viewMode === "daily"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setViewMode("weekly")}
                            className={`px-4 py-2 rounded ${viewMode === "weekly"
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            Weekly
                        </button>
                    </div>

                    {/* Calories & Water */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Calories */}
                        <div className="bg-white rounded-xl shadow p-4">
                            <p className="text-orange-500 font-medium">🔥 Calories</p>
                            <p className="text-3xl font-bold">
                                {totalCalories}{" "}
                                <span className="text-gray-400 text-xl">/ {caloriesGoal}</span>
                            </p>
                            <div className="h-2 bg-gray-200 rounded mt-2">
                                <div
                                    className="h-2 bg-orange-400 rounded"
                                    style={{ width: `${caloriesPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Water */}
                        <div className="bg-white p-4 rounded-xl shadow text-center">
                            <p className="text-lg font-semibold mb-4">💧 Water Intake</p>
                            <div className="relative w-28 h-28 mx-auto mb-4">
                                <div
                                    className="absolute w-full h-full rounded-full"
                                    style={{
                                        background: `conic-gradient(#3b82f6 ${waterPercentage * 3.6
                                            }deg, #e5e7eb 0deg)`,
                                    }}
                                />
                                <div className="absolute w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-gray-800">
                                        {waterPercentage}%
                                    </span>
                                    <span className="text-xs text-gray-500">completed</span>
                                </div>
                            </div>
                            <button
                                onClick={addWater}
                                className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold hover:from-blue-500 hover:to-blue-700 transition"
                            >
                                + Add Cup of Water
                            </button>
                        </div>
                    </section>

                    {/* Macronutrients */}
                    <section className="bg-white rounded-xl shadow p-6 mb-6">
                        <p className="font-medium text-gray-700 mb-4">Macronutrients</p>
                        <div className="flex justify-around text-center">
                            <div>
                                <div className="text-green-600 font-bold text-xl">
                                    {carbsPercent}%
                                </div>
                                <p className="text-sm text-gray-500">Carbs</p>
                                <p className="font-semibold">{totalCarbs}g</p>
                            </div>
                            <div>
                                <div className="text-red-500 font-bold text-xl">
                                    {proteinPercent}%
                                </div>
                                <p className="text-sm text-gray-500">Protein</p>
                                <p className="font-semibold">{totalProtein}g</p>
                            </div>
                            <div>
                                <div className="text-yellow-500 font-bold text-xl">
                                    {fatPercent}%
                                </div>
                                <p className="text-sm text-gray-500">Fat</p>
                                <p className="font-semibold">{totalFat}g</p>
                            </div>
                        </div>
                    </section>

                    {/* Add Meal Form */}
                    <section className="bg-white rounded-xl shadow p-6 mb-6">
                        <p className="font-medium text-gray-700 mb-4">🍴 Add Meal</p>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
                            <input
                                type="text"
                                value={mealName}
                                onChange={(e) => setMealName(e.target.value)}
                                placeholder="Meal name"
                                className="border rounded px-3 py-2"
                            />
                            <input
                                type="number"
                                value={mealCalories}
                                onChange={(e) => setMealCalories(Number(e.target.value))}
                                placeholder="Calories"
                                className="border rounded px-3 py-2"
                            />
                            <input
                                type="number"
                                value={mealCarbs}
                                onChange={(e) => setMealCarbs(Number(e.target.value))}
                                placeholder="Carbs"
                                className="border rounded px-3 py-2"
                            />
                            <input
                                type="number"
                                value={mealProtein}
                                onChange={(e) => setMealProtein(Number(e.target.value))}
                                placeholder="Protein"
                                className="border rounded px-3 py-2"
                            />
                            <input
                                type="number"
                                value={mealFat}
                                onChange={(e) => setMealFat(Number(e.target.value))}
                                placeholder="Fat"
                                className="border rounded px-3 py-2"
                            />
                            <input
                                type="time"
                                value={mealTime}
                                onChange={(e) => setMealTime(e.target.value)}
                                className="border rounded px-3 py-2"
                            />
                            <select
                                value={mealType}
                                onChange={(e) => setMealType(e.target.value)}
                                className="border rounded px-3 py-2"
                            >
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Snack</option>
                                <option>Dinner</option>
                            </select>
                            <button
                                onClick={addOrSaveMeal}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                {editingIndex !== null ? "Save" : "Add"}
                            </button>
                            {editingIndex !== null && (
                                <button
                                    onClick={handleCancelEdit}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        {/* Meals List */}
                        <div className="space-y-3">
                            {filteredMeals.length === 0 && (
                                <p className="text-gray-400 text-sm">No meals added yet.</p>
                            )}
                            {filteredMeals.map((meal, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm"
                                >
                                    <div
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-white text-xl ${meal.color}`}
                                    >
                                        {meal.icon}
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <p className="font-medium text-gray-800">{meal.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {meal.calories} cal | {meal.carbs}C {meal.protein}P {meal.fat}F
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">{meal.time}</p>
                                        <button
                                            onClick={() => handleEditMeal(idx)}
                                            className="text-green-500 text-sm hover:underline"
                                        >
                                            ✏ Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Search Food */}
                    <section className="bg-white rounded-xl shadow p-6 mb-6">
                        <p className="font-medium text-gray-700 mb-4">🔍 Search Food</p>
                        <input
                            type="text"
                            placeholder="Search meals..."
                            onChange={(e) => {
                                const query = e.target.value.toLowerCase();
                                setMeals((prev) =>
                                    prev.map((meal) => ({
                                        ...meal,
                                        hidden: query && !meal.name.toLowerCase().includes(query),
                                    }))
                                );
                            }}
                            className="w-full border rounded px-3 py-2 mb-4"
                        />
                        <div className="space-y-3">
                            {meals
                                .filter((meal: any) => !meal.hidden)
                                .map((meal, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3 shadow-sm"
                                    >
                                        <div
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-white text-xl ${meal.color}`}
                                        >
                                            {meal.icon}
                                        </div>
                                        <div className="flex-1 ml-4">
                                            <p className="font-medium text-gray-800">{meal.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {meal.calories} cal | {meal.carbs}C {meal.protein}P {meal.fat}F
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </section>

                    {/* Charts */}
                    <section className="bg-white rounded-xl shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">📊 Your Progress</h2>
                        {/* Pie Chart Macros */}
                        <div className="flex flex-col items-center mb-6">
                            <div
                                className="w-40 h-40 rounded-full"
                                style={{
                                    background: `conic-gradient(
                    #22c55e 0% ${carbsPercent}%,
                    #ef4444 ${carbsPercent}% ${carbsPercent + proteinPercent}%,
                    #eab308 ${carbsPercent + proteinPercent}% 100%
                  )`,
                                }}
                            />
                            <div className="flex gap-4 mt-3 text-sm">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 inline-block rounded"></span> Carbs {carbsPercent}%</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 inline-block rounded"></span> Protein {proteinPercent}%</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 inline-block rounded"></span> Fat {fatPercent}%</span>
                            </div>
                        </div>

                        {/* Weekly Calories */}
                        <div>
                            <h3 className="font-medium mb-3">Weekly Calories</h3>
                            {getWeekCalories().map((d, idx) => (
                                <div key={idx} className="mb-2">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>{d.day}</span>
                                        <span>{d.cal} cal</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded">
                                        <div
                                            className="h-2 bg-orange-500 rounded"
                                            style={{ width: `${Math.min((d.cal / 2000) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Badges */}
                    <section className="w-full max-w-3xl mt-6">
                        <h2 className="text-xl font-semibold mb-4">🏅 Achievements</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className={`p-4 rounded-xl shadow text-center ${waterCups >= 8 ? "bg-blue-100" : "bg-gray-100"}`}>
                                <p className="text-3xl">💧</p>
                                <p className="font-medium">Hydration Master</p>
                                <p className="text-xs text-gray-500">8 cups in a day</p>
                            </div>
                            <div className={`p-4 rounded-xl shadow text-center ${totalCalories >= 2000 ? "bg-orange-100" : "bg-gray-100"}`}>
                                <p className="text-3xl">🔥</p>
                                <p className="font-medium">Calorie Crusher</p>
                                <p className="text-xs text-gray-500">2000 cal goal</p>
                            </div>
                            <div className={`p-4 rounded-xl shadow text-center ${filteredMeals.length > 0 ? "bg-green-100" : "bg-gray-100"}`}>
                                <p className="text-3xl">📅</p>
                                <p className="font-medium">Daily Logger</p>
                                <p className="text-xs text-gray-500">Log meals today</p>
                            </div>
                        </div>
                    </section>

                    {/* Export / Import */}
                    <section className="w-full max-w-3xl mt-6 bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">📂 Data Export / Import</h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => {
                                    const data = { meals, waterCups };
                                    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = "nutrition-data.json";
                                    a.click();
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Export JSON
                            </button>
                            <input
                                type="file"
                                accept="application/json"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            const text = ev.target?.result as string;
                                            const data = JSON.parse(text);
                                            if (data.meals && data.waterCups !== undefined) {
                                                setMeals(data.meals);
                                                setWaterCups(data.waterCups);
                                            }
                                        };
                                        reader.readAsText(file);
                                    }
                                }}
                                className="border rounded px-3 py-2"
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default NutritionHydration;
