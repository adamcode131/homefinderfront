import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserPanel() {
  const [section, setSection] = useState('mes-demandes');
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '0612345678',
    password: '',
    newPassword: '',
    favoriteNeighborhoods: '',
    preferredType: '',
    emailAlerts: true,
  });

  const [demandes, setDemandes] = useState([
    { id: 1, property: 'Appartement Gauthier', type: 'Appartement', price: '4000 DH', status: 'En cours', date: '2025-09-18' },
    { id: 2, property: 'Villa Oasis', type: 'Villa', price: '12000 DH', status: 'Accepté', date: '2025-09-12' },
    { id: 3, property: 'Studio Downtown', type: 'Studio', price: '2500 DH', status: 'Refusé', date: '2025-09-05' },
  ]);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Profil mis à jour !'); // Ici vous pouvez appeler votre API
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('ownerToken');
    navigate('/login_user');
  };  

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-lg flex flex-col py-10 px-6 sticky top-0 h-screen">
        <div className="mb-10 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-user text-white text-lg"></i>
          </div>
          <span className="ml-3 text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Client Panel
          </span>
        </div>
        <nav className="flex flex-col gap-2 mb-6">
          <button
            onClick={() => setSection('mes-demandes')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              section === 'mes-demandes'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Mes Demandes
          </button>
          <button
            onClick={() => setSection('profil')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              section === 'profil'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Profil
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-600 transition-all duration-200"
        >
          Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {section === 'mes-demandes' && (
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Mes Demandes</h2>
            <p className="text-slate-600 mb-4">
              Ici vous trouverez toutes vos demandes de propriété et leur statut actuel.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-4 py-2 border-b">Propriété</th>
                    <th className="px-4 py-2 border-b">Type</th>
                    <th className="px-4 py-2 border-b">Prix</th>
                    <th className="px-4 py-2 border-b">Statut</th>
                    <th className="px-4 py-2 border-b">Date</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {demandes.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2 border-b">{d.property}</td>
                      <td className="px-4 py-2 border-b">{d.type}</td>
                      <td className="px-4 py-2 border-b">{d.price}</td>
                      <td className={`px-4 py-2 border-b font-medium ${d.status === 'Accepté' ? 'text-green-600' : d.status === 'Refusé' ? 'text-red-600' : 'text-yellow-600'}`}>
                        {d.status}
                      </td>
                      <td className="px-4 py-2 border-b">{d.date}</td>
                      <td className="px-4 py-2 border-b space-x-2">
                        <button className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">Voir</button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">Annuler</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === 'profil' && (
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-slate-100">
            {/* Header Section */}
            <div className="text-center mb-2">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Profil Utilisateur</h2>
              <p className="text-slate-500">Gérez vos informations personnelles et préférences</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Two-column layout for name and email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                      placeholder="Votre nom complet"
                    />
                    <span className="absolute right-3 top-3.5 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Adresse email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                      placeholder="votre@email.com"
                    />
                    <span className="absolute right-3 top-3.5 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Numéro de téléphone</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                    placeholder="+212 6 00 00 00 00"
                  />
                  <span className="absolute right-3 top-3.5 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Photo de profil</label>
                <div className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 transition-colors">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-slate-500 mb-2">Glissez-déposez votre photo ou</p>
                    <label htmlFor="file-upload" className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                      Parcourir les fichiers
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      name="photo"
                      onChange={handleProfileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type="password"
                    name="newPassword"
                    value={profile.newPassword}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                    placeholder="Laisser vide si inchangé"
                  />
                  <span className="absolute right-3 top-3.5 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Two-column layout for preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quartiers favoris</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="favoriteNeighborhoods"
                      value={profile.favoriteNeighborhoods}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                      placeholder="Ex: Gauthier, Oasis"
                    />
                    <span className="absolute right-3 top-3.5 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type de propriété préféré</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="preferredType"
                      value={profile.preferredType}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                      placeholder="Ex: Appartement, Villa"
                    />
                    <span className="absolute right-3 top-3.5 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Alerts Toggle */}
              <div className="flex items-center p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="emailAlerts"
                    checked={profile.emailAlerts}
                    onChange={handleProfileChange}
                    id="emailAlerts"
                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="emailAlerts" className="font-medium text-slate-700">Recevoir les alertes par email</label>
                  <p className="text-slate-500">Soyez informé des nouvelles propriétés correspondant à vos critères</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Mettre à jour le profil
                </div>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
