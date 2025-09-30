import db from "../../config.js";

const NutritionModel = {
  createTable: () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS meals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        calories INT NOT NULL,
        carbs INT NOT NULL,
        protein INT NOT NULL,
        fat INT NOT NULL,
        time VARCHAR(20) NOT NULL,
        mealType VARCHAR(50) NOT NULL,
        icon VARCHAR(10),
        color VARCHAR(30),
        date DATE NOT NULL
      )
    `;
    db.query(sql, (err) => {
      if (err) console.error("❌ Error creating meals table:", err);
      else console.log("✅ Meals table ready.");
    });
  },
};

export default NutritionModel;