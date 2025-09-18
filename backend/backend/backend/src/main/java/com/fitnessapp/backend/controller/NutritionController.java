package com.fitnessapp.backend.controller;

import com.fitnessapp.backend.model.Meal;
import com.fitnessapp.backend.service.NutritionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/nutrition")
@CrossOrigin(origins = "http://localhost:5173")
public class NutritionController {

    private final NutritionService nutritionService;

    public NutritionController(NutritionService nutritionService) {
        this.nutritionService = nutritionService;
    }

    @PostMapping("/add")
    public Meal addMeal(@RequestBody Meal meal) {
        return nutritionService.addMeal(meal);
    }

    @GetMapping("/summary")
    public List<Meal> getSummary(@RequestParam(defaultValue = "daily") String mode) {
        return nutritionService.getSummary(mode);
    }
}
