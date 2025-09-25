// server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678", // vendos fjalëkalimin tënd
  database: "fitnessapp" // emri sipas Workbench
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL");
});


// ================= HYDRATION =================

// ➕ Shto gotë uji
app.post("/hydration/add", (req, res) => {
  const { cups } = req.body;
  const sql = "INSERT INTO hydration (cups, date) VALUES (?, CURDATE())";
  db.query(sql, [cups], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Water logged", id: result.insertId });
  });
});

// 📊 Merr totalin e ujit sot
app.get("/hydration/summary", (req, res) => {
  const sql = "SELECT SUM(cups) as totalCups FROM hydration WHERE date = CURDATE()";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});


// ================= MEALS =================

// ➕ Shto një vakt
app.post("/meals/add", (req, res) => {
  const { name, calories, carbs, protein, fat } = req.body;
  const sql = "INSERT INTO meal (name, calories, carbs, protein, fat) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, calories, carbs, protein, fat], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Meal added", id: result.insertId });
  });
});

// 📊 Merr të gjitha vaktet
app.get("/meals", (req, res) => {
  const sql = "SELECT * FROM meal";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// ================= MEAL LOGS =================

// ➕ Regjistro një vakt të ngrënë nga përdoruesi
app.post("/meal_logs/add", (req, res) => {
  const { meal_id } = req.body;
  const sql = "INSERT INTO meal_logs (meal_id, date) VALUES (?, CURDATE())";
  db.query(sql, [meal_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Meal logged", id: result.insertId });
  });
});

// 📊 Merr total kalori dhe makronutrientë për sot
app.get("/meal_logs/summary", (req, res) => {
  const sql = `
    SELECT SUM(m.calories) as totalCalories,
           SUM(m.carbs) as totalCarbs,
           SUM(m.protein) as totalProtein,
           SUM(m.fat) as totalFat
    FROM meal_logs ml
    JOIN meal m ON ml.meal_id = m.id
    WHERE ml.date = CURDATE()
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});


// ================= START SERVER =================
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
