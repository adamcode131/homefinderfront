
export default function Result() {
  return (
    <div className="bg-gray-50 font-sans">
      {/* Header */}
      <header id="header" className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <div className="text-xl font-bold text-primary flex items-center">
                <i className="fa-solid fa-home mr-2"></i>
                PropertyAI
              </div>
            </div>
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: 2 chambres, 1 salon, quartier Gauthier"
                  className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <i className="fa-solid fa-search text-primary"></i>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                <option>FR</option>
                <option>EN</option>
                <option>AR</option>
              </select>
              <button className="px-4 py-2 text-gray-700 hover:text-primary font-medium transition-colors">Login</button>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium transition-all duration-200 shadow-sm hover:shadow-md">Sign Up</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="pt-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Filters Panel */}
            <aside id="filters-panel" className="w-80 bg-white rounded-xl shadow-soft p-6 h-fit border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Filtres</h2>
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Recherche actuelle</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                    2 chambres
                    <i className="fa-solid fa-times ml-2 cursor-pointer hover:text-red-500 transition-colors"></i>
                  </span>
                  <span className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-accent/10 text-accent border border-accent/20">
                    budget &lt; 5000dh
                    <i className="fa-solid fa-times ml-2 cursor-pointer hover:text-red-500 transition-colors"></i>
                  </span>
                  <span className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-gray-100 text-gray-800 border border-gray-200">
                    quartier Gauthier
                    <i className="fa-solid fa-times ml-2 cursor-pointer hover:text-red-500 transition-colors"></i>
                  </span>
                </div>
              </div>
              <div className="space-y-8">
                {/* Prix */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Prix</h3>
                    <i className="fa-solid fa-chevron-down text-gray-400"></i>
                  </div>
                  <div className="space-y-4">
                    <input type="range" min="0" max="10000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" />
                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                      <span>0 DH</span>
                      <span>10,000 DH</span>
                    </div>
                  </div>
                </div>
                {/* Chambres */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Chambres</h3>
                    <i className="fa-solid fa-chevron-down text-gray-400"></i>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">1</button>
                    <button className="px-3 py-2 text-sm border-2 border-primary bg-primary/10 text-primary rounded-lg font-medium">2</button>
                    <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
                    <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">4+</button>
                  </div>
                </div>
                {/* Quartier */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Quartier</h3>
                    <i className="fa-solid fa-chevron-down text-gray-400"></i>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" checked className="rounded border-gray-300 text-primary focus:ring-primary/20 w-4 h-4" />
                      <span className="ml-3 text-sm text-gray-700">Gauthier</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary/20 w-4 h-4" />
                      <span className="ml-3 text-sm text-gray-700">Maarif</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary/20 w-4 h-4" />
                      <span className="ml-3 text-sm text-gray-700">Agdal</span>
                    </label>
                  </div>
                </div>
                {/* Meublé */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Meublé</h3>
                    <i className="fa-solid fa-chevron-down text-gray-400"></i>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="furnished" className="border-gray-300 text-primary focus:ring-primary/20 w-4 h-4" />
                      <span className="ml-3 text-sm text-gray-700">Meublé</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="furnished" className="border-gray-300 text-primary focus:ring-primary/20 w-4 h-4" />
                      <span className="ml-3 text-sm text-gray-700">Non meublé</span>
                    </label>
                  </div>
                </div>
              </div>
              <button className="w-full mt-8 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Effacer tous les filtres
              </button>
            </aside>
            {/* Results Panel */}
            <section id="results-panel" className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600 font-medium">
                  <span className="text-primary font-semibold">247</span> propriétés trouvées
                </p>
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>Trier par: Pertinence</option>
                    <option>Prix croissant</option>
                    <option>Prix décroissant</option>
                    <option>Plus récent</option>
                  </select>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button className="px-4 py-2 bg-primary text-white border-r border-gray-300">
                      <i className="fa-solid fa-th-large"></i>
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors">
                      <i className="fa-solid fa-list"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Property Card 1 */}
                <div className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-gray-100 group">
                  <div className="h-48 relative overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a5812d9981-7db07e2002f6d07cd396.png" alt="modern apartment interior Gauthier Morocco luxury living room" />
                    <div className="absolute top-3 left-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
                      Nouveau
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                      <i className="fa-regular fa-heart text-gray-600 hover:text-red-500 cursor-pointer transition-colors"></i>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-gray-900 font-semibold mb-2 text-lg">Appartement 2 chambres – Gauthier</h3>
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <i className="fa-solid fa-bed mr-2 text-primary"></i>2 chambres • 1 salon • 80m² • Meublé
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-gray-900">4,500 DH<span className="text-sm font-normal text-gray-500">/mois</span></span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <i className="fa-solid fa-location-dot mr-1 text-primary"></i>Gauthier, Rabat
                      </span>
                    </div>
                    <button className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                      Réserver une visite
                    </button>
                  </div>
                </div>
                {/* Property Card 2 */}
                <div className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-gray-100 group">
                  <div className="h-48 relative overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/1eb7334bb1-a2b1cb766afe5879dc1c.png" alt="modern studio apartment Agdal Morocco minimalist design" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                      <i className="fa-regular fa-heart text-gray-600 hover:text-red-500 cursor-pointer transition-colors"></i>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-gray-900 font-semibold mb-2 text-lg">Studio moderne – Agdal</h3>
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <i className="fa-solid fa-bed mr-2 text-primary"></i>1 chambre • 1 salon • 45m² • Non meublé
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-gray-900">3,200 DH<span className="text-sm font-normal text-gray-500">/mois</span></span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <i className="fa-solid fa-location-dot mr-1 text-primary"></i>Agdal, Rabat
                      </span>
                    </div>
                    <button className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                      Réserver une visite
                    </button>
                  </div>
                </div>
                {/* Property Card 3 */}
                <div className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-gray-100 group">
                  <div className="h-48 relative overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/57bdfe1142-c78d9ef842d132c61d16.png" alt="family apartment Maarif Casablanca spacious living room luxury" />
                    <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                      Recommandé
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                      <i className="fa-regular fa-heart text-gray-600 hover:text-red-500 cursor-pointer transition-colors"></i>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-gray-900 font-semibold mb-2 text-lg">Appartement familial – Maarif</h3>
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <i className="fa-solid fa-bed mr-2 text-primary"></i>3 chambres • 2 salons • 120m² • Meublé
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-gray-900">6,800 DH<span className="text-sm font-normal text-gray-500">/mois</span></span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <i className="fa-solid fa-location-dot mr-1 text-primary"></i>Maarif, Casablanca
                      </span>
                    </div>
                    <button className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                      Réserver une visite
                    </button>
                  </div>
                </div>
                {/* Property Card 4 */}
                <div className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-gray-100 group">
                  <div className="h-48 relative overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2dad89655f-49f1d63b3ef094b2a7d3.png" alt="luxury villa with garden Souissi Rabat modern architecture" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                      <i className="fa-regular fa-heart text-gray-600 hover:text-red-500 cursor-pointer transition-colors"></i>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-gray-900 font-semibold mb-2 text-lg">Villa avec jardin – Souissi</h3>
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <i className="fa-solid fa-bed mr-2 text-primary"></i>4 chambres • 3 salons • 200m² • Non meublé
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-gray-900">12,000 DH<span className="text-sm font-normal text-gray-500">/mois</span></span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <i className="fa-solid fa-location-dot mr-1 text-primary"></i>Souissi, Rabat
                      </span>
                    </div>
                    <button className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                      Réserver une visite
                    </button>
                  </div>
                </div>
                {/* Property Card 5 */}
                <div className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-gray-100 group">
                  <div className="h-48 relative overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/78d6daad4c-03591303bb047dde0e38.png" alt="ocean view apartment Ain Diab Casablanca balcony sea" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                      <i className="fa-regular fa-heart text-gray-600 hover:text-red-500 cursor-pointer transition-colors"></i>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-gray-900 font-semibold mb-2 text-lg">Appartement vue mer – Ain Diab</h3>
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <i className="fa-solid fa-bed mr-2 text-primary"></i>2 chambres • 1 salon • 90m² • Meublé
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-gray-900">8,500 DH<span className="text-sm font-normal text-gray-500">/mois</span></span>
                    </div>
                  </div>
                </div>
                {/* ...add more property cards as needed... */}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}