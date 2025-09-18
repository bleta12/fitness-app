package com.fitnessapp.backend.service;

import com.fitnessapp.backend.model.Hydration;
import com.fitnessapp.backend.repository.HydrationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class HydrationService {

    private final HydrationRepository hydrationRepository;

    public HydrationService(HydrationRepository hydrationRepository) {
        this.hydrationRepository = hydrationRepository;
    }

    public Hydration addCup() {
        String today = LocalDate.now().toString();
        Hydration hydration = hydrationRepository.findByDate(today)
                .orElse(new Hydration(null, 0, today));
        hydration.setCups(hydration.getCups() + 1);
        return hydrationRepository.save(hydration);
    }

    public Hydration getSummary() {
        String today = LocalDate.now().toString();
        return hydrationRepository.findByDate(today)
                .orElse(new Hydration(null, 0, today));
    }
}
