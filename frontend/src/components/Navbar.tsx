// components/Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Dumbbell,
    User,
    Zap,
    Sparkles,
    Carrot,
    MessageCircle,
    MoreHorizontal,
    HeartPlus,
    Umbrella,
} from "lucide-react";

export interface NavLink {
    name: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    id: string;
    path: string;
}

const navLinks: NavLink[] = [
    { name: "Home", icon: Home, id: "Home", path: "/" },
    { name: "AI Plans", icon: Sparkles, id: "AI", path: "/ai" },
    { name: "WorkoutTracking", icon: Dumbbell, id: "WorkoutTracking", path: "/WorkoutTracking" },
    { name: "Nutrition", icon: Carrot, id: "Nutrition", path: "/nutrition" },
    { name: "Social", icon: MessageCircle, id: "Social", path: "/social" },
    { name: "Profile", icon: User, id: "Profile", path: "/profile" },
    { name: "Extra", icon: Zap, id: "Extra", path: "/extra" },
    { name: "Recovery", icon: HeartPlus, id: "Recovery", path: "/recovery" },
    { name: "Fabrika Makina", icon: Umbrella, id: "FabrikaMakina", path: "/fabrika-makina" },


];

const Navbar: React.FC = () => {
    const location = useLocation();
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const visibleLinks = navLinks.slice(0, 3);
    const hiddenLinks = navLinks.slice(3);

    // Desktop Navigation
    const DesktopNav = () => (
        <div className="hidden md:flex flex-col w-64 bg-green-50 rounded-2xl shadow-lg p-6 mr-8">

            {/* Logo */}
            <div className="flex items-center mb-10">
                <Zap className="h-8 w-8 text-blue-500 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">FitAI</h1>
            </div>

            {/* LOGIN & SIGNUP BUTTONS ABOVE HOME */}
            <div className="mb-4 space-y-2">
                <Link
                    to="/login"
                    className="w-full flex items-center px-4 py-3 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600"
                >
                    <User className="h-5 w-5 mr-3" />
                    Log in
                </Link>
                <Link
                    to="/signup"
                    className="w-full flex items-center px-4 py-3 rounded-lg font-medium text-white bg-green-500 hover:bg-green-600"
                >
                    <User className="h-5 w-5 mr-3" />
                    Sign up
                </Link>
            </div>

            {/* Main Navigation Links */}
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {navLinks.map((link) => (
                        <li key={link.id}>
                            <Link
                                to={link.path}
                                className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${isActive(link.path)
                                    ? "bg-green-100 text-green-800"
                                    : "hover:bg-green-100 text-gray-600"
                                    }`}
                            >
                                <link.icon className="h-5 w-5 mr-3" />
                                <span>{link.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );

    // Mobile Navigation
    const MobileNav = () => (
        <nav className="fixed bottom-0 left-0 w-full md:hidden bg-white shadow-xl rounded-t-2xl p-4 z-50">
            <div className="flex justify-around items-center h-full relative">
                {visibleLinks.map((link) => (
                    <Link
                        key={link.id}
                        to={link.path}
                        className={`flex flex-col items-center justify-center space-y-1 transition-colors ${isActive(link.path) ? "text-green-600" : "text-gray-400"
                            }`}
                    >
                        <div
                            className={`p-2 rounded-full transition-colors ${isActive(link.path) ? "bg-green-100" : ""
                                }`}
                        >
                            <link.icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium">{link.name}</span>
                    </Link>
                ))}

                {hiddenLinks.length > 0 && (
                    <button
                        onClick={() => setShowMoreOptions(!showMoreOptions)}
                        className={`flex flex-col items-center justify-center space-y-1 transition-colors ${showMoreOptions ? "text-green-600" : "text-gray-400"
                            }`}
                    >
                        <div
                            className={`p-2 rounded-full transition-colors ${showMoreOptions ? "bg-green-100" : ""
                                }`}
                        >
                            <MoreHorizontal className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium">More</span>
                    </button>
                )}

                {showMoreOptions && (
                    <div className="absolute bottom-full mb-4 w-48 bg-white rounded-lg shadow-lg py-2 right-0">
                        {hiddenLinks.map((link) => (
                            <Link
                                key={link.id}
                                to={link.path}
                                onClick={() => setShowMoreOptions(false)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                                <link.icon className="h-4 w-4 mr-2" />
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );

    return (
        <>
            <DesktopNav />
            <MobileNav />
        </>
    );
};

export default Navbar;



