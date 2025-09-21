import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div id="main-container" className="min-h-[900px] bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header
        id="header"
        className="w-full px-8 py-5 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50"
      >
        {/* Logo */}
        <div className="flex items-center group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <i className="fa-solid fa-home text-white text-lg"></i>
          </div>
          <span className="ml-3 text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            HomeFinder
          </span>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center space-x-6">
          {/* Language Selector */}
          <div className="relative">
            <select className="bg-white/90 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md">
              <option value="fr">🇫🇷 FR</option>
              <option value="en">🇺🇸 EN</option>
              <option value="ar">🇲🇦 AR</option>
            </select>
          </div>

          {/* Owner Section */}
<div className="flex items-center gap-4">
  {/* Language Selector */}
  <div className="relative">
    <select className="bg-white/90 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md">
      <option value="fr">🇫🇷 FR</option>
      <option value="en">🇺🇸 EN</option>
      <option value="ar">🇲🇦 AR</option>
    </select>
  </div>

  {/* Auth Buttons */}
  <div className="flex gap-3">
    <Link to="/signup_owner">
      <button className="bg-gradient-to-r from-blue-500 to-blue-600 
        hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl 
        text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl
        transform hover:-translate-y-0.5 border border-blue-400/20">
        <i className="fa-solid fa-building mr-2"></i>
        Annonceur
      </button>
    </Link>

    <Link to="/signup_user">
      <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 
        hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl 
        text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl
        transform hover:-translate-y-0.5 border border-emerald-400/20">
        <i className="fa-solid fa-user mr-2"></i>
        Client
      </button>
    </Link>
  </div>
</div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex flex-col items-center justify-center px-8 py-24">
        {/* Hero Logo Section */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
              <i className="fa-solid fa-home text-white text-3xl"></i>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-3">HomeFinder</h1>
          <p className="text-slate-500 text-lg font-light">Powered by Artificial Intelligence</p>
        </div>

        {/* Search Section */}
        <div id="search-section" className="w-full max-w-3xl">
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="flex items-center bg-white border-2 border-slate-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 focus-within:border-blue-500 focus-within:search-glow group">
              <div className="pl-8 pr-4">
                <i className="fa-solid fa-search text-slate-400 text-xl group-focus-within:text-blue-500 transition-colors duration-200"></i>
              </div>
              <input type="text" placeholder="Ex: 2 chambres, 1 salon, quartier Gauthier" className="flex-1 py-6 px-3 text-xl text-slate-700 bg-transparent focus:outline-none placeholder-slate-400 font-light" />
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-4 rounded-xl mr-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
                <i className="fa-solid fa-search mr-2"></i>Search
              </button>
            </div>
          </div>
          {/* Tagline */}
          <p className="text-center text-slate-600 text-xl mb-12 font-light">
            Find your home with <span className="font-medium text-blue-600">AI-powered search</span>
          </p>
          {/* Quick Suggestions */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button className="suggestion-pulse bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-6 py-3 rounded-2xl text-sm border-2 border-slate-200 hover:border-blue-300 transition-all duration-200 shadow-md hover:shadow-lg">
              <i className="fa-solid fa-bed mr-2 text-blue-500"></i>2 Bedrooms
            </button>
            <button className="suggestion-pulse bg-white hover:bg-green-50 text-slate-700 hover:text-green-700 px-6 py-3 rounded-2xl text-sm border-2 border-slate-200 hover:border-green-300 transition-all duration-200 shadow-md hover:shadow-lg">
              <i className="fa-solid fa-location-dot mr-2 text-green-500"></i>Gauthier
            </button>
            <button className="suggestion-pulse bg-white hover:bg-yellow-50 text-slate-700 hover:text-yellow-700 px-6 py-3 rounded-2xl text-sm border-2 border-slate-200 hover:border-yellow-300 transition-all duration-200 shadow-md hover:shadow-lg">
              <i className="fa-solid fa-coins mr-2 text-yellow-500"></i>Under 5000 DH
            </button>
            <button className="suggestion-pulse bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 px-6 py-3 rounded-2xl text-sm border-2 border-slate-200 hover:border-purple-300 transition-all duration-200 shadow-md hover:shadow-lg">
              <i className="fa-solid fa-car mr-2 text-purple-500"></i>With Parking
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features-section" className="w-full max-w-6xl mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* AI-Powered */}
            <div className="feature-card text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fa-solid fa-brain text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">AI-Powered Search</h3>
              <p className="text-slate-600 text-base leading-relaxed">Smart algorithms understand your preferences and find the perfect match for your dream home</p>
            </div>
            {/* Easy Booking */}
            <div className="feature-card text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fa-solid fa-calendar-check text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Easy Booking</h3>
              <p className="text-slate-600 text-base leading-relaxed">Schedule property visits with just one click, no hassle or complicated procedures</p>
            </div>
            {/* Verified Properties */}
            <div className="feature-card text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fa-solid fa-shield-check text-emerald-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Verified Properties</h3>
              <p className="text-slate-600 text-base leading-relaxed">All listings are verified by our expert team for your complete peace of mind</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer id="footer" className="border-t border-slate-200 bg-white/60 backdrop-blur-sm py-12 px-8 mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                <i className="fa-solid fa-home text-white text-sm"></i>
              </div>
              <span className="text-xl font-semibold text-slate-800">HomeFinder</span>
            </div>
            <div className="flex items-center space-x-8 text-sm text-slate-600 mb-6 md:mb-0">
              <span className="hover:text-blue-600 transition-colors cursor-pointer font-medium">About</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer font-medium">Privacy</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer font-medium">Terms</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer font-medium">Contact</span>
            </div>
            <div className="text-sm text-slate-500 font-light">
              © 2025 HomeFinder. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
