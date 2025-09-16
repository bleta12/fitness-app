// src/app/routes.tsx
import { type RouteObject, Navigate } from "react-router-dom";
import Home from "@/features/dashboard/pages/Home";
import AI from "@/features/ai/AI";
import NutritionHydration from "@/features/dashboard/pages/NutritionHydration";
import Social from "@/features/dashboard/pages/Social";
import PremiumSubscription from "@/features/dashboard/pages/SubsandPayments";
import Profile from "@/features/dashboard/pages/Profile";
import RecoveryWellness from "@/features/dashboard/pages/RecoveryWellness";


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
    {
        path: "/recovery",
        element: <RecoveryWellness />,
    },
    // Catch-all redirect to homepage
    {
        path: "*",
        element: <Navigate to="/" replace />,
    },
    {
        path: "/Profile",
        element: <Profile />,
    },
];
