package com.fitnessapp.backend.controller;

import com.fitnessapp.backend.model.MealLog;
import com.fitnessapp.backend.repository.MealLogRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/nutrition")
public class MealLogController {

    private final MealLogRepository repo;

    public MealLogController(MealLogRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/add")
    public MealLog addMeal(@RequestBody MealLog meal) {
        meal.setLogDate(LocalDate.now());
        meal.setLogTime(LocalTime.now());
        return repo.save(meal);
    }

    @GetMapping("/summary")
    public List<MealLog> getTodayMeals(@RequestParam Long userId) {
        return repo.findAllByUserIdAndLogDate(userId, LocalDate.now());
    }
}
