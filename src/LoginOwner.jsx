import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // ✅ import AuthContext

export default function LoginOwner() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ get login from AuthContext

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
      const response = await fetch('http://localhost:8000/api/loginowner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      // ✅ login endpoint should return 200
      if (response.status === 200) {
        // Save token + user in AuthContext
        login(data.token, data.user);

        setSuccess('Login successful!');
        navigate('/ownerpanel');
      } else if (response.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError(data.error || 'An unexpected error occurred.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-10 space-y-8"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8">
          Owner Login
        </h2>

        {error && <div className="text-red-600 text-center font-medium mb-4">{error}</div>}
        {success && <div className="text-green-600 text-center font-medium mb-4">{success}</div>}

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
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white placeholder-slate-400"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <a href="/signup_owner" className="text-blue-600 hover:underline font-medium">
            Don't have an account? Register
          </a>
        </div>
      </form>
    </div>
  );
}
