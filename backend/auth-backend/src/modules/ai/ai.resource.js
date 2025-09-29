// src/ai/ai.resource.js
import { Router } from "express";
import AIService from "./ai.service.js"; // make sure this is also an ES module

const router = Router();
const aiService = new AIService();

// Generate a new AI workout
router.post("/generate", async (req, res) => {
  try {
    const workout = await aiService.generateWorkout(req.body);
    res.status(201).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate workout" });
  }
});

// List all workouts
router.get("/", async (req, res) => {
  try {
    const workouts = await aiService.listWorkouts();
    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch workouts" });
  }
});

// Get workout by ID
router.get("/:id", async (req, res) => {
  try {
    const workout = await aiService.getWorkout(req.params.id);
    if (!workout) return res.status(404).json({ error: "Workout not found" });
    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch workout" });
  }
});

// Delete workout by ID
router.delete("/:id", async (req, res) => {
  try {
    await aiService.deleteWorkout(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete workout" });
  }
});

// Save a workout manually
router.post("/save", async (req, res) => {
  try {
    const workout = await aiService.saveWorkout(req.body);
    res.status(201).json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save workout" });
  }
});

export default router; // ✅ ES module default export
