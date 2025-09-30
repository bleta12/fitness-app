import NutritionRepo from "./nutrition.repo.js";

const NutritionService = {
  addMeal: (meal) =>
    new Promise((resolve, reject) => {
      NutritionRepo.addMeal(meal, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    }),

  getMeals: (mode) =>
    new Promise((resolve, reject) => {
      NutritionRepo.getMeals(mode, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    }),
};

export default NutritionService;