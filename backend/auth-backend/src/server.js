import events from "events";
events.defaultMaxListeners = 0;
import express from "express";
import cors from "cors";
import authRoutes from "../routes/auth.js";
import aiRouter from "./modules/ai/ai.resource.js";
import nutritionRouter from "./modules/nutrition/nutrition.resource.js";
import hydrationRouter from "./modules/hydration/hydration.resource.js";
import notificationRouter from "./modules/notifications/notification.resource.js";
import fabrikaRouter from "./modules/fabrika/fabrika.resource.js";
import makinaRouter from "./modules/makina/makina.resource.js";
import mysqlDB from "../src/config.js";
import "./db/mongo.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Routes
app.use("/auth", authRoutes);
app.use("/api/ai", aiRouter);
app.use("/nutrition", nutritionRouter);
app.use("/hydration", hydrationRouter);
app.use("/notifications", notificationRouter);
app.use("/fabrika", fabrikaRouter);
app.use("/makina", makinaRouter);


// Example MySQL route
app.get("/mysql-test", (req, res) => {
  mysqlDB.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Test route
app.get("/", (req, res) => res.send("Server running"));

app.listen(5000, () => console.log("Server running on port 5000"));
