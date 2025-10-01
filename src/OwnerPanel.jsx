import React, { useEffect, useState } from 'react';
import AddProperty from './addProperty.jsx';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axios from 'axios'; 
import {motion, AnimatePresence } from "framer-motion";




function Boutique() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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

  // Filter properties by type or title
  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(filter.toLowerCase()) ||
      p.type.toLowerCase().includes(filter.toLowerCase())
  );

  // Group by type
  const grouped = filteredProperties.reduce((acc, p) => {
    if (!acc[p.type]) acc[p.type] = [];
    acc[p.type].push(p);
    return acc;
  }, {});

  const handleEdit = (propertyId) => {
    navigate(`/updateproperty/${propertyId}`);
  };

  const handleDelete = (propertyId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette propriété ?")) {
      axios.delete(`http://localhost:8000/api/deleteproperty/${propertyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('ownerToken')}` },
      })
      .then(() => window.location.reload())
      .catch(error => console.error("Error deleting property:", error.response?.data || error));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Ma Boutique</h1>
          <p className="text-slate-600">Gérez vos propriétés et consultez leurs détails</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
                Rechercher une propriété
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Rechercher par titre ou type..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            placeholder-slate-400 bg-white transition-all duration-200
                            hover:border-slate-300"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
            </div>
            
            <div className="flex items-end">
              <span className="text-slate-600 text-sm bg-slate-100 rounded-lg px-3 py-2">
                {filteredProperties.length} propriété{filteredProperties.length !== 1 ? 's' : ''} trouvée{filteredProperties.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : Object.keys(grouped).length > 0 ? (
          Object.keys(grouped).map((type) => (
            <div key={type} className="mb-10">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800">{type}</h3>
                <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {grouped[type].length} propriété{grouped[type].length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-medium">Titre</th>
                        <th className="px-6 py-4 font-medium">Ville</th>
                        <th className="px-6 py-4 font-medium">Quartier</th>
                        <th className="px-6 py-4 font-medium">Intention</th>
                        <th className="px-6 py-4 font-medium">Prix</th>
                        <th className="px-6 py-4 font-medium">Créé le</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grouped[type].map((p) => (
                        <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-800">{p.title}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
                              {p.ville?.name || "—"}
                            </span>
                          </td>
                          <td className="px-6 py-4">{p.quartier?.name || "—"}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.intention === "loyer" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}`}>
                              {p.intention === "loyer" ? "Location" : "Vente"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-blue-600">
                              {p.intention === "loyer" ? `${p.rent_price} DH/mois` : `${p.sale_price} DH`}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-500">
                              {new Date(p.created_at).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(p.id)}
                                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                title="Modifier"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                                title="Supprimer"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-slate-700 mb-2">Aucune propriété trouvée</h3>
            <p className="text-slate-500">
              {filter ? "Aucune propriété ne correspond à votre recherche." : "Vous n'avez pas encore ajouté de propriétés."}
            </p>
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
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const offers = [
    { points: 100, price: "50 dh" },
    { points: 200, price: "100 dh" },
    { points: 300, price: "150 dh" },
    { points: 400, price: "200 dh" },
    { points: 500, price: "250 dh" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Account</h1>
          <p className="text-slate-600">Manage your points and purchase more</p>
        </div>

        {/* Balance Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10 border border-slate-200 relative overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : (
            <>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full"></div>
              <h2 className="text-xl font-semibold text-slate-700 mb-4 relative z-10">Current Balance</h2>
              <div className="flex items-end mb-2 relative z-10">
                <span className="text-5xl md:text-6xl font-bold text-blue-600 mr-3">{balance}</span>
                <span className="text-lg text-slate-600 mb-2">points</span>
              </div>
              <p className="text-slate-500 relative z-10">Your points are ready to use</p>
            </>
          )}
        </div>

        {/* Offers Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6 text-center md:text-left">
            Need more points?
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {offers.map((offer) => (
              <div
                key={offer.points}
                className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="mb-4 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <p className="text-2xl font-bold text-slate-800 mb-2">
                  {offer.points} points
                </p>
                <p className="text-lg text-slate-600 mb-5">{offer.price}</p>
                <button className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mt-10">
          <h4 className="text-lg font-semibold text-slate-800 mb-3">How to use your points</h4>
          <p className="text-slate-600">
            Your points can be used to purchase products in our store. 1 point = 0.5 dh discount on your purchases.
          </p>
        </div>
      </div>
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
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      // You could add a toast notification here
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

  // Enhanced mask with visual appeal
  const maskInfo = (info) => {
    if (!info) return "••••••••";
    const visibleChars = Math.floor(info.length * 0.3);
    return "•".repeat(info.length - visibleChars) + info.slice(-visibleChars);
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
    if (sortConfig.key !== key) return "fa-sort text-slate-400";
    return sortConfig.direction === "asc" 
      ? "fa-sort-up text-blue-600" 
      : "fa-sort-down text-blue-600";
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
        // Add toast notification here
        return;
      }

      if (!statusResp.ok) {
        // Add toast notification here
        return;
      }

      setUserPoints((prev) => prev - 1);
      setUnlockedLeads((prev) => [...prev, leadToUnlock.id]);
      setSelectedLead(leadToUnlock);
      setShowConfirmation(false);
      setLeadToUnlock(null);

      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadToUnlock.id ? { ...l, status: "accepted" } : l
        )
      );
    } catch (err) {
      console.error("Error updating lead status:", err);
      // Add toast notification here
    }
  };

  const handleRejectUnlock = () => {
    setShowConfirmation(false);
    setLeadToUnlock(null);
  };

  // Enhanced loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Gestion des Leads</h1>
              <p className="text-slate-600 mt-1">Gérez et suivez vos prospects</p>
            </div>
            
            {/* Points Display */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2">
                  <i className="fa-solid fa-coins text-white text-sm"></i>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Vos points</p>
                  <p className="font-semibold text-slate-800">{userPoints} point(s)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Property Filter */}
                <div className="relative flex-1 sm:flex-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-building text-slate-400"></i>
                  </div>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm transition-all duration-200"
                  >
                    <option value="">Toutes les propriétés</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.type} {property.chambres} chambres ({property.quartier.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un lead..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm transition-all duration-200"
                  />
                </div>
              </div>

              {/* Stats and Actions */}
              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="bg-blue-100 rounded-lg p-1">
                    <i className="fa-solid fa-chart-line text-blue-600 text-xs"></i>
                  </div>
                  <span className="font-medium">{filteredLeads.length} lead(s)</span>
                </div>
                
                <button
                  onClick={fetchLeads}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200 disabled:opacity-50"
                >
                  <i className={`fa-solid fa-rotate ${isRefreshing ? 'animate-spin' : ''}`}></i>
                  <span className="text-sm">Actualiser</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
                <tr>
                  {[
                    { key: "name", label: "Nom" },
                    { key: "phone", label: "Téléphone" },
                    { key: "email", label: "Email" },
                    { key: "created_at", label: "Date" },
                    { key: "status", label: "Statut" }
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors duration-150"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        <i className={`fa ${getSortIcon(key)} ml-1`}></i>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="hover:bg-slate-50/50 cursor-pointer group transition-all duration-200"
                      onClick={() => handleLeadClick(lead)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-2">
                            <i className="fa-solid fa-user text-blue-600 text-sm"></i>
                          </div>
                          <span className="font-medium text-slate-800">
                            {lead.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-phone text-slate-400 text-xs"></i>
                          <span className={`font-mono ${
                            lead.status === "accepted" || unlockedLeads.includes(lead.id)
                              ? "text-slate-800"
                              : "text-slate-400"
                          }`}>
                            {lead.status === "accepted" || unlockedLeads.includes(lead.id)
                              ? lead.phone
                              : maskInfo(lead.phone)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-envelope text-slate-400 text-xs"></i>
                          <span className={
                            lead.status === "accepted" || unlockedLeads.includes(lead.id)
                              ? "text-slate-800"
                              : "text-slate-400"
                          }>
                            {lead.status === "accepted" || unlockedLeads.includes(lead.id)
                              ? lead.email
                              : maskInfo(lead.email)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-calendar text-slate-400 text-xs"></i>
                          <span className="text-slate-600">
                            {formatDateTime(lead.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            lead.status === "accepted" || unlockedLeads.includes(lead.id)
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <i className={`fa-solid ${
                            lead.status === "accepted" || unlockedLeads.includes(lead.id)
                              ? "fa-lock-open"
                              : "fa-lock"
                          }`}></i>
                          {lead.status === "accepted" || unlockedLeads.includes(lead.id)
                            ? "Débloqué"
                            : "Bloqué"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                
                {filteredLeads.length === 0 && (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <i className="fa-solid fa-inbox text-4xl"></i>
                        <p className="text-lg font-medium">Aucun lead trouvé</p>
                        <p className="text-sm">Ajustez vos filtres pour voir plus de résultats</p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Unlock Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && leadToUnlock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              >
                <div className="text-center mb-6">
                  <div className="bg-amber-100 rounded-full p-3 inline-flex mb-4">
                    <i className="fa-solid fa-lock-open text-amber-600 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Débloquer ce lead ?
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Cela coûtera 1 point. Vous aurez accès aux coordonnées complètes de {leadToUnlock.name}.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleRejectUnlock}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmUnlock}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
                  >
                    Débloquer (1pt)
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}












export default function OwnerPanel() {
  const [mainSection, setMainSection] = useState('properties');
  const [subSection, setSubSection] = useState('boutique');

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-lg flex flex-col py-10 px-6 sticky top-0 h-screen">
        <div className="mb-10 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-home text-white text-lg"></i>
          </div>
          <span className="ml-3 text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Owner Panel</span>
        </div>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => { setMainSection('properties'); setSubSection('boutique'); }}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              mainSection === 'properties'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Mes propriétés
          </button>
          <button
            onClick={() => setMainSection('balance')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              mainSection === 'balance'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Balance
          </button>
          <button
            onClick={() => setMainSection('leads')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              mainSection === 'leads'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Leads
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {mainSection === 'properties' && (
          <div>
            {/* Subsection Tabs */}
            <div className="flex gap-4 px-8 pt-8">
              <button
                onClick={() => setSubSection('boutique')}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                  subSection === 'boutique'
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-100'
                }`}
              >
                Boutique
              </button>
              <button
                onClick={() => setSubSection('ajouter')}
                className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                  subSection === 'ajouter'
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-100'
                }`}
              >
                Ajouter
              </button>
            </div>
            {/* Subsection Content */}
            <div>
              {subSection === 'boutique' && <Boutique />}
              {subSection === 'ajouter' && <AddProperty />}
            </div>
          </div>
        )}
        {mainSection === 'balance' && <Balance />}
        {mainSection === 'leads' && <Leads />}
      </main>
    </div>
  );
}