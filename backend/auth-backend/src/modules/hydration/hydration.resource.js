import express from "express";
import HydrationModel from "./hydration.model.js";
import HydrationService from "./hydration.service.js";

const router = express.Router();

// initialize table on router load
HydrationModel.createTable();

// POST /hydration/add
router.post("/add", async (_req, res) => {
  try {
    await HydrationService.addCupToday();
    res.json({ message: "Water cup added" });
  } catch (err) {
    console.error("❌ Error adding water cup:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /hydration/summary?mode=daily|weekly
router.get("/summary", async (req, res) => {
  try {
    const { mode = "daily" } = req.query;
    const data = await HydrationService.getSummary(mode);
    res.json(data);
  } catch (err) {
    console.error("❌ Error getting hydration:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
