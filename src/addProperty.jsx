import React, { useState, useEffect } from 'react';

export default function AddProperty() {
  const [form, setForm] = useState({
    title: '',
    type: '',
    ville_id: '',      // store ville ID
    quartier_id: '',   // store quartier ID
    description: '',
    intention: 'loyer',  // default selection
    rent_price: '',
    sale_price: '',
    images: [],
  });

  const [villes, setVilles] = useState([]);
  const [quartiers, setQuartiers] = useState([]);

  // Fetch villes on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/villes')
      .then(res => res.json())
      .then(data => setVilles(data))
      .catch(err => console.error('Erreur lors du chargement des villes:', err));
  }, []);

  // Fetch quartiers when ville_id changes
  useEffect(() => {
    if (form.ville_id) {
      fetch(`http://localhost:8000/api/villes/${form.ville_id}/quartiers`)
        .then(res => res.json())
        .then(data => setQuartiers(data))
        .catch(err => console.error('Erreur lors du chargement des quartiers:', err));
    } else {
      setQuartiers([]);
    }
  }, [form.ville_id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'ville_id' ? { quartier_id: '' } : {}),
    }));
  };

  const handleintentionChange = e => {
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
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('type', form.type);
    formData.append('intention', form.intention);
    formData.append('description', form.description);
    formData.append('ville_id', form.ville_id);
    formData.append('quartier_id', form.quartier_id || '');
    formData.append('rent_price', form.rent_price || 0);
    formData.append('sale_price', form.sale_price || 0);
    // formData.append("owner_token", localStorage.getItem("owner_token"));

    form.images.forEach(img => formData.append('images[]', img));
    const token  = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/storeProperties`, {
        headers: {
          'Authorization': `Bearer ${token}` , 
          'Accept': 'application/json'
        },
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert('Propriété soumise avec succès !');
        console.log(data);

        // Reset form
        setForm({
          title: '',
          type: '',
          ville_id: '',
          quartier_id: '',
          description: '',
          intention: 'loyer',
          rent_price: '',
          sale_price: '',
          images: [],
        });
        setQuartiers([]);
      } else {
        const error = await response.text();
        alert('Erreur lors de la soumission : ' + error);
      }
    } catch (err) {
      alert('Erreur réseau : ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 p-10 space-y-8">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8">
          Ajouter une propriété
        </h2>

        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-slate-700 font-medium mb-2">Titre</label>
          <input
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white placeholder-slate-400"
            placeholder="Ex: Appartement Moderne"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-slate-700 font-medium mb-2">Type</label>
          <select
            name="type"
            id="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white"
          >
            <option value="">-- Sélectionner le type --</option>
            {['Appartement','Villa','Maison','Studio','Duplex','Terrain','Bureau','Local Commercial','Chambre'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Ville */}
        <div>
          <label htmlFor="ville_id" className="block text-slate-700 font-medium mb-2">Ville</label>
          <select
            name="ville_id"
            id="ville_id"
            value={form.ville_id}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white"
          >
            <option value="">-- Sélectionner la ville --</option>
            {villes.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Quartier */}
        <div>
          <label htmlFor="quartier_id" className="block text-slate-700 font-medium mb-2">Quartier</label>
          <select
            name="quartier_id"
            id="quartier_id"
            value={form.quartier_id}
            onChange={handleChange}
            required
            disabled={!form.ville_id || quartiers.length === 0}
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">-- Sélectionner le quartier --</option>
            {quartiers.map(q => (
              <option key={q.id} value={q.id}>{q.name}</option>
            ))}
          </select>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-slate-700 font-medium mb-2">Photos</label>
          <div className="flex flex-wrap gap-4">
            {form.images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center">
                <img src={URL.createObjectURL(img)} alt="property" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-blue-400 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all">
              <span className="text-blue-500 text-3xl font-bold">+</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-slate-700 font-medium mb-2">Description</label>
          <textarea
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white placeholder-slate-400 resize-none"
            placeholder="Décrivez votre propriété..."
            rows={4}
          />
        </div>

        {/* Intention */}
        <div>
          <label className="block text-slate-700 font-medium mb-2">Intention</label>
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="intention"
                value="vente"
                checked={form.intention === 'vente'}
                onChange={handleintentionChange}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="ml-2 text-slate-700 font-medium">Vente</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="intention"
                value="loyer"
                checked={form.intention === 'loyer'}
                onChange={handleintentionChange}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="ml-2 text-slate-700 font-medium">Loyer</span>
            </label>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center space-x-3">
            {form.intention === 'loyer' && (
              <>
                <input
                  type="number"
                  name="rent_price"
                  value={form.rent_price}
                  onChange={handleChange}
                  required
                  min={0}
                  className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white w-40"
                  placeholder="Prix du loyer"
                />
                <span className="text-lg font-semibold text-blue-600">DH / MOIS</span>
              </>
            )}
            {form.intention === 'vente' && (
              <>
                <input
                  type="number"
                  name="sale_price"
                  value={form.sale_price}
                  onChange={handleChange}
                  required
                  min={0}
                  className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white w-40"
                  placeholder="Prix de vente"
                />
                <span className="text-lg font-semibold text-blue-600">DH (une fois)</span>
              </>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Ajouter la propriété
        </button>
      </form>
    </div>
  );
}
