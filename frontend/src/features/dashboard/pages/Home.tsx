
import { User, Sparkles, Flame, Clock } from "lucide-react";
import Navbar from "@/components/Navbar.tsx";
import {Link} from "react-router-dom";

const Home = () => {


    const progressData = [
        { title: "Calories", value: 0, icon: Flame, color: "text-orange-500" },
        { title: "Minutes", value: 0, icon: Clock, color: "text-green-500" },
        { title: "Day Streak", value: 0, icon: Sparkles, color: "text-blue-500" },
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
            <Navbar />

            <div className="flex-1 flex flex-col space-y-8 pb-20 md:pb-0">
                <header className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                            {getGreeting()}, rreze! <span className="ml-2 text-3xl">👋</span>
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Ready to crush your fitness goals?
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold shadow-md">
                        <User className="h-6 w-6" />
                    </div>
                </header>

                <div className="relative overflow-hidden p-8 rounded-2xl shadow-lg bg-gradient-to-br from-green-400 to-blue-500 text-white">
                    <div className="flex items-start">
                        <div className="flex-grow">
                            <h3 className="text-2xl font-semibold mb-2 flex items-center">
                                <Sparkles className="h-6 w-6 text-yellow-300 mr-2" />
                                AI Powered
                            </h3>
                            <p className="text-lg">
                                Get the best suggestions for your body, powered by AI, to help you reach your fitness goals faster and smarter.
                            </p>
                        </div>
                    </div>
                    <Link to="/ai">
                        <button className="mt-6 px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 bg-white text-blue-600 shadow-md">
                            Get AI Suggestion
                        </button>
                    </Link>
                </div>

                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Today's Progress</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {progressData.map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center text-center">
                                <div className={`text-4xl font-bold mb-2 ${item.color}`}>{item.value}</div>
                                <div className="text-lg text-gray-500 flex items-center">
                                    <item.icon className={`h-5 w-5 mr-2 ${item.color}`} />
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
