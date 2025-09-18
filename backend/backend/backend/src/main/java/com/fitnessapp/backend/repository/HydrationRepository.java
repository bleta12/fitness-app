package com.fitnessapp.backend.repository;

import com.fitnessapp.backend.model.Hydration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HydrationRepository extends JpaRepository<Hydration, Long> {
    Optional<Hydration> findByDate(String date);
}
