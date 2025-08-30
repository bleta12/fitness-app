// src/app/routes.tsx
import { type RouteObject, Navigate } from "react-router-dom";
import Home from "@/features/dashboard/pages/Home";
import AI from "@/features/ai/AI";
import NutritionHydration from "@/components/NutritionHydration";
import Social from "@/features/dashboard/pages/Social";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/ai",
        element: <AI />,
    },
    {
        path: "/nutrition",
        element: <NutritionHydration />,
    },
    {
        path: "/social",
        element: <Social/>,
    },
    // Catch-all redirect to homepage
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
];
