import express from "express";
import NutritionService from "./nutrition.service.js";
import NutritionModel from "./nutrition.model.js";

const router = express.Router();

// initialize table on router load
NutritionModel.createTable();

// POST /nutrition/add
router.post("/add", async (req, res) => {
  try {
    const meal = req.body;
    if (!meal?.name || !meal?.calories || !meal?.time || !meal?.mealType || !meal?.date) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    await NutritionService.addMeal(meal);
    res.json({ message: "Meal added successfully" });
  } catch (err) {
    console.error("❌ Error adding meal:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /nutrition/summary?mode=daily|weekly
router.get("/summary", async (req, res) => {
  try {
    const { mode = "daily" } = req.query;
    const meals = await NutritionService.getMeals(mode);
    res.json(meals);
  } catch (err) {
    console.error("❌ Error getting meals:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;