import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function SignupOwner() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" , password: "" });
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
      const response = await fetch("http://localhost:8000/api/signupowner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.status === 201) {
        login(data.token, data.user);
        setSuccess("Account created successfully!");
        navigate("/ownerpanel");
      } else if (response.status === 422) {
        setError("Validation failed. Check your input.");
      } else {
        setError(data.error || data.message || "An unexpected error occurred.");
      }
    } catch (error) {
      setError("Network error. Please check your connection.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Left side - Brand */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center text-white px-8">
          <div className="w-20 h-20 bg-white/10 rounded-3xl backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/20">
            <i className="fa-solid fa-home text-3xl text-white"></i>
          </div>
          <h1 className="text-5xl font-bold mb-4">HomeFinder</h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-md">
            Join thousands of property owners managing their listings with our powerful platform
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fa-solid fa-user-plus text-2xl text-white"></i>
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-2">Join as Owner</h2>
            <p className="text-slate-600">Create your account in seconds</p>
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

            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-slate-400 text-slate-700 shadow-sm transition-all"
                  placeholder="John Doe"
                />
                <div className="absolute right-4 top-4 text-slate-400">
                  <i className="fa-solid fa-user"></i>
                </div>
              </div>
            </div>

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
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-slate-400 text-slate-700 shadow-sm transition-all"
                  placeholder="john@example.com"
                />
                <div className="absolute right-4 top-4 text-slate-400">
                  <i className="fa-solid fa-envelope"></i>
                </div>
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Phone</label>
              <div className="relative">
                <input
                  type="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-slate-400 text-slate-700 shadow-sm transition-all"
                  placeholder="0612345678"
                />
                <div className="absolute right-4 top-4 text-slate-400">
                  <i className="fa-solid fa-lock"></i>
                </div>
              </div>
              <p className="text-xs text-slate-500">Minimum 10 characters</p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-slate-400 text-slate-700 shadow-sm transition-all"
                  placeholder="••••••••"
                />
                <div className="absolute right-4 top-4 text-slate-400">
                  <i className="fa-solid fa-lock"></i>
                </div>
              </div>
              <p className="text-xs text-slate-500">Minimum 6 characters</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white rounded-xl font-semibold text-lg 
                       hover:from-blue-700 hover:to-blue-800 
                       transition-all duration-200 transform hover:scale-[1.02]
                       shadow-lg hover:shadow-xl active:scale-95"
            >
              <i className="fa-solid fa-rocket mr-2"></i>
              Create Account
            </button>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-slate-600">
                Already have an account?{" "}
                <a
                  href="/login_owner"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}