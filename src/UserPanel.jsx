import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserPanel() {
  const [section, setSection] = useState('mes-demandes');
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
  
    fetch('http://localhost:8000/api/update_user', {
      method: 'PUT', 
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
      body: JSON.stringify(profile)
    })
    .then(res => res.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch(err => {
      console.error('Error:', err);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ownerToken');
    navigate('/login_user');
  };  

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Fixed Sidebar - Consistent Width */}
      <aside className="w-80 flex-shrink-0 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-xl flex flex-col py-8 px-6 sticky top-0 h-screen">
        <div className="mb-12 flex items-center px-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <i className="fa-solid fa-user text-white text-xl"></i>
          </div>
          <div className="ml-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Espace Client
            </span>
            <p className="text-sm text-slate-500 mt-1">Gestion de votre compte</p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => setSection('mes-demandes')}
            className={`group text-left px-4 py-4 rounded-2xl font-medium transition-all duration-300 ${
              section === 'mes-demandes'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-700 hover:bg-white hover:shadow-lg hover:border hover:border-slate-200/60'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all ${
                section === 'mes-demandes' ? 'bg-white/20' : 'bg-blue-50 text-blue-600'
              }`}>
                <i className="fa-solid fa-list-check text-lg"></i>
              </div>
              <span className="font-semibold">Mes Demandes</span>
            </div>
          </button>
          
          <button
            onClick={() => setSection('profil')}
            className={`group text-left px-4 py-4 rounded-2xl font-medium transition-all duration-300 ${
              section === 'profil'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-700 hover:bg-white hover:shadow-lg hover:border hover:border-slate-200/60'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all ${
                section === 'profil' ? 'bg-white/20' : 'bg-blue-50 text-blue-600'
              }`}>
                <i className="fa-solid fa-user-gear text-lg"></i>
              </div>
              <span className="font-semibold">Profil</span>
            </div>
          </button>
        </nav>
        
        <button
          onClick={handleLogout}
          className="mt-auto group px-4 py-4 rounded-2xl font-medium bg-white border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 bg-red-50 text-red-500 group-hover:bg-red-100 transition-all">
              <i className="fa-solid fa-arrow-right-from-bracket text-lg"></i>
            </div>
            <span className="font-semibold">Déconnexion</span>
          </div>
        </button>
      </aside>

      {/* Main Content - Fixed to prevent layout shift */}
      <main className="flex-1 min-w-0 p-8">
        {section === 'mes-demandes' && (
          <div className="w-full max-w-full">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl shadow-2xl shadow-blue-500/25 p-8 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Mes Demandes</h1>
                  <p className="text-blue-100 text-lg opacity-90">
                    Suivez l'état de vos réservations de propriétés
                  </p>
                </div>
                <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-center">{demandes.length}</div>
                  <div className="text-blue-100 text-sm">Demandes totales</div>
                </div>
              </div>
            </div>

            {/* Enhanced Table Card - Made smaller */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
              <div className="p-6">
                {/* Smaller header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">Historique des Demandes</h2>
                  <div className="flex items-center space-x-2">
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

                <div className="overflow-hidden rounded-xl border border-slate-200/60">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Propriété</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Prix</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Statut</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60">
                      {demandes.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-home text-blue-600 text-xs"></i>
                              </div>
                              <span className="font-medium text-slate-800 text-sm">{d.property.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {d.property.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-800 text-sm">
                              {d.property.sale_price ? d.property.sale_price : d.property.rent_price} DH
                              <span className="text-xs font-normal text-slate-500 ml-1">
                                {d.property.sale_price ? '(vente)' : '/mois'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
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
                          <td className="px-4 py-3 text-slate-600 font-medium text-sm">{d.date_reservation}</td>
                          <td className="px-4 py-3">
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
            {/* Enhanced Header Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-2xl shadow-purple-500/25 p-8 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Profil Utilisateur</h1>
                  <p className="text-indigo-100 text-lg opacity-90">
                    Gérez vos informations personnelles et préférences
                  </p>
                </div>
                <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm text-center">
                  <div className="text-2xl font-bold">{profile.name ? profile.name.split(' ')[0] : '...'}</div>
                  <div className="text-indigo-100 text-sm">Bienvenue</div>
                </div>
              </div>
            </div>

            {/* Enhanced Profile Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
              <div className="p-8">
                <form onSubmit={handleProfileSubmit} className="space-y-8">
                  {/* Personal Information Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100/60">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <i className="fa-solid fa-user text-white text-sm"></i>
                      </div>
                      Informations Personnelles
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700">Nom complet</label>
                        <div className="relative group">
                          <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 group-hover:border-slate-400 shadow-sm"
                            placeholder="Votre nom complet"
                          />
                          <div className="absolute right-3 top-3.5 text-slate-400">
                            <i className="fa-solid fa-user text-sm"></i>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700">Adresse email</label>
                        <div className="relative group">
                          <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 group-hover:border-slate-400 shadow-sm"
                            placeholder="votre@email.com"
                          />
                          <div className="absolute right-3 top-3.5 text-slate-400">
                            <i className="fa-solid fa-envelope text-sm"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <label className="block text-sm font-semibold text-slate-700">Numéro de téléphone</label>
                      <div className="relative group">
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400 group-hover:border-slate-400 shadow-sm"
                          placeholder="+212 6 00 00 00 00"
                        />
                        <div className="absolute right-3 top-3.5 text-slate-400">
                          <i className="fa-solid fa-phone text-sm"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100/60">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <i className="fa-solid fa-heart text-white text-sm"></i>
                      </div>
                      Préférences
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700">Quartiers favoris</label>
                        <div className="relative group">
                          <input
                            type="text"
                            name="favoriteNeighborhoods"
                            value={profile.favoriteNeighborhoods}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-slate-400 group-hover:border-slate-400 shadow-sm"
                            placeholder="Ex: Gauthier, Oasis"
                          />
                          <div className="absolute right-3 top-3.5 text-slate-400">
                            <i className="fa-solid fa-location-dot text-sm"></i>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700">Type de propriété préféré</label>
                        <div className="relative group">
                          <input
                            type="text"
                            name="preferredType"
                            value={profile.preferredType}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-slate-400 group-hover:border-slate-400 shadow-sm"
                            placeholder="Ex: Appartement, Villa"
                          />
                          <div className="absolute right-3 top-3.5 text-slate-400">
                            <i className="fa-solid fa-home text-sm"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notifications Section */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100/60">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                        <i className="fa-solid fa-bell text-white text-sm"></i>
                      </div>
                      Notifications
                    </h3>
                    
                    <div className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-orange-200/60 shadow-sm">
                      <div className="flex items-center h-5 mt-1">
                        <input
                          type="checkbox"
                          name="emailAlerts"
                          checked={profile.emailAlerts}
                          onChange={handleProfileChange}
                          id="emailAlerts"
                          className="h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="emailAlerts" className="block font-semibold text-slate-800 text-lg mb-1">
                          Alertes par email
                        </label>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          Recevez des notifications instantanées lorsque de nouvelles propriétés correspondant à vos critères sont disponibles.
                          Restez informé des opportunités immobilières en temps réel.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center"
                    >
                      <i className="fa-solid fa-floppy-disk mr-3 group-hover:rotate-12 transition-transform"></i>
                      Sauvegarder les modifications
                      <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}