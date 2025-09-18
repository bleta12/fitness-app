package com.fitnessapp.backend.model;

import jakarta.persistence.*;

@Entity
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int calories;
    private int carbs;
    private int protein;
    private int fat;
    private String time;
    private String mealType;
    private String icon;
    private String color;
    private String date; // YYYY-MM-DD

    // --- Constructors ---
    public Meal() {}

    public Meal(Long id, String name, int calories, int carbs, int protein, int fat,
                String time, String mealType, String icon, String color, String date) {
        this.id = id;
        this.name = name;
        this.calories = calories;
        this.carbs = carbs;
        this.protein = protein;
        this.fat = fat;
        this.time = time;
        this.mealType = mealType;
        this.icon = icon;
        this.color = color;
        this.date = date;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }

    public int getCarbs() { return carbs; }
    public void setCarbs(int carbs) { this.carbs = carbs; }

    public int getProtein() { return protein; }
    public void setProtein(int protein) { this.protein = protein; }

    public int getFat() { return fat; }
    public void setFat(int fat) { this.fat = fat; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getMealType() { return mealType; }
    public void setMealType(String mealType) { this.mealType = mealType; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
