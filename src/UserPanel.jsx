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
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Profil</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-1">Nom</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Photo de profil</label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleProfileChange}
                  className="w-full py-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  name="newPassword"
                  value={profile.newPassword}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Laisser vide si inchangé"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Quartiers favoris</label>
                <input
                  type="text"
                  name="favoriteNeighborhoods"
                  value={profile.favoriteNeighborhoods}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Gauthier, Oasis"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Type de propriété préféré</label>
                <input
                  type="text"
                  name="preferredType"
                  value={profile.preferredType}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Appartement, Villa"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="emailAlerts"
                  checked={profile.emailAlerts}
                  onChange={handleProfileChange}
                  id="emailAlerts"
                />
                <label htmlFor="emailAlerts" className="text-slate-700">Recevoir les alertes par email</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                Mettre à jour le profil
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
