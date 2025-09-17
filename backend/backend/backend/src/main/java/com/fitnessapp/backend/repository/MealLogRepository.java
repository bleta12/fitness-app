package com.fitnessapp.backend.repository;

import com.fitnessapp.backend.model.MealLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface MealLogRepository extends JpaRepository<MealLog, Long> {
    List<MealLog> findAllByUserIdAndLogDate(Long userId, LocalDate logDate);
}
