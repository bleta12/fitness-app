// src/app/routes.tsx
import {type RouteObject, Navigate } from "react-router-dom";
import Home from "@/features/dashboard/pages/Home";
import AI from "@/features/ai/AI";

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
        path: "*",
        element: <Navigate to="/" replace />,
    },
];
