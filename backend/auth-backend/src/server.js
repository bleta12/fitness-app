//import express from "express";
//import cors from "cors";
//import authRoutes from "../routes/auth.js";
//
//const app = express();
//
//app.use(cors());
//app.use(express.json());
//
//app.use("/auth", authRoutes);
//
//app.get("/",(req, res) => {
//    res.send("Api is running")
//})
//
//app.listen(5000, () => {
//    console.log("✅ Server running on http://localhost:5000");
//});
import express from "express";
import cors from "cors";
import authRoutes from "../routes/auth.js";
import aiRouter from "./modules/ai/ai.resource.js";
import mysqlDB from "./db/mysql.js";
import "./db/mongo.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Routes
app.use("/auth", authRoutes);
app.use("/api/ai", aiRouter);

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
