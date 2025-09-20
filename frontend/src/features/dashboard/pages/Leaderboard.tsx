// Leaderboard.tsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import feather from "feather-icons";
import Navbar from "@/components/Navbar";

type LeaderboardItem = {
  position: number;
  name: string;
  points: number;
  change: string;
  changeType: "up" | "down";
  color: string;
};

const leaderboardData: LeaderboardItem[] = [
  { position: 4, name: "Sophia Martinez", points: 4320, change: "+2.5%", changeType: "up", color: "bg-purple-500" },
  { position: 5, name: "James Wilson", points: 4150, change: "+1.8%", changeType: "up", color: "bg-blue-500" },
  { position: 6, name: "Olivia Brown", points: 3980, change: "-0.5%", changeType: "down", color: "bg-green-500" },
  { position: 7, name: "Liam Taylor", points: 3870, change: "+3.2%", changeType: "up", color: "bg-yellow-500" },
  { position: 8, name: "Ava Anderson", points: 3750, change: "+2.1%", changeType: "up", color: "bg-orange-500" },
  { position: 9, name: "Noah Thomas", points: 3640, change: "-1.7%", changeType: "down", color: "bg-red-500" },
  { position: 10, name: "Isabella Jackson", points: 3520, change: "+0.9%", changeType: "up", color: "bg-pink-500" },
];

const Leaderboard: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-quart", once: true });
    feather.replace();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-900 via-purple-600 to-cyan-400 text-gray-100">
      {/* Sidebar Navbar */}
       <div className="flex-2 flex p-8">
        <Navbar />
      </div>

      {/* Main Leaderboard Content */}
      <div className="flex-1 py-10 px-10 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12" data-aos="fade-down">
            <h1 className="text-4xl font-bold mb-2">Global Leaderboard</h1>
            <p className="text-xl opacity-90">Celebrating our top performers</p>
          </div>

          {/* Podium Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* 2nd Place */}
            <div
              className="podium flex flex-col items-center order-2 md:order-1"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <i data-feather="award" className="text-black-600 w-10 h-10"></i>
              </div>
              <div className="text-center">
                <span className="silver-gradient text-3xl font-bold">#2</span>
                <h3 className="text-xl font-semibold mt-2">Emma Johnson</h3>
                <p className="text-black-800">4,820 Points</p>
              </div>
            </div>

            {/* 1st Place */}
            <div
              className="podium flex flex-col items-center order-1 md:order-2"
              data-aos="fade-up"
            >
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-4 shadow-lg relative">
                <i data-feather="award" className="text-yellow-700 w-12 h-12"></i>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
              </div>
              <div className="text-center">
                <span className="gold-gradient text-4xl font-bold">#1</span>
                <h3 className="text-2xl font-bold mt-2">Alex Chen</h3>
                <p className="text-black-900">5,450 Points</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div
              className="podium flex flex-col items-center order-3"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <i data-feather="award" className="text-amber-900 w-10 h-10"></i>
              </div>
              <div className="text-center">
                <span className="bronze-gradient text-3xl font-bold">#3</span>
                <h3 className="text-xl font-semibold mt-2">Marcus Rivera</h3>
                <p className="text-black-300">4,650 Points</p>
              </div>
            </div>
          </div>

          {/* Leaderboard List */}
          <div
            className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="px-6 py-4 bg-white/5 border-b border-white/10">
              <h2 className="text-xl font-semibold">Top Performers</h2>
            </div>

            <div className="divide-y divide-white/10">
              {leaderboardData.map((player) => (
                <div
                  key={player.position}
                  className="leaderboard-item px-6 py-4 flex items-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${player.color} flex items-center justify-center mr-4`}
                  >
                    <span className="font-bold text-white">{player.position}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{player.name}</h3>
                    <p className="text-sm text-gray-300">
                      {player.points.toLocaleString()} Points
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-medium ${
                        player.changeType === "up"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {player.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="text-center mt-8 text-sm text-gray-300">
            <p>Leaderboard updates every 24 hours. Last updated: Today at 15:30</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
