import axios from "axios";

const API_URL = "http://localhost:8080/api/meals";

export const getAllMeals = () => axios.get(API_URL);
export const getDailyMeals = () => axios.get(`${API_URL}/daily`);
export const getWeeklyMeals = () => axios.get(`${API_URL}/weekly`);
export const addMeal = (meal: any) => axios.post(API_URL, meal);
export const updateMeal = (id: number, meal: any) => axios.put(`${API_URL}/${id}`, meal);
export const deleteMeal = (id: number) => axios.delete(`${API_URL}/${id}`);
