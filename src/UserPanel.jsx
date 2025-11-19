import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserPanel() {
  const [section, setSection] = useState('mes-demandes');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleSetSection = (s) => { setSection(s); setDrawerOpen(false); };
  const [properties,setProperties] = useState();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    favoriteNeighborhoods: '',
    preferredType: '',
    emailAlerts: false
  });
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (resp) => {
        const data = await resp.json();

        console.log("User API response:", data, "Status:", resp.status);

        if (!resp.ok) {
          // HTTP error (401, 403, etc.)
          console.warn("API returned error:", data);
          return;
        }

        if (data.user) {
          setProfile((prev) => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            favoriteNeighborhoods: data.user.favoriteNeighborhoods || "",
            preferredType: data.user.preferredType || "",
            emailAlerts: data.user.emailAlerts ?? false,
          }));
        } else {
          console.warn("No user returned:", data);
        }
      })
      .catch((err) => console.error("Network or parsing error:", err));
  }, []);

  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/all_leads', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      console.log("Fetched data:", data);
      setDemandes(data.leads);
    });
  }, []);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', profile.name || '');
    formData.append('email', profile.email || '');
    formData.append('phone', profile.phone || '');
    // Append other fields if needed
    if (imageFile) {
      formData.append('image', imageFile);
    }

    fetch('http://localhost:8000/api/update_user', {
      method: 'POST', // use POST with method override or the backend may accept PUT; we'll include _method
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
        // DO NOT set Content-Type; browser will set multipart/form-data boundary
      },
      body: (() => {
        // Some backends expect a _method override for PUT when using form-data
        if (!formData.has('_method')) formData.append('_method', 'PUT');
        return formData;
      })()
    })
    .then(async res => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) console.error('Update failed', data);
      else console.log('Success:', data);
      // If backend returns new user image path, update preview
      if (data.user) {
        const imagePath = data.user.image ?? data.user.photo ?? null;
        if (imagePath) {
          setUserData(prev => ({ ...prev, photo: `http://localhost:8000/storage/${imagePath}` }));
        }
      }
    })
    .catch(err => {
      console.error('Error:', err);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      // show preview
      const previewUrl = URL.createObjectURL(file);
      setUserData(prev => ({ ...prev, photo: previewUrl }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ownerToken');
    navigate('/login_user');
  };  

  const [userData, setUserData] = useState({
  name: 'Chargement en cours',
  photo: 'user.png',
  role: 'Client'
});
const [loading, setLoading] = useState(true);

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
          // Build a fully-qualified URL for the image stored by Laravel (storage/app/public/... -> /storage/...)
          const imagePath = data.user.image ?? data.user.photo ?? null;
          const photoUrl = imagePath ? `http://localhost:8000/storage/${imagePath}` : 'user.png';

          setUserData({
            name: data.user.name || 'Sarah Bennani',
            photo: photoUrl,
            role: data.user.role || 'Client'
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

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-40 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Open menu"
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
          <div className="text-lg font-medium text-gray-900">{section === 'mes-demandes' ? 'Mes Demandes' : section === 'profil' ? 'Profil' : ''}</div>
          <div className="w-8" />
        </div>
      </div>
      {/* Fixed Sidebar (desktop only) */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-soft border-r border-gray-200 fixed left-0 top-0 h-full z-40">
        <div className="p-6 border-b border-gray-200">
          <div className="text-xl font-bold text-primary flex items-center">
            <i className="fa-solid fa-home mr-2"></i>
            PropertyAI
          </div>
          <p className="text-sm text-gray-600 mt-1">Espace Client</p>
        </div>
        
        <nav className="p-4 w-full">
          <div className="space-y-2 w-full">
            <button
              onClick={() => setSection('mes-demandes')}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                section === 'mes-demandes'
                  ? 'text-primary bg-blue-50 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fa-solid fa-list-check mr-3 w-5"></i>
              Mes Demandes
            </button>
            
            <button
              onClick={() => setSection('profil')}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                section === 'profil'
                  ? 'text-primary bg-blue-50 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fa-solid fa-user-gear mr-3 w-5"></i>
              Profil
            </button>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <img 
              src={userData.photo} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover" 
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

      {/* Mobile Drawer (kept in DOM for smooth animations) */}
      <div className={`md:hidden fixed inset-0 z-30 flex ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop with fade animation */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden={!drawerOpen}
        />

        {/* Drawer panel slides in from left */}
        <aside className={`relative w-64 bg-white shadow-xl transform transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`} aria-hidden={!drawerOpen} style={{ willChange: 'transform, opacity' }}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="text-lg font-semibold">Menu</div>
            <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <i className="fa-solid fa-times text-lg"></i>
            </button>
          </div>
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => handleSetSection('mes-demandes')}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                  section === 'mes-demandes'
                    ? 'text-primary bg-blue-50 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="fa-solid fa-list-check mr-3 w-5"></i>
                Mes Demandes
              </button>
              <button
                onClick={() => handleSetSection('profil')}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                  section === 'profil'
                    ? 'text-primary bg-blue-50 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <i className="fa-solid fa-user-gear mr-3 w-5"></i>
                Profil
              </button>
            </div>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <img 
                src={userData.photo} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover" 
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
                onClick={() => { handleLogout(); setDrawerOpen(false); }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
              >
                <i className="fa-solid fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </aside>
      </div>

  {/* Main Content - Fixed with proper margin and scrolling */}
  <main className="flex-1 ml-0 md:ml-64 min-w-0 p-4 sm:p-8 pt-16 md:pt-8 overflow-auto">
        {section === 'mes-demandes' && (
          <div className="w-full max-w-full">
            {/* Header Card */}


            {/* Enhanced Table Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60">
              <div className="p-4 sm:p-6">
                {/* Smaller header - stack on mobile */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Historique des Demandes</h2>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="bg-slate-100 rounded-lg px-3 py-1 text-xs text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors">
                      <i className="fa-solid fa-filter mr-1 text-blue-500"></i>
                      Filtrer
                    </div>
                    <div className="bg-slate-100 rounded-lg px-3 py-1 text-xs text-slate-600 cursor-pointer hover:bg-slate-200 transition-colors">
                      <i className="fa-solid fa-download mr-1 text-blue-500"></i>
                      Exporter
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200/60">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60">
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Propriété</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Prix</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Statut</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60">
                      {demandes.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                          <td className="px-3 py-2 sm:px-4 sm:py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-home text-blue-600 text-xs"></i>
                              </div>
                              <span className="font-medium text-slate-800 text-sm">{d.property.title}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {d.property.type}
                            </span>
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3">
                            <div className="font-semibold text-slate-800 text-sm">
                              {d.property.sale_price ? d.property.sale_price : d.property.rent_price} DH
                              <span className="text-xs font-normal text-slate-500 ml-1">
                                {d.property.sale_price ? '(vente)' : '/mois'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              d.status === 'Accepté' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : d.status === 'Refusé' 
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                d.status === 'Accepté' ? 'bg-green-500' : 
                                d.status === 'Refusé' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}></div>
                              {d.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 text-slate-600 font-medium text-sm">{d.date_reservation}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3">
                            <div className="flex space-x-1.5">
                              <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center text-xs">
                                <i className="fa-solid fa-eye mr-1.5 text-xs"></i>
                                Voir
                              </button>
                              <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md flex items-center text-xs">
                                <i className="fa-solid fa-xmark mr-1.5 text-xs"></i>
                                Annuler
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {demandes.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <i className="fa-solid fa-inbox text-xl text-slate-400"></i>
                    </div>
                    <h3 className="text-base font-semibold text-slate-600 mb-1">Aucune demande pour le moment</h3>
                    <p className="text-slate-500 text-sm">Vos futures demandes apparaîtront ici</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {section === 'profil' && (
          <div className="w-full max-w-full">


              <div className="max-w-6xl mx-auto space-y-6">
              {/* Profile Header Card */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-center space-x-0 sm:space-x-6 gap-4 sm:gap-0">
                  <div className="relative mx-auto sm:mx-0">
                    <img src={userData.photo || "user.png"} alt="Profile" className="w-28 h-28 sm:w-24 sm:h-24 rounded-full object-cover" />
                    <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                      <i className="fa-solid fa-camera text-sm"></i>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{profile.name || 'Sarah Bennani'}</h2>
                    <p className="text-slate-600 mt-1">Membre depuis janvier 2024</p>
                    <div className="flex items-center mt-3 justify-center sm:justify-start space-x-3">
                      <span className="flex items-center text-sm text-slate-600">
                        <i className="fa-solid fa-calendar-check mr-2 text-blue-500"></i>
                        8 demandes
                      </span>
                      <span className="flex items-center text-sm text-slate-600">
                        <i className="fa-solid fa-heart mr-2 text-red-500"></i>
                        12 favoris
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fa-solid fa-user text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Informations personnelles</h3>
                    <p className="text-slate-600 text-sm">Mettez à jour vos informations de contact</p>
                  </div>
                </div>
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Prénom</label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        placeholder="+212 6 12 34 56 78"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Ville</label>
                      <select 
                        name="city"
                        value={profile.city}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      >
                        <option>Casablanca</option>
                        <option>Rabat</option>
                        <option>Marrakech</option>
                        <option>Tanger</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>

              {/* Preferences Section */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fa-solid fa-heart text-green-600 text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Préférences de recherche</h3>
                    <p className="text-slate-600 text-sm">Personnalisez vos critères de recherche</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Quartiers favoris</label>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center">
                        Gauthier
                        <i className="fa-solid fa-times ml-2 cursor-pointer hover:text-blue-500"></i>
                      </span>
                      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center">
                        Maarif
                        <i className="fa-solid fa-times ml-2 cursor-pointer hover:text-blue-500"></i>
                      </span>
                      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center">
                        Ain Diab
                        <i className="fa-solid fa-times ml-2 cursor-pointer hover:text-blue-500"></i>
                      </span>
                      <button className="px-4 py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-full text-sm hover:border-blue-500 hover:text-blue-500 transition-colors">
                        <i className="fa-solid fa-plus mr-2"></i>
                        Ajouter
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Types de propriétés</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                        <input 
                          type="checkbox" 
                          name="apartment"
                          checked={profile.preferredType === 'apartment'}
                          onChange={handleProfileChange}
                          className="sr-only" 
                        />
                        <div className="w-5 h-5 bg-blue-500 rounded border-2 border-blue-500 flex items-center justify-center mr-3">
                          <i className="fa-solid fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-sm font-medium">Appartement</span>
                      </label>
                      <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                        <input 
                          type="checkbox" 
                          name="villa"
                          checked={profile.preferredType === 'villa'}
                          onChange={handleProfileChange}
                          className="sr-only" 
                        />
                        <div className="w-5 h-5 bg-white rounded border-2 border-slate-300 mr-3"></div>
                        <span className="text-sm font-medium">Villa</span>
                      </label>
                      <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                        <input 
                          type="checkbox" 
                          name="studio"
                          checked={profile.preferredType === 'studio'}
                          onChange={handleProfileChange}
                          className="sr-only" 
                        />
                        <div className="w-5 h-5 bg-blue-500 rounded border-2 border-blue-500 flex items-center justify-center mr-3">
                          <i className="fa-solid fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-sm font-medium">Studio</span>
                      </label>
                      <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                        <input 
                          type="checkbox" 
                          name="duplex"
                          checked={profile.preferredType === 'duplex'}
                          onChange={handleProfileChange}
                          className="sr-only" 
                        />
                        <div className="w-5 h-5 bg-white rounded border-2 border-slate-300 mr-3"></div>
                        <span className="text-sm font-medium">Duplex</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Budget max (Location)</label>
                      <select 
                        name="maxBudget"
                        value={profile.maxBudget}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      >
                        <option>Moins de 3,000 DH</option>
                        <option>3,000 - 5,000 DH</option>
                        <option>5,000 - 8,000 DH</option>
                        <option>Plus de 8,000 DH</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de chambres</label>
                      <select 
                        name="bedrooms"
                        value={profile.bedrooms}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      >
                        <option>1 chambre</option>
                        <option>2-3 chambres</option>
                        <option>4+ chambres</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fa-solid fa-bell text-orange-600 text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Notifications</h3>
                    <p className="text-slate-600 text-sm">Gérez vos préférences de notification</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-slate-800">Nouvelles propriétés</h4>
                      <p className="text-sm text-slate-600">Recevoir des alertes pour les nouvelles propriétés correspondant à vos critères</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="newProperties"
                        checked={profile.emailAlerts}
                        onChange={handleProfileChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-slate-800">Confirmations de visite</h4>
                      <p className="text-sm text-slate-600">Recevoir des confirmations et rappels pour vos visites</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="visitConfirmations"
                        checked={profile.visitConfirmations}
                        onChange={handleProfileChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Section */}
              <div className="flex items-center justify-center pt-4">
                <button 
                  onClick={handleProfileSubmit}
                  className="w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-base sm:text-lg rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <i className="fa-solid fa-save mr-2"></i>
                  Sauvegarder les modifications
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}