import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function LoginOwner() {
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
      const response = await fetch("http://localhost:8000/api/loginowner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Store token in localStorage
        localStorage.setItem("token", data.token);

        // Store owner ID in localStorage
        localStorage.setItem("owner_id", data.user.id);

        // Update context (if needed)
        login(data.token, data.user);

        setSuccess("Login successful!");
        navigate("/ownerpanel");
      } else if (response.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(data.error || "An unexpected error occurred.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 px-4 overflow-hidden">
      <h1 className="absolute text-[6rem] sm:text-[8rem] font-extrabold text-white/10 select-none">
        HomeFinder
      </h1>

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Owner Login
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="text-red-500 text-center font-medium">{error}</div>}
          {success && <div className="text-green-600 text-center font-medium">{success}</div>}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <a href="/signup_owner" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
