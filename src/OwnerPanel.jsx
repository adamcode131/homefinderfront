import React, { useEffect, useState } from 'react';
import AddProperty from './addProperty.jsx';

function Boutique() {
  const [properties,setProperties] = useState([]) ; 
  const ownerid = localStorage.getItem('ownerid')  ; 
useEffect(() => {
  const fetchProperties = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/getProperties",{
        headers : {
          'Authorization': `Bearer ${localStorage.getItem('ownerToken')}`
        }
      });
      const data = await res.json();
      setProperties(data.properties); 
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  fetchProperties();
}, [ownerid]);
  

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Ma Boutique</h2>
      <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
        
{
  properties.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {properties.map((p) => (
        <div
          key={p.id}
          className="border border-slate-200 rounded-xl shadow-sm overflow-hidden bg-white hover:shadow-lg transition-all"
        >
          {/* Image */}
          {p.images && p.images.length > 0 ? (
            <img
              src={`http://localhost:8000/storage/${p.images[0].url}`}
              alt={p.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400">
              No Image
            </div>
          )}

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-800">{p.title}</h3>
            <p className="text-slate-600 text-sm">{p.ville}, {p.quartier}</p>
            <p className="mt-2 text-blue-600 font-medium">
              {p.purpose === "rent"
                ? `${p.rent_price} DH / mois`
                : `${p.sale_price} DH`}
            </p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-slate-500 mt-4">Aucune propriété trouvée.</p>
  )
}



      </div>
    </div>
  );
}

function Balance() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Balance</h2>
      <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
        <p className="text-lg text-slate-600">Your current balance: <span className="font-semibold text-blue-600">12,000 DH</span></p>
      </div>
    </div>
  );
}

function Leads() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Leads</h2>
      <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
        <p className="text-lg text-slate-600">No new leads yet.</p>
      </div>
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