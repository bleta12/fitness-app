package com.fitnessapp.backend.repository;

import com.fitnessapp.backend.model.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByDate(String date);
    List<Meal> findByDateBetween(String startDate, String endDate);
}
