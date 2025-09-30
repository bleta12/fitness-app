import db from "../../config.js";

const NutritionRepo = {
  addMeal: (meal, callback) => {
    const sql = `
      INSERT INTO meals
      (name, calories, carbs, protein, fat, time, mealType, icon, color, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        meal.name,
        meal.calories,
        meal.carbs,
        meal.protein,
        meal.fat,
        meal.time,
        meal.mealType,
        meal.icon,
        meal.color,
        meal.date,
      ],
      callback
    );
  },

  getMeals: (mode, callback) => {
    let sql = "SELECT * FROM meals";
    if (mode === "daily") {
      sql += " WHERE date = CURDATE()";
    } else if (mode === "weekly") {
      sql += " WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)";
    }
    sql += " ORDER BY date ASC, time ASC";
    db.query(sql, callback);
  },
};

export default NutritionRepo;