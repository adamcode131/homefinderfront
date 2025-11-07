import React, { useEffect, useState } from 'react';
import AddProperty from './addProperty.jsx';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axios from 'axios'; 
import {motion, AnimatePresence } from "framer-motion";
import ContactOwner from './ContactOwner.jsx';
import NotificationsPanel from './NotificationsPanel.jsx';




function Boutique() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedIntention, setSelectedIntention] = useState('');
  const [selectedVille, setSelectedVille] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const propertiesPerPage = 10;

  useEffect(() => {
    if (!currentUser) return;

    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/properties", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('ownerToken')}`
          }
        });
        const data = await res.json();

        const myProperties = data.properties.filter(
          (p) => p.owner_id === currentUser.id
        );

        setProperties(myProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [currentUser]);

  // Get unique villes and intentions for filter dropdowns
  const uniqueVilles = [...new Set(properties.map(p => p.ville?.name).filter(Boolean))].sort();
  const uniqueIntentions = [...new Set(properties.map(p => p.intention))].sort();

  // Filter properties by title, ville, quartier, and selected filters
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(filter.toLowerCase()) ||
      (property.ville?.name && property.ville.name.toLowerCase().includes(filter.toLowerCase())) ||
      (property.quartier?.name && property.quartier.name.toLowerCase().includes(filter.toLowerCase()));
    
    const matchesIntention = !selectedIntention || property.intention === selectedIntention;
    const matchesVille = !selectedVille || property.ville?.name === selectedVille;

    return matchesSearch && matchesIntention && matchesVille;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, selectedIntention, selectedVille]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  // Calculate stats from real data
  const stats = {
    total: properties.length,
    forRent: properties.filter(p => p.intention === 'loyer').length,
    forSale: properties.filter(p => p.intention === 'vente').length,
    // This would need to come from your database - using placeholder for now
    monthlyVisits: 24
  };

  const handleEdit = (propertyId) => {
    navigate(`/updateproperty/${propertyId}`);
  };

  const handleDelete = (propertyId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette propriété ?")) {
      axios.delete(`http://localhost:8000/api/deleteproperty/${propertyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => window.location.reload())
      .catch(error => console.error("Error deleting property:", error.response?.data || error));
    }
  };

  const handleAddProperty = () => {
    navigate('/addproperty');
  };

  const getIntentionColor = (intention) => {
    return intention === 'loyer' ? 'bg-accent' : 'bg-purple';
  };

  const getIntentionText = (intention) => {
    return intention === 'loyer' ? 'Location' : 'Vente';
  };

  const getIntentionDisplayText = (intention) => {
    return intention === 'loyer' ? 'Location' : 'Vente';
  };

  const getPriceDisplay = (property) => {
    if (property.intention === 'loyer') {
      return (
        <>
          {property.rent_price} DH<span className="text-sm font-normal text-gray-500">/mois</span>
        </>
      );
    }
    return `${property.sale_price} DH`;
  };

  // Pagination controls
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    
    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 border border-gray-300 rounded-lg transition-colors ${
          currentPage === 1 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-500 hover:bg-gray-50'
        }`}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
    );

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              currentPage === i
                ? 'bg-primary text-white border-primary'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        buttons.push(
          <span key={i} className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 border border-gray-300 rounded-lg transition-colors ${
          currentPage === totalPages 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-500 hover:bg-gray-50'
        }`}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    );

    return buttons;
  };

  // Clear all filters
  const clearFilters = () => {
    setFilter('');
    setSelectedIntention('');
    setSelectedVille('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 mb-8 rounded-3xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ma Boutique</h1>
              <p className="text-gray-600 mt-1">Gérez vos propriétés et suivez vos performances</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleAddProperty}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                Ajouter une propriété
              </button>
            </div>
          </div>
        </header>

        {/* Search and Filter Section */}
        <div id="search-filter-section" className="mb-8">
          <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Rechercher par titre, ville ou quartier..." 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <i className="fa-solid fa-search text-gray-400"></i>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedIntention}
                  onChange={(e) => setSelectedIntention(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="">Toutes les intentions</option>
                  {uniqueIntentions.map(intention => (
                    <option key={intention} value={intention}>
                      {getIntentionDisplayText(intention)}
                    </option>
                  ))}
                </select>
                
                <select 
                  value={selectedVille}
                  onChange={(e) => setSelectedVille(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="">Toutes les villes</option>
                  {uniqueVilles.map(ville => (
                    <option key={ville} value={ville}>
                      {ville}
                    </option>
                  ))}
                </select>

                {(filter || selectedIntention || selectedVille) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    <i className="fa-solid fa-times mr-2"></i>
                    Effacer
                  </button>
                )}
              </div>
            </div>
            
            {/* Active filters display */}
            {(filter || selectedIntention || selectedVille) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filter && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Recherche: "{filter}"
                    <button 
                      onClick={() => setFilter('')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <i className="fa-solid fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                {selectedIntention && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Intention: {getIntentionDisplayText(selectedIntention)}
                    <button 
                      onClick={() => setSelectedIntention('')}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <i className="fa-solid fa-times text-xs"></i>
                    </button>
                  </span>
                )}
                {selectedVille && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    Ville: {selectedVille}
                    <button 
                      onClick={() => setSelectedVille('')}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <i className="fa-solid fa-times text-xs"></i>
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div id="stats-overview" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Propriétés</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-building text-primary text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">En Location</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.forRent}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-key text-accent text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">En Vente</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.forSale}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-home text-purple text-xl"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Visites ce mois</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.monthlyVisits}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-calendar-check text-yellow-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProperties.length > 0 ? (
          <>
            <div id="properties-grid" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentProperties.map((property) => (
                <div key={property.id} className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden hover:shadow-card-hover transition-all duration-300">
                  <div className="h-48 relative overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        className="w-full h-full object-cover" 
                        src={`http://localhost:8000/storage/${property.images[0].url}`} 
                        alt={property.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <i className="fa-solid fa-home text-gray-400 text-4xl"></i>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 ${getIntentionColor(property.intention)} text-white text-sm font-medium rounded-full`}>
                        {getIntentionText(property.intention)}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                      <i className="fa-solid fa-eye text-gray-600 text-sm"></i>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <i className="fa-solid fa-location-dot mr-2 text-primary"></i>
                      <span>
                        {property.ville?.name || "Ville inconnue"}
                        {property.quartier?.name && ` • ${property.quartier.name}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xl font-bold text-gray-900">
                        {getPriceDisplay(property)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Créé le {new Date(property.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleEdit(property.id)}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                      >
                        <i className="fa-solid fa-edit mr-2"></i>
                        Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(property.id)}
                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div id="pagination" className="flex items-center justify-center mt-12">
                <div className="flex items-center space-x-2">
                  {renderPaginationButtons()}
                </div>
                <div className="ml-4 text-sm text-gray-600">
                  Page {currentPage} sur {totalPages} • 
                  {filteredProperties.length} propriété{filteredProperties.length !== 1 ? 's' : ''} au total
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-home text-gray-400 text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Aucune propriété trouvée</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filter || selectedIntention || selectedVille
                ? "Aucune propriété ne correspond à vos critères de recherche." 
                : "Vous n'avez pas encore ajouté de propriétés à votre boutique."
              }
            </p>
            <button 
              onClick={handleAddProperty}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Ajouter votre première propriété
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



function Balance() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  // ✅ userId state removed - no longer needed

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error("Unauthorized or server error");
        }
        return resp.json();
      })
      .then((data) => {
        setBalance(data.user.balance);
        // ✅ Removed: setUserId(data.user.id);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);



  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 mb-8 rounded-3xl shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Balance</h1>
              <p className="text-gray-600 mt-1">Manage your points and purchase more</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-primary rounded-lg border border-blue-200">
                <i className="fa-solid fa-coins"></i>
                <span className="font-semibold">{balance} points</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="w-10 h-10 bg-white rounded-full shadow-soft border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:shadow-card-hover transition-all duration-300"
                >
                  <i className="fa-solid fa-bell text-lg"></i>
                </button>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </div>
            </div>
          </div>
        </header>

        {/* Current Balance Section */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-200 mb-8 relative overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-6">
                    <i className="fa-solid fa-wallet text-primary text-2xl"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Current Balance</h2>
                    <p className="text-gray-600">Your available points</p>
                  </div>
                </div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-5xl font-bold text-primary">{balance}</span>
                  <span className="text-xl text-gray-600 font-medium">points</span>
                </div>
                <p className="text-gray-600 mt-4">Ready to use for your purchases</p>
              </div>
              <div className="text-right">
                <div className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="text-sm text-gray-600 mb-1">Last purchase</div>
                  <div className="text-lg font-semibold text-gray-900">15 Nov 2024</div>
                  <div className="text-sm text-accent">+200 points</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Packages Section */}
        <div id="packages-section" className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Buy Points</h2>
              <p className="text-gray-600 mt-1">Choose the package that suits you best</p>
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              <i className="fa-solid fa-info-circle mr-2"></i>
              1 point = 0.5 dh discount
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Package */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-star text-coral text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">100</span>
                  <span className="text-lg text-gray-600 ml-2">points</span>
                </div>
                <div className="text-3xl font-bold text-coral mb-6">50 DH</div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-600">
                    <i className="fa-solid fa-check text-accent mr-3"></i>
                    100 discount points
                  </li>
                  <li className="flex items-center text-gray-600">
                    <i className="fa-solid fa-check text-accent mr-3"></i>
                    Valid 6 months
                  </li>
                  <li className="flex items-center text-gray-600">
                    <i className="fa-solid fa-check text-accent mr-3"></i>
                    Email support
                  </li>
                </ul>
                <button className="w-full py-4 bg-coral text-white rounded-2xl hover:bg-coral/90 transition-colors font-semibold">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Professional Package - Popular */}
            <div className="bg-white rounded-3xl p-8 border-2 border-coral shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-coral text-white px-6 py-2 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-crown text-coral text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Professional</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">300</span>
                  <span className="text-lg text-gray-600 ml-2">points</span>
                </div>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-coral">150 DH</span>
                  <span className="text-lg text-gray-400 line-through ml-2">200 DH</span>
                </div>
                <div className="text-sm text-accent font-medium mb-6">Save 50 DH</div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-600">
                    <i className="fa-solid fa-check text-accent mr-3"></i>
                    300 discount points
                  </li>
                  <li className="flex items-center text-gray-600">
                    <i className="fa-solid fa-check text-accent mr-3"></i>
                    Valid 12 months
                  </li>
                  <li className="flex items-center text-gray-600">
                    <i className="fa-solid fa-check text-accent mr-3"></i>
                    Priority support
                  </li>
                  <li className="flex items-center text-gray-600">
                    <i className="fa-solid fa-check text-accent mr-3"></i>
                    Advanced statistics
                  </li>
                </ul>
                <button className="w-full py-4 bg-coral text-white rounded-2xl hover:bg-coral/90 transition-colors font-semibold">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Enterprise Package */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-gem text-purple text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">500</span>
                  <span className="text-lg text-gray-600 ml-2">points</span>
                </div>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-purple">250 DH</span>
                  <span className="text-lg text-gray-400 line-through ml-2">300 DH</span>
                </div>
                <div className="text-sm text-accent font-medium mb-6">Save 50 DH</div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-600">
                    <i className="fa-solid fa-check text-accent mr-3"></i>
                    500 discount points
                  </li>
                  <li className="flex items-center text-gray-600">
                    <i className="fa-solid fa-check text-accent mr-3"></i>
                    Valid 18 months
                  </li>
                  <li className="flex items-center text-gray-600">
                    <i className="fa-solid fa-check text-accent mr-3"></i>
                    24/7 support
                  </li>
                  <li className="flex items-center text-gray-600">
                    <i className="fa-solid fa-check text-accent mr-3"></i>
                    API access
                  </li>
                </ul>
                <button className="w-full py-4 bg-purple text-white rounded-2xl hover:bg-purple/90 transition-colors font-semibold">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-lightbulb text-primary text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">How to use your points?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-coral/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-tag text-coral text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Discount on purchases</h4>
                    <p className="text-gray-600 text-sm">1 point = 0.5 dh discount on your purchases in our store</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-bolt text-accent text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Instant application</h4>
                    <p className="text-gray-600 text-sm">Points are automatically applied at checkout</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-calendar text-purple text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">12 months validity</h4>
                    <p className="text-gray-600 text-sm">All purchased points are valid for 12 months</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-shield-alt text-primary text-sm"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Secure transactions</h4>
                    <p className="text-gray-600 text-sm">All point purchases are secure and encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ UPDATED: NotificationsPanel without userId prop */}
      <NotificationsPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}




function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [leadToUnlock, setLeadToUnlock] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [unlockedLeads, setUnlockedLeads] = useState([]);
  const [reasons,setReasons] = useState();
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  
  useEffect(()=>{
    fetch('http://localhost:8000/api/refund-reasons')
    .then(res => res.json())
    .then(data => setReasons(data.reasons)) 
  },[]) 

  // Enhanced fetch with better error handling
  const fetchLeads = async () => {
    setIsRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch("http://localhost:8000/api/all_leads", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      const data = await resp.json();
      
      setLeads(data.leads || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Fetch user balance
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const resp = await fetch("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await resp.json();
        if (data.user?.balance !== undefined) {
          setUserPoints(data.user.balance);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUserData();
  }, []);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const resp = await fetch("http://localhost:8000/api/properties");
        if (!resp.ok) throw new Error(`HTTP error! Status: ${resp.status}`);
        const data = await resp.json();
        setProperties(data.properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };
    fetchProperties();
  }, []);

  // Enhanced sorting with better performance
  const sortedLeads = React.useMemo(() => {
    const sortableLeads = [...leads];
    if (sortConfig.key) {
      sortableLeads.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal < bVal ? -1 : 1;
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }
    return sortableLeads;
  }, [leads, sortConfig]);

  // Enhanced filtering
  const filteredLeads = React.useMemo(() => {
    return sortedLeads.filter((lead) => {
      const matchesSearch = searchTerm === "" || 
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm);

      const matchesProperty = !selectedProperty || 
        lead.property_id === parseInt(selectedProperty);

      return matchesSearch && matchesProperty;
    });
  }, [sortedLeads, searchTerm, selectedProperty]);

  // Enhanced date formatting
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Enhanced mask with visual appeal
  const maskInfo = (info) => {
    if (!info) return "••••••••";
    return "•".repeat(Math.min(info.length, 6));
  };

  // Enhanced sorting handler
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "fa-sort";
    return sortConfig.direction === "asc" ? "fa-sort-up" : "fa-sort-down";
  };

  // Enhanced lead click with animation
  const handleLeadClick = (lead) => {
    if (lead.status === "accepted" || unlockedLeads.includes(lead.id)) {
      setSelectedLead(lead);
    } else {
      setLeadToUnlock(lead);
      setShowConfirmation(true);
    }
  };

  // Enhanced unlock handler
  const handleConfirmUnlock = async () => {
    if (!leadToUnlock) return;
  
    try {
      const statusResp = await fetch(
        `http://localhost:8000/api/leads/${leadToUnlock.id}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      const text = await statusResp.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Response is not JSON:", text);
        alert("Erreur serveur: réponse invalide");
        return;
      }
  
      if (!statusResp.ok) {
        alert(data.message || "Erreur lors de l'acceptation du lead");
        return;
      }
  
      // ✅ set user points to the actual balance from backend
      if (data.user && typeof data.user.balance !== "undefined") {
        setUserPoints(data.user.balance);
      }
  
      // mark lead as unlocked
      setUnlockedLeads((prev) => [...prev, leadToUnlock.id]);
      setSelectedLead(data.lead || leadToUnlock); // use backend lead if returned
      setShowConfirmation(false);
      setLeadToUnlock(null);
  
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadToUnlock.id ? { ...l, status: "accepted" } : l
        )
      );
    } catch (err) {
      console.error("Error updating lead status:", err);
      alert("Erreur de connexion au serveur");
    }
  };
  

  const handleRejectUnlock = () => {
    setShowConfirmation(false);
    setLeadToUnlock(null);
  };

  // Enhanced loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-blue-600 font-medium">Chargement des leads...</p>
        </div>
      </div>
    );
  }  

  const openRefundModal = (leadId) => {
    setSelectedLeadId(leadId);
    setShowRefundModal(true);
  };

  const handleRefund = async () => {
    if (!refundReason.trim()) {
      alert("Please select or enter a reason.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/refund/${selectedLeadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if you use auth
        },
        body: JSON.stringify({ reason: refundReason }),
      });

      const data = await res.json();
      alert(data.message || "Refund sent successfully");
      setShowRefundModal(false);
      setRefundReason("");
    } catch (err) {
      console.error(err);
      alert("Error submitting refund");
    }
  }; 



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
              Gestion des Leads
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Suivez et gérez toutes vos demandes de réservation
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-sm border border-slate-200">
              <p className="text-xs sm:text-sm text-slate-500">Total leads</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{leads.length}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-sm text-white">
              <p className="text-xs sm:text-sm opacity-90">Vos points</p>
              <p className="text-xl sm:text-2xl font-bold">{userPoints}</p>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div className="relative w-full sm:max-w-sm">
              {/* Property Filter */}
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              >
                <option value="">Toutes les propriétés</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.title} ({property.quartier.name}, {property.ville.name})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="fa-solid fa-building text-slate-400 text-sm"></i>
              </div>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-sm">
              <input
                type="text"
                placeholder="Rechercher un lead..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm"></i>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-times text-sm"></i>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <i className="fa-solid fa-circle-info text-blue-500"></i>
              <span>{filteredLeads.length} lead(s) trouvé(s)</span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 sm:px-6 py-3 border-b border-slate-200">
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 flex items-center gap-2">
              <i className="fa-solid fa-table-list text-blue-500"></i>
              Liste des Leads
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th
                    className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Lead</span>
                      <i className={`fa-solid ${getSortIcon('name')} text-slate-400 text-xs`}></i>
                    </div>
                  </th>
                  <th
                    className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Email</span>
                      <i className={`fa-solid ${getSortIcon('email')} text-slate-400 text-xs`}></i>
                    </div>
                  </th>
                  <th
                    className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Date</span>
                      <i className={`fa-solid ${getSortIcon('created_at')} text-slate-400 text-xs`}></i>
                    </div>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                    Action
                  </th>

                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 sm:px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <i className="fa-solid fa-inbox text-3xl text-slate-300 mb-2"></i>
                        <p className="text-slate-500 text-sm sm:text-base">
                          {searchTerm ? "Aucun lead trouvé" : "Aucun lead disponible"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, index) => {
                    const isUnlocked = lead.status === "accepted" || unlockedLeads.includes(lead.id);
                    return (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-3 sm:px-4 py-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <i className="fa-solid fa-user text-white text-xs"></i>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-slate-800 text-sm truncate">
                                {isUnlocked ? (lead.name || "Inconnu") : "Lead Confidential"}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                <i className="fa-solid fa-phone text-xs"></i>
                                <span>{isUnlocked ? lead.phone : maskInfo(lead.phone)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <i className="fa-solid fa-envelope text-slate-400 text-xs flex-shrink-0"></i>
                            <span className="font-medium text-slate-800 text-sm truncate">
                              {isUnlocked ? lead.email : maskInfo(lead.email)}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-3">
                          <div className="space-y-1">
                            <div className="text-xs text-slate-700">
                              {formatDate(lead.created_at)}
                            </div>
                            {lead.date_reservation && (
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <i className="fa-solid fa-calendar text-xs"></i>
                                <span>{formatDate(lead.date_reservation)}</span>
                              </div>
                            )}
                          </div>
                        </td>                        
                        <td className="px-3 sm:px-4 py-3">
                          <button
                            onClick={() => handleLeadClick(lead)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                              isUnlocked 
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-sm'
                            }`}
                          >
                            <i className={`fa-solid ${isUnlocked ? 'fa-eye' : 'fa-key'} text-xs`}></i>
                            {isUnlocked ? 'Voir' : 'Déverrouiller'}
                          </button>
                        </td> 
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table> 
            {/* show */}
              {showRefundModal && (
                <AnimatePresence>
                  <motion.div
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowRefundModal(false)}
                  />

                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                    className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col p-6 overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-800">Refund Request</h3>
                      <button
                        onClick={() => setShowRefundModal(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                      >
                        &times;
                      </button>
                    </div>

                    <label className="block text-sm mb-2 font-medium text-slate-700">
                      Select a reason
                    </label>

                    <select
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm"
                    >
                      <option value="">Select a reason</option>
                      <option value="Invalid contact information">Invalid contact information</option>
                      <option value="Wrong person">Wrong person</option>
                      <option value="Duplicate lead">Duplicate lead</option>
                      <option value="Fake lead">Fake lead</option>
                      <option value="Incomplete details">Incomplete details</option>
                      <option value="Lead sold to multiple owners">Lead sold to multiple owners</option>
                      <option value="Lead already closed">Lead already closed</option>
                    </select>


                    {refundReason === "Other" && (
                      <textarea
                        placeholder="Enter details..."
                        className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm"
                        onChange={(e) => setRefundReason(e.target.value)}
                      />
                    )}

                    <div className="flex justify-end gap-2 mt-auto">
                      <button
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                        onClick={() => setShowRefundModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        onClick={handleRefund}
                      >
                        Confirm
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && leadToUnlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleRejectUnlock}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fa-solid fa-key text-blue-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Déverrouiller le Lead ?
                </h3>
                <p className="mb-4 text-slate-600 text-sm">
                  Cela déduira <strong className="text-blue-600">1 point</strong> de votre solde.
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleRejectUnlock}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmUnlock}
                    disabled={userPoints <= 0}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Details Modal */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedLead(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-user-circle text-blue-500"></i>
                  Détails du Lead
                </h3>
              </div>
              <div className="p-4 sm:p-6 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Nom</p>
                    <p className="font-medium text-slate-800 text-sm">{selectedLead.name || "Inconnu"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-slate-800 text-sm">{selectedLead.email}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Téléphone</p>
                    <p className="font-medium text-slate-800 text-sm">{selectedLead.phone}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Date de réservation</p>
                    <p className="font-medium text-slate-800 text-sm">{formatDateTime(selectedLead.date_reservation)}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 border-t border-slate-200">
                <button
                  className="w-full px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
                  onClick={() => setSelectedLead(null)}
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}












export default function OwnerPanel() {
  const [mainSection, setMainSection] = useState('properties');
    const [userData, setUserData] = useState({
    name: 'Chargement ...', // Default fallback
    photo: 'user.png', // Default fallback
    role: 'Owner'
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            const imagePath = data.user.image ?? data.user.photo ?? null;
            const photoUrl = imagePath ? `http://localhost:8000/storage/${imagePath}` : 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg';

            setUserData({
              name: data.user.name || 'Youssef Alami',
              photo: photoUrl,
              role: data.user.role || 'Propriétaire'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem('token');
    localStorage.removeItem('ownerToken');
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-soft border-r border-gray-200 fixed left-0 top-0 h-full z-40">
        <div className="p-6 border-b border-gray-200">
          <div className="text-xl font-bold text-primary flex items-center">
            <i className="fa-solid fa-home mr-2"></i>
            PropertyAI
          </div>
          <p className="text-sm text-gray-600 mt-1">Tableau de bord propriétaire</p>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => setMainSection('properties')}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                mainSection === 'properties'
                  ? 'text-primary bg-blue-50 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fa-solid fa-building mr-3 w-5"></i>
              Mes Propriétés
            </button>
            <button
              onClick={() => setMainSection('balance')}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                mainSection === 'balance'
                  ? 'text-primary bg-blue-50 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fa-solid fa-wallet mr-3 w-5"></i>
              Balance
              <span className="ml-auto bg-accent text-white text-xs px-2 py-1 rounded-full">450 DH</span>
            </button>
            <button
              onClick={() => setMainSection('leads')}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                mainSection === 'leads'
                  ? 'text-primary bg-blue-50 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fa-solid fa-users mr-3 w-5"></i>
              Leads
              <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">12</span>
            </button>
            <button
              onClick={() => setMainSection('contact')}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                mainSection === 'contact'
                  ? 'text-primary bg-blue-50 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fa-solid fa-envelope mr-3 w-5"></i>
              Contact
            </button>
          </div>
        </nav>

<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
  <div className="flex items-center space-x-3">
    <img 
      src={userData.photo} 
      alt="Profile" 
      className="w-10 h-10 rounded-full object-cover cursor-pointer" 
      onClick={() => navigate('/admin-profile')}
    />
    <div className="flex-1">
      <div className="text-sm font-semibold text-gray-900">
        {loading ? 'Chargement...' : userData.name}
      </div>
      <div className="text-xs text-gray-600">
        {userData.role}
      </div>
    </div>
    <button 
      onClick={handleLogout}
      className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
    >
      <i className="fa-solid fa-sign-out-alt"></i>
    </button>
  </div>
</div>
      </aside>

      {/* Main Content - Add ml-64 to account for sidebar width */}
      <main className="flex-1 ml-64">
        {mainSection === 'properties' && <Boutique />}
        {mainSection === 'balance' && <Balance />}
        {mainSection === 'leads' && <Leads />} 
        {mainSection === 'contact' && <ContactOwner/>}
      </main>
    </div>
  );
}