import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useParams } from 'react-router-dom';

export default function UpdateProperty() {
  const { state } = useLocation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const [form, setForm] = useState({
    title: '',
    type: '',
    ville_id: '',
    quartier_id: '',
    description: '',
    intention: 'loyer',
    rent_price: '',
    sale_price: '',
    images: [],
    existingImages: []
  });

  const [villes, setVilles] = useState([]);
  const [quartiers, setQuartiers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/villes')
      .then(res => res.json())
      .then(data => setVilles(data))
      .catch(console.error);
  }, []);

useEffect(() => {
  if (!propertyId || !currentUser) return;

  const token = localStorage.getItem('token');

  fetch(`http://localhost:8000/api/updateproperty/${propertyId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const p = data.property;
      setForm({
        title: p.title,
        type: p.type,
        ville_id: p.ville_id,
        quartier_id: p.quartier_id,
        description: p.description,
        intention: p.intention,
        rent_price: p.rent_price,
        sale_price: p.sale_price,
        images: [],
        existingImages: p.images || []
      });
    })
    .catch(console.error);
}, [propertyId, currentUser]);


  useEffect(() => {
    if (!form.ville_id) return setQuartiers([]);

    fetch(`http://localhost:8000/api/villes/${form.ville_id}/quartiers`)
      .then(res => res.json())
      .then(data => setQuartiers(data));
  }, [form.ville_id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value, ...(name === 'ville_id' ? { quartier_id: '' } : {}) }));
  };

  const handleIntentionChange = e => {
    setForm(prev => ({
      ...prev,
      intention: e.target.value,
      rent_price: '',
      sale_price: '',
    }));
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    setForm(prev => ({ ...prev, images: [...prev.images, ...files] }));
    e.target.value = '';
  };

  const handleRemoveImage = idx => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  const handleRemoveExistingImage = idx => {
    setForm(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('property_id', propertyId);
    formData.append('title', form.title);
    formData.append('type', form.type);
    formData.append('intention', form.intention);
    formData.append('description', form.description);
    formData.append('ville_id', form.ville_id);
    formData.append('quartier_id', form.quartier_id || '');
    formData.append('rent_price', form.intention === 'loyer' ? form.rent_price : 0);
    formData.append('sale_price', form.intention === 'vente' ? form.sale_price : 0);

    form.images.forEach(img => formData.append('images[]', img));

    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8000/api/updateproperty/${propertyId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      alert('Property updated!');
      navigate('/ownerpanel');
    } else {
      const error = await res.text();
      alert('Error: ' + error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow border border-slate-200 mt-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Modifier la propriété</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">--Sélectionnez le type--</option>
            {['Appartement','Villa','Maison','Studio','Duplex','Terrain','Bureau','Local Commercial','Chambre'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Ville & Quartier */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
            <select
              name="ville_id"
              value={form.ville_id}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">--Sélectionnez la ville--</option>
              {villes.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quartier</label>
            <select
              name="quartier_id"
              value={form.quartier_id}
              onChange={handleChange}
              disabled={!form.ville_id}
              className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
            >
              <option value="">--Sélectionnez le quartier--</option>
              {quartiers.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Intention */}
        <div>
          <span className="block text-sm font-medium text-slate-700 mb-1">Intention</span>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="radio" name="intention" value="loyer" checked={form.intention==='loyer'} onChange={handleIntentionChange} className="accent-blue-500" />
              Louer
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="intention" value="vente" checked={form.intention==='vente'} onChange={handleIntentionChange} className="accent-blue-500" />
              Vente
            </label>
          </div>
        </div>

        {/* Price */}
        {form.intention === 'loyer' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prix (DH / mois)</label>
            <input type="number" name="rent_price" value={form.rent_price} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
          </div>
        )}
        {form.intention === 'vente' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Prix (DH)</label>
            <input type="number" name="sale_price" value={form.sale_price} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
          </div>
        )}

        {/* Existing Images */}
        {form.existingImages.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {form.existingImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={`http://localhost:8000/storage/${img.url}`} alt="existing" className="w-full h-24 object-cover rounded-lg border border-slate-300" />
                <button type="button" onClick={() => handleRemoveExistingImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
              </div>
            ))}
          </div>
        )}

        {/* New Images */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ajouter des images</label>
          <input type="file" multiple onChange={handleImageChange} className="w-full" />
          {form.images.length > 0 && (
            <div className="flex gap-4 mt-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={URL.createObjectURL(img)} alt="new" className="w-24 h-24 object-cover rounded-lg border border-slate-300" />
                  <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">Mettre à jour</button>
      </form>
    </div>
  );
}
