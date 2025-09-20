import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        alert("Login successful!");
        navigate("/profile"); // redirect after login
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 to-white p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Welcome Back!</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
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

          {/* Password Input */}
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-500 hover:to-blue-600 transition-colors"
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
  );
};

export default Login;
