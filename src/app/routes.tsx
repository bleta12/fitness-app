// src/app/routes.tsx
import { type RouteObject, Navigate } from "react-router-dom";
import Home from "@/features/dashboard/pages/Home";
import AI from "@/features/ai/AI";
import NutritionHydration from "@/features/dashboard/pages/NutritionHydration";
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
    // Catch-all redirect to homepage
    {
        path: "/nutrition",
        element: <NutritionHydration />,
    },

    {
        path:"/social",
        element:<Social/>,
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },


];
