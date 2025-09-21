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
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Pending Properties</h1>
            {pendingProperties.length === 0 ? (
              <p>No properties found.</p>
            ) : (
              <ul className="space-y-4">
                {pendingProperties.map((property) => (
                  <li
                    key={property.id}
                    className="p-4 bg-white border rounded-lg shadow hover:shadow-md transition-all"
                  >
                    <h2 className="text-xl font-semibold">{property.title}</h2>
                    <p>Type: {property.type}</p>
                    <p>Ville: {property.ville_id}</p>
                    <p>
                      Montant :{' '}
                      {property.sale_price
                        ? property.sale_price
                        : property.rent_price}{' '}
                      {property.sale_price
                        ? 'dh (paiement seul fois)'
                        : 'dh/mois'}
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
                        <p className="text-gray-400 text-sm">
                          No images available
                        </p>
                      )}

                      <button
                        onClick={() => validateProperty(property.id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Valider
                      </button>

                      <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Rejecter
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
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
          <div>
            <h1 className="text-3xl font-bold mb-6">Users</h1>
            <ul className="space-y-4">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-4 bg-white border rounded-lg shadow hover:shadow-md transition-all"
                >
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p>Email: {user.email}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
