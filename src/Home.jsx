import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState('');   
  const [propertyIds, setPropertyIds] = useState([]); 
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [autourDeMoi, setAutourDeMoi] = useState(false);
  const navigate = useNavigate();

  // geoLocation added
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation error:", error);
        }
      );
    } else {
      console.warn("Geolocation not supported by this browser.");
    }
  }, []);

  const handleSearch = (param) => {
    const search = query || param;
    
    if (!search?.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    navigate('/loading', { 
      state: { 
        searchQuery: search,
        timestamp: Date.now()
      } 
    });

    const requestBody = {
      chatInput: search,
      token: localStorage.getItem('token'),
      latitude: location.latitude, 
      longitude: location.longitude
    };

    if (autourDeMoi) {
      requestBody.radius = 50;
    }

    fetch('https://n8n.manypilots.com/webhook/search', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(requestBody)
    })
      .then(res => res.json())
      .then(data => {
        const ids = data.ids || [];
        navigate('/result', { 
          state: { 
            propertyIds: ids,
            searchQuery: search,
            autourDeMoi: autourDeMoi
          } 
        });
      })
      .catch(err => {
        console.error("Fetch error:", err);
        navigate('/', { state: { error: "Search failed. Please try again." } });
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/search-suggestions?q=${query}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSuggestionClick = (suggestionName) => {
    setQuery(suggestionName);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const toggleAutourDeMoi = () => {
    setAutourDeMoi(!autourDeMoi);
  };

  // Logo component to ensure consistent usage
  const LogoIcon = ({ className = "w-6 h-6" }) => (
    <img 
      src="./logo.svg" 
      alt="Daryol Logo" 
      className={className}
      onError={(e) => {
        // Fallback to home icon if image fails to load
        e.target.style.display = 'none';
        const fallback = document.createElement('i');
        fallback.className = 'fa-solid fa-home text-white';
        e.target.parentNode.appendChild(fallback);
      }}
    />
  );

  return (
    <div id="main-container" className="min-h-[900px] bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header
        id="header"
        className="w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50"
      >
        {/* Logo */}
        <div className="flex items-center group">
            <LogoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="ml-2 sm:ml-3 text-xl sm:text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Daryol
          </span>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          {/* Language Selector (compact on mobile, original size on sm+) */}
          <div className="relative">
            <select className="bg-white/90 border border-slate-300 rounded-xl px-2 py-1 text-xs sm:px-4 sm:py-2.5 sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md">
              <option value="fr">🇫🇷 FR</option>
              <option value="en">🇺🇸 EN</option>
              <option value="ar">🇲🇦 AR</option>
            </select>
          </div>

          {/* Owner Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Auth Buttons */}
            <div className="flex gap-2 sm:gap-3 items-center">
              <Link to="/signup_owner">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-blue-400/20 whitespace-nowrap min-w-0 flex items-center justify-center">
                  <i className="fa-solid fa-building mr-0 sm:mr-2 text-lg sm:text-base"></i>
                  <span className="hidden sm:inline">Annonceur</span>
                </button>
              </Link>

              <Link to="/signup_user">
                <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-2 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-emerald-400/20 whitespace-nowrap min-w-0 flex items-center justify-center">
                  <i className="fa-solid fa-user mr-0 sm:mr-2 text-lg sm:text-base"></i>
                  <span className="hidden sm:inline">Client</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
  <main id="main-content" className="flex flex-col items-center justify-center px-4 sm:px-8 py-16 sm:py-24">
        {/* Hero Logo Section */}
  <div className="mb-8 sm:mb-12 text-center">
          <div className="flex items-center justify-center mb-6">
              <LogoIcon className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-3">Daryol</h1>
          <p className="text-slate-500 text-sm sm:text-lg font-light">Powered by Artificial Intelligence</p>
        </div>

        {/* Search Section */}
        <div id="search-section" className="w-full max-w-3xl">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="flex items-center bg-white border-2 border-slate-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 focus-within:border-blue-500 focus-within:search-glow group p-3 sm:p-6">
              <div className="pl-8 pr-4">
                <i className="fa-solid fa-search text-slate-400 text-xl group-focus-within:text-blue-500 transition-colors duration-200"></i>
              </div>
                <input 
                  onChange={(e) => setQuery(e.target.value)} 
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  value={query}
                  type="text" 
                  placeholder="Ex: 2 chambres, 1 salon, quartier Gauthier" 
                  className="flex-1 py-3 px-3 sm:px-6 text-sm sm:text-base text-slate-700 bg-transparent focus:outline-none placeholder-slate-400 font-light" 
                />
                <button 
                  onClick={() => handleSearch(query)} 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl mr-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base"
                >
                  <i className="fa-solid fa-search mr-2"></i>Search
                </button>
            </div>
            
            {/* Enhanced Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-2xl mt-2 shadow-2xl z-50 overflow-hidden">
                <div className="py-2">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center px-4 py-3 sm:px-6 sm:py-4 hover:bg-blue-50 cursor-pointer transition-all duration-150 group border-b border-slate-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(s.name)}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors duration-150">
                        <i className="fa-solid fa-magnifying-glass text-blue-600 text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-800 font-medium text-lg group-hover:text-blue-700 transition-colors duration-150">
                          {s.name}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <i className="fa-solid fa-arrow-right text-blue-500 text-lg"></i>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-200">
                  <div className="text-slate-500 text-sm flex items-center">
                    <i className="fa-solid fa-lightbulb text-yellow-500 mr-2"></i>
                    Press Enter to search for "{query}"
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Autour de Moi Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl px-4 py-2 sm:px-6 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-200">
              <span className="text-slate-700 font-medium text-sm">Autour de moi</span>
              <button 
                onClick={toggleAutourDeMoi}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  autourDeMoi ? 'bg-blue-500' : 'bg-slate-300'
                }`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    autourDeMoi ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div className="flex items-center text-slate-500 text-sm">
                <i className="fa-solid fa-location-crosshairs mr-2 text-blue-500"></i>
                {autourDeMoi ? 'Activé (50km)' : 'Désactivé'}
              </div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-center text-slate-600 text-base sm:text-xl mb-12 font-light">
            Find your home with <span className="font-medium text-blue-600">AI-powered search</span>
          </p>
          
          {/* Quick Suggestions */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button onClick={() => handleSearch("1 Chambre")} className="suggestion-pulse bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-2 sm:px-6 sm:py-3 rounded-2xl text-sm border-2 border-slate-200 hover:border-blue-300 transition-all duration-200 shadow-md hover:shadow-lg">
              <i className="fa-solid fa-bed mr-2 text-blue-500"></i>1 Chambre
            </button>
            <button onClick={() => handleSearch("Maarif")} className="suggestion-pulse bg-white hover:bg-green-50 text-slate-700 hover:text-green-700 px-3 py-2 sm:px-6 sm:py-3 rounded-2xl text-sm border-2 border-slate-200 hover:border-green-300 transition-all duration-200 shadow-md hover:shadow-lg">
              <i className="fa-solid fa-location-dot mr-2 text-green-500"></i>Maarif
            </button>
            <button onClick={() => handleSearch("moins de 5000dh")} className="suggestion-pulse bg-white hover:bg-yellow-50 text-slate-700 hover:text-yellow-700 px-3 py-2 sm:px-6 sm:py-3 rounded-2xl text-sm border-2 border-slate-200 hover:border-yellow-300 transition-all duration-200 shadow-md hover:shadow-lg">
              <i className="fa-solid fa-coins mr-2 text-yellow-500"></i>Moins de 5000 DH
            </button>
            <button onClick={() => handleSearch("plus de 200metre")} className="suggestion-pulse bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 px-3 py-2 sm:px-6 sm:py-3 rounded-2xl text-sm border-2 border-slate-200 hover:border-purple-300 transition-all duration-200 shadow-md hover:shadow-lg">
              <i className="fa-solid fa-car mr-2 text-purple-500"></i>Plus de 200 métre carré
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
                <LogoIcon className="w-4 h-4" />
              </div>
              <span className="text-xl font-semibold text-slate-800">Daryol</span>
            </div>
            <div className="flex items-center space-x-8 text-sm text-slate-600 mb-6 md:mb-0">
              <span className="hover:text-blue-600 transition-colors cursor-pointer font-medium">About</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer font-medium">Privacy</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer font-medium">Terms</span>
              <span className="hover:text-blue-600 transition-colors cursor-pointer font-medium">Contact</span>
            </div>
            <div className="text-sm text-slate-500 font-light">
              © 2025 Daryol. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}