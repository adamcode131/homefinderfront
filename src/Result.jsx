import { useEffect, useState } from "react";

export default function Result() {
  const [validatedProperties, setValidatedProperties] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/validatedproperties")
      .then((resp) => resp.json())

      .then((data) => setValidatedProperties(data.properties))
      .catch((err) => console.error("Error fetching validated properties:", err));
  }, []);

  return (
    <div className="bg-gray-50 font-sans">
      {/* Header */}
      <header
        id="header"
        className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <div className="text-xl font-bold text-primary flex items-center">
                <i className="fa-solid fa-home mr-2"></i>
                Home Finder
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
              <button className="px-4 py-2 text-gray-700 hover:text-primary font-medium transition-colors">
                Login
              </button>
              <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="pt-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Results Panel */}
            <section id="results-panel" className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600 font-medium">
                  <span className="text-primary font-semibold">
                    {validatedProperties.length}
                  </span>{" "}
                  propriétés trouvées
                </p>
                <div className="flex items-center space-x-4">
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

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {validatedProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-gray-100 group"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={`http://localhost:8000/storage/${property.images[0].url}`}
                        alt={property.title}
                      />
                      {property.isNew && (
                        <div className="absolute top-3 left-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
                          Nouveau
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                        <i className="fa-regular fa-heart text-gray-600 hover:text-red-500 cursor-pointer transition-colors"></i>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-gray-900 font-semibold mb-2 text-lg">
                        {property.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 flex items-center">
                        <i className="fa-solid fa-bed mr-2 text-primary"></i>
                        {property.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-gray-900">
                          {property.sale_price === 0 ? property.rent_price : property.sale_price} DH
                          <span className="text-sm font-normal text-gray-500">
                            {property.sale_price === 0 ? '/mois': 'vente'}
                          </span>
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <i className="fa-solid fa-location-dot mr-1 text-primary"></i>
                          {property.ville.name}
                        </span>
                      </div>
                      <button className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                        Réserver une visite
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
