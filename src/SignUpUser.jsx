import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function SignupUser() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const response = await fetch("http://localhost:8000/api/signupuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.status === 201) {
        login(data.token, data.user);
        setSuccess("Account created successfully!");
        navigate("/userpanel");
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
    <div className="min-h-screen flex">
      {/* Left side brand area */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <h1 className="absolute text-[6rem] font-extrabold text-white/10 select-none">
          HomeFinder
        </h1>
        <div className="relative z-10 text-center max-w-md">
          <h2 className="text-4xl font-bold mb-4">Welcome to HomeFinder</h2>
          <p className="text-lg text-blue-100">
            Create an account and explore properties with ease.
          </p>
        </div>
      </div>

      {/* Right side signup form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12 bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 dark:border-gray-700 p-10 space-y-8"
        >
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            User Signup
          </h2>

          {error && (
            <div className="text-red-600 text-center font-medium mb-4">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-center font-medium mb-4">{success}</div>
          )}

          {/* Name */}
          <div>
            <label
              className="block text-slate-700 dark:text-slate-200 font-medium mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border-2 border-slate-200 dark:border-gray-600 rounded-xl 
                         focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                         text-lg bg-white dark:bg-gray-900 dark:text-white placeholder-slate-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-slate-700 dark:text-slate-200 font-medium mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border-2 border-slate-200 dark:border-gray-600 rounded-xl 
                         focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                         text-lg bg-white dark:bg-gray-900 dark:text-white placeholder-slate-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-slate-700 dark:text-slate-200 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-5 py-3 border-2 border-slate-200 dark:border-gray-600 rounded-xl 
                         focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 
                         text-lg bg-white dark:bg-gray-900 dark:text-white placeholder-slate-400"
              placeholder="Enter your password (min. 6 characters)"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 
                       hover:from-blue-700 hover:to-blue-800 
                       text-white rounded-xl font-semibold text-lg 
                       shadow-lg hover:shadow-2xl transition-all duration-200"
          >
            Sign Up
          </button>

          {/* Footer */}
          <div className="text-center mt-4">
            <a
              href="/login_user"
              className="text-blue-600 hover:underline font-medium"
            >
              Already have an account? Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
