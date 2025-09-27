import React, { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [section, setSection] = useState('dashboard');
  const [pendingProperties, setPendingProperties] = useState([]);
  const [properties, setProperties] = useState([]); 
  const [filter,setFilter] = useState('') ; 
  const [filteredProperties, setFilteredProperties] = useState([]) ;  
  const [users,setUsers] = useState([]) ; 
  // fetch pending properties
  useEffect(() => {
    if (section === 'not_validated_properties') {
      fetch('http://localhost:8000/api/notvalidatedproperties')
        .then((resp) => resp.json())
        .then((data) => setPendingProperties(data.properties || []))
        .catch((err) => console.error(err));
    }
  }, [section]);

  // fetch all properties
  useEffect(() => {
    if (section === 'all_properties') {
      fetch('http://localhost:8000/api/properties')
        .then((resp) => resp.json())
        .then((data) => setProperties(data.properties || []))
        .catch((err) => console.error(err));
    }
  }, [section]);

  const validateProperty = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/properties/${id}/validate`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const data = await response.json();
      console.log(data.message);

      // refresh pending list
      setPendingProperties((prev) =>
        prev.filter((property) => property.id !== id)
      );
    } catch (err) {
      console.error('Validation failed', err);
    }
  }; 

// filter properties when list or filter changes
useEffect(() => {
  if (!filter) {
    setFilteredProperties(properties);
  } else {
    setFilteredProperties(
      properties.filter((p) =>
        p.title.toLowerCase().includes(filter.toLowerCase()) ||
        p.type.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }
}, [properties, filter]); 


    useEffect(() => {
      fetch('http://localhost:8000/api/users')
        .then((resp) => resp.json())
        .then((data) => setUsers(data.users || []))
        .catch((err) => console.error(err));
    }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-lg flex flex-col py-10 px-6 sticky top-0 h-screen">
        <div className="mb-10 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-shield-halved text-white text-lg"></i>
          </div>
          <span className="ml-3 text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Admin Panel
          </span>
        </div>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setSection('dashboard')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              section === 'dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setSection('users')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              section === 'users'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setSection('not_validated_properties')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              section === 'not_validated_properties'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Pending Properties
          </button>
          <button
            onClick={() => setSection('all_properties')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              section === 'all_properties'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Properties
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Pending Properties */}
        {section === 'not_validated_properties' && (
          <div className="w-full max-w-6xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent mb-3">
                Pending Properties
              </h1>
              <p className="text-gray-600 text-lg">Review and validate property submissions</p>
            </div>

            {/* Properties Grid */}
            {pendingProperties.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties Found</h3>
                <p className="text-gray-500">All properties have been validated or no submissions are pending.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {pendingProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="p-6">
                      {/* Property Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300">
                            {property.title}
                          </h2>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h11-2zm2 4h-2v2h2V9z" clipRule="evenodd" />
                              </svg>
                              {property.type}
                            </span>
                            <span className="inline-flex items-center text-gray-600">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {property.ville_id}
                            </span>
                          </div>
                        </div>
                        
                        {/* Price Badge */}
                        <div className="text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {property.sale_price ? property.sale_price : property.rent_price} dh
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            {property.sale_price ? 'One-time payment' : 'Monthly'}
                          </div>
                        </div>
                      </div>

                      {/* Images Gallery */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Images</h4>
                        {property.images && property.images.length > 0 ? (
                          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {property.images.map((img) => (
                              <div key={img.id} className="relative group/image">
                                <img
                                  src={`http://localhost:8000/storage/${img.url}`}
                                  alt={property.title}
                                  className="w-32 h-20 object-cover rounded-xl border-2 border-white shadow-md group-hover/image:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/image:bg-opacity-20 rounded-xl transition-all duration-300" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-400 text-sm font-medium">No images available</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => validateProperty(property.id)}
                          className="group/validate relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                        >
                          <span className="relative z-10 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Validate
                          </span>
                          <div className="absolute inset-0 bg-white bg-opacity-20 transform -skew-x-12 -translate-x-full group-hover/validate:translate-x-full transition-transform duration-1000" />
                        </button>

                        <button className="group/reject relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                          <span className="relative z-10 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </span>
                          <div className="absolute inset-0 bg-white bg-opacity-50 transform -skew-x-12 -translate-x-full group-hover/reject:translate-x-full transition-transform duration-1000" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Properties */}
        {section === 'all_properties' && (
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">All Properties</h1>
            {/* filter bar  */} 
  
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                placeholder="Rechercher par titre ou type..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 shadow-sm 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          placeholder-slate-400 bg-white transition-all duration-200
                          hover:border-slate-300"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
            </div>

            {filteredProperties.length === 0 ? (
              <p>No properties found.</p>
            ) : (
              <ul className="space-y-4">
                {filteredProperties.map((property) => (
                  <li
                    key={property.id}
                    className="p-4 bg-white border rounded-lg shadow hover:shadow-md transition-all"
                  >
                    <h2 className="text-xl font-semibold">{property.title}</h2>
                    <p>Type: {property.type}</p>
                    <p>Ville: {property.ville_id}</p>
                    <p>
                      Montant :{' '}
                      {property.sale_price ? property.sale_price : property.rent_price}{' '}
                      {property.sale_price ? 'dh (paiement seul fois)' : 'dh/mois'}
                    </p>

                    {/* ✅ Statut line */}
                    <p>
                      Statut:{' '}
                      {property.is_validated
                        ? <span className="text-green-600 font-medium">Validated</span>
                        : <span className="text-red-500 font-medium">Not validated yet</span>}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {property.images && property.images.length > 0 ? (
                        property.images.map((img) => (
                          <img
                            key={img.id}
                            src={`http://localhost:8000/storage/${img.url}`}
                            alt={property.title}
                            className="w-32 h-20 object-cover rounded-lg border"
                          />
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No images available</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )} 

        {section === "users" && (
          <div className="w-full max-w-7xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl mb-6 shadow-lg border border-blue-100">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
                Users Management
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Manage your community members with ease. View, edit, and monitor user activities.
              </p>
              
              {/* Stats Bar */}
              <div className="flex justify-center gap-8 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700">{users.length}</div>
                  <div className="text-sm text-gray-500 font-medium">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{users.filter(u => u.isActive).length}</div>
                  <div className="text-sm text-gray-500 font-medium">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-800">{users.filter(u => u.isAdmin).length}</div>
                  <div className="text-sm text-gray-500 font-medium">Admins</div>
                </div>
              </div>
            </div>

            {/* Users Grid */}
            {users.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-white rounded-full flex items-center justify-center shadow-lg border border-blue-100">
                  <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-800 mb-3">No Users Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  There are no users in the system yet. Users will appear here once they register.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {users.map((user, index) => (
                  <div
                    key={user.id}
                    className="group relative bg-white rounded-3xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden"
                    style={{
                      animation: `cardSlideIn 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    {/* Background Gradient Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative p-6">
                      {/* User Avatar & Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl font-bold text-white">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                            user.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        
                        {/* Admin Badge */}
                        {user.isAdmin && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Admin
                          </span>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 mb-2">
                          {user.name}
                        </h2>
                        <p className="text-gray-600 text-sm flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {user.email}
                        </p>
                        
                        {/* Additional User Info */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-blue-100">
                        <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                          View Profile
                        </button>
                        <button className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-3xl transition-all duration-500 pointer-events-none" />
                    
                    {/* Green Accent Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
