import db from "../../config.js";

const HydrationRepo = {
  addCupToday: (callback) => {
    const sql = `
      INSERT INTO hydration (date, waterCups)
      VALUES (CURDATE(), 1)
      ON DUPLICATE KEY UPDATE waterCups = waterCups + 1
    `;
    db.query(sql, callback);
  },

  // get today's count
  getToday: (callback) => {
    const sql = `SELECT date, waterCups FROM hydration WHERE date = CURDATE()`;
    db.query(sql, callback);
  },

  // last 7 days
  getWeek: (callback) => {
    const sql = `
      SELECT date, waterCups
      FROM hydration
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      ORDER BY date ASC
    `;
    db.query(sql, callback);
  },
};

export default HydrationRepo;
