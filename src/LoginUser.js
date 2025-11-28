import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function LoginUser() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/loginuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Store token in localStorage
        localStorage.setItem("token", data.token);

        // Store user ID in localStorage
        // localStorage.setItem("user_id", data.user.id);

        // Update context (if needed)
        login(data.token, data.user);

        setSuccess("Login successful!");
        navigate("/userpanel");
      } else if (response.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(data.error || "An unexpected error occurred.");
      }
    } catch (err) {
      console.log(err);
      setError("Network error.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100">
      {/* Left side - Brand */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center text-white px-8">
          <div className="w-20 h-20 bg-white/10 rounded-3xl backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/20">
            <i className="fa-solid fa-key text-3xl text-white"></i>
          </div>
          <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
          <p className="text-emerald-100 text-lg leading-relaxed max-w-md">
            Access your personal dashboard and continue your property search journey
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fa-solid fa-sign-in-alt text-2xl text-white"></i>
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-2">User Login</h2>
            <p className="text-slate-600">Welcome back! Please sign in to your account</p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-center">
                <i className="fa-solid fa-circle-exclamation mr-2"></i>
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-center">
                <i className="fa-solid fa-circle-check mr-2"></i>
                {success}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           placeholder-slate-400 text-slate-700 shadow-sm transition-all"
                  placeholder="john@example.com"
                />
                <div className="absolute right-4 top-4 text-slate-400">
                  <i className="fa-solid fa-envelope"></i>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           placeholder-slate-400 text-slate-700 shadow-sm transition-all"
                  placeholder="••••••••"
                />
                <div className="absolute right-4 top-4 text-slate-400">
                  <i className="fa-solid fa-lock"></i>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 
                       text-white rounded-xl font-semibold text-lg 
                       hover:from-emerald-700 hover:to-green-700 
                       transition-all duration-200 transform hover:scale-[1.02]
                       shadow-lg hover:shadow-xl active:scale-95"
            >
              <i className="fa-solid fa-arrow-right-to-bracket mr-2"></i>
              Sign In
            </button>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-slate-600">
                Don't have an account?{" "}
                <a
                  href="/signup_user"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  Create one here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}