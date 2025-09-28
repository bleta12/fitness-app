import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import fitnessImage from "@/components/images/fitness1.jpg";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created successfully! 🎉 Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Server error. Please try again."+ err);
    }
  };

  return (
      <div className="min-h-screen flex">
        <div
            className="hidden md:flex w-2/5 bg-cover bg-center rounded-l-3xl"
            style={{ backgroundImage: `url(${fitnessImage})` }}
        >
          <div className="bg-black bg-opacity-40 flex items-center justify-center w-full h-full rounded-l-3xl p-4">
            <h1 className="text-white text-3xl font-bold text-center">
              Join the Movement. Start Your Fitness Journey Today.
            </h1>
          </div>
        </div>

        <div className="w-full md:w-2/3 flex items-center justify-center p-8 bg-gradient-to-b from-green-100 to-white">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 transform transition-transform duration-500 hover:scale-[1.01]">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Create Account
            </h2>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Username */}
              <div className="flex items-center border rounded-xl p-2 bg-green-50 focus-within:ring-2 focus-within:ring-green-400">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Full Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent outline-none p-2"
                    required
                />
              </div>

              {/* Email */}
              <div className="flex items-center border rounded-xl p-2 bg-green-50 focus-within:ring-2 focus-within:ring-green-400">
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

              {/* Password */}
              <div className="flex items-center border rounded-xl p-2 bg-green-50 focus-within:ring-2 focus-within:ring-green-400">
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

              {/* Confirm Password */}
              <div className="flex items-center border rounded-xl p-2 bg-green-50 focus-within:ring-2 focus-within:ring-green-400">
                <Lock className="h-5 w-5 text-gray-400 mr-2" />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent outline-none p-2"
                    required
                />
              </div>

              {/* Error / Success messages */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-500 hover:to-blue-600 transition-colors"
              >
                Sign up
              </button>
            </form>

            <p className="mt-4 text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-green-500 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default Signup;
