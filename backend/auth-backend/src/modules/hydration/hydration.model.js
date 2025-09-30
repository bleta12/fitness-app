import db from "../../config.js";

const HydrationModel = {
  createTable: () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS hydration (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL UNIQUE,
        waterCups INT NOT NULL DEFAULT 0
      )
    `;
    db.query(sql, (err) => {
      if (err) console.error("❌ Error creating hydration table:", err);
      else console.log("✅ Hydration table ready.");
    });
  },
};

export default HydrationModel;
