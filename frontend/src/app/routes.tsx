// src/app/routes.tsx
import { type RouteObject, Navigate } from "react-router-dom";
import Home from "@/features/dashboard/pages/Home";
import AI from "@/features/ai/AI";
import NutritionHydration from "@/features/dashboard/pages/NutritionHydration";
import Social from "@/features/dashboard/pages/Social";
import PremiumSubscription from "@/features/dashboard/pages/SubsandPayments";
import Profile from "@/features/dashboard/pages/Profile";

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
        element: <Social />,
    },
    {
        path: "/extra",
        element: <PremiumSubscription />,
    },
    // Catch-all redirect to homepage
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
    {
        path: "/Profile",
        element: <Profile/>,
    },
];
