import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function SignupOwner() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/api/signupowner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Use the login function from context instead of directly setting localStorage
        login(data.token, data.user);
        
        setSuccess('Account created successfully!');
        navigate('/ownerpanel'); // redirect to owner panel
      } else if (response.status === 422) {
        setError('Validation failed. Check your input.');
      } else {
        // Handle specific error messages from backend if available
        setError(data.error || data.message || 'An unexpected error occurred.');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-10 space-y-8"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8">
          Owner Signup
        </h2>

        {error && <div className="text-red-600 text-center font-medium mb-4">{error}</div>}
        {success && <div className="text-green-600 text-center font-medium mb-4">{success}</div>}

        <div>
          <label className="block text-slate-700 font-medium mb-2" htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white placeholder-slate-400"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-medium mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white placeholder-slate-400"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-medium mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white placeholder-slate-400"
            placeholder="Enter your password (min. 6 characters)"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Sign Up
        </button>

        <div className="text-center mt-4">
          <a href="/login_owner" className="text-blue-600 hover:underline font-medium">
            Already have an account? Login
          </a>
        </div>
      </form>
    </div>
  );
}