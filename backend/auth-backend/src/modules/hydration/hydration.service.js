import HydrationRepo from "./hydration.repo.js";

const HydrationService = {
  addCupToday: () =>
    new Promise((resolve, reject) => {
      HydrationRepo.addCupToday((err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    }),

  getSummary: (mode) =>
    new Promise((resolve, reject) => {
      if (mode === "weekly") {
        HydrationRepo.getWeek((err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      } else {
        HydrationRepo.getToday((err, rows) => {
          if (err) reject(err);
          else resolve(rows.length ? rows[0] : { date: new Date(), waterCups: 0 });
        });
      }
    }),
};

export default HydrationService;
