import React, { useState } from 'react';

export default function AdminPanel() {
  const [section, setSection] = useState('dashboard');

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-lg flex flex-col py-10 px-6 sticky top-0 h-screen">
        <div className="mb-10 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-shield-halved text-white text-lg"></i>
          </div>
          <span className="ml-3 text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Admin Panel</span>
        </div>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setSection('dashboard')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              section === 'dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setSection('users')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              section === 'users'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setSection('properties')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              section === 'properties'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setSection('settings')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              section === 'settings'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Settings
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Content will be added later */}
      </main>
    </div>
  );
}