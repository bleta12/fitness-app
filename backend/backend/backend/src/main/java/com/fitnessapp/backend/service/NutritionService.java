package com.fitnessapp.backend.service;

import com.fitnessapp.backend.model.Meal;
import com.fitnessapp.backend.repository.MealRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NutritionService {

    private final MealRepository mealRepository;

    public NutritionService(MealRepository mealRepository) {
        this.mealRepository = mealRepository;
    }

    public Meal addMeal(Meal meal) {
        return mealRepository.save(meal);
    }

    public List<Meal> getSummary(String mode) {
        String today = LocalDate.now().toString();
        if ("daily".equalsIgnoreCase(mode)) {
            return mealRepository.findByDate(today);
        } else { // weekly
            LocalDate start = LocalDate.now().minusDays(6);
            return mealRepository.findByDateBetween(start.toString(), today);
        }
    }
}
