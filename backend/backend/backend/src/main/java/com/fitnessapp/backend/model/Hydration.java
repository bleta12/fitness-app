package com.fitnessapp.backend.model;

import jakarta.persistence.*;

@Entity
public class Hydration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int cups;
    private String date; // YYYY-MM-DD

    // --- Constructors ---
    public Hydration() {}

    public Hydration(Long id, int cups, String date) {
        this.id = id;
        this.cups = cups;
        this.date = date;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getCups() { return cups; }
    public void setCups(int cups) { this.cups = cups; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
