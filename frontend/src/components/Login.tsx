import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import fitnessImage from "@/components/images/fitness1.jpg";

const quotes = [
  "Push yourself because no one else is going to do it for you!",
  "The body achieves what the mind believes.",
  "Strive for progress, not perfection.",
];

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/profile"); // redirect after login
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden md:flex w-2/5 bg-cover bg-center rounded-l-3xl"
        style={{ backgroundImage: `url(${fitnessImage})` }}
      >
        <div className="bg-black bg-opacity-30 flex items-center justify-center w-full h-full rounded-l-3xl p-4">
          <h1 className="text-white text-3xl font-bold text-center">
            Get Fit. Stay Strong. Join Our Community.
          </h1>
        </div>
      </div>

      <div className="w-full md:w-2/3 flex items-center justify-center p-8 bg-gradient-to-b from-green-100 to-white">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 transform transition-transform duration-500 hover:scale-[1.01]">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome Back!</h2>

          <p className="text-center text-green-800 font-semibold mb-6 italic">
            "{randomQuote}"
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center border rounded-xl p-2 bg-green-50 focus-within:ring-2 focus-within:ring-green-400 transform transition-transform duration-200 focus-within:scale-105">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none p-2"
                required
              />
            </div>

            <div className="flex items-center border rounded-xl p-2 bg-green-50 focus-within:ring-2 focus-within:ring-green-400 transform transition-transform duration-200 focus-within:scale-105">
              <Lock className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none p-2"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Log in
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-500 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;






