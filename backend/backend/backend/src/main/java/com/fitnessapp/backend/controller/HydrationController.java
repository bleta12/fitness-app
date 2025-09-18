package com.fitnessapp.backend.controller;

import com.fitnessapp.backend.model.Hydration;
import com.fitnessapp.backend.service.HydrationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hydration")
@CrossOrigin(origins = "http://localhost:5173")
public class HydrationController {

    private final HydrationService hydrationService;

    public HydrationController(HydrationService hydrationService) {
        this.hydrationService = hydrationService;
    }

    @PostMapping("/add")
    public Hydration addCup() {
        return hydrationService.addCup();
    }

    @GetMapping("/summary")
    public Hydration getSummary() {
        return hydrationService.getSummary();
    }
}
