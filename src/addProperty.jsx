import React, { useState } from 'react';

export default function AddProperty() {
  const [form, setForm] = useState({
    title: '',
    type: '',
    ville: '',
    quartier: '',
    description: '',
    purpose: 'rent',
    rent_price: '',
    sale_price: '',
    images: [],
  });

  // Quartiers par ville
  const quartiers = {
    Casablanca: ['Maarif', 'Anfa', 'Ain Diab', 'Sidi Bernoussi', 'Derb Sultan'],
    Rabat: ['Agdal', 'Hay Riad', 'Yacoub El Mansour', 'Medina'],
    Marrakech: ['Gueliz', 'Hivernage', 'Medina', 'Sidi Youssef Ben Ali'],
    Tanger: ['Malabata', 'Medina', 'Iberia', 'Marchan'],
    Fes: ['Ville Nouvelle', 'Medina', 'Narjiss'],
    Agadir: ['Talborjt', 'Founty', 'Hay Mohammadi'],
    Meknes: ['Hamria', 'Ville Nouvelle', 'Medina'],
    Oujda: ['Lazaret', 'Hay Al Qods', 'Medina'],
    Kenitra: ['Ville Haute', 'Bir Rami', 'Medina'],
    Tetouan: ['Medina', 'Mhannech', 'Martil'],
  };

  // Handle inputs
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'ville' ? { quartier: '' } : {}), // reset quartier si ville change
    }));
  };

  const handlePurposeChange = e => {
    setForm(prev => ({
      ...prev,
      purpose: e.target.value,
      rent_price: '',
      sale_price: '',
    }));
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    e.target.value = '';
  };

  const handleRemoveImage = idx => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const ownerid = localStorage.getItem('ownerid');

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'images') {
        form.images.forEach(img => formData.append('images[]', img));
      } else {
        formData.append(key, form[key]);
      }
    });

    const response = await fetch(`http://localhost:8000/api/storeProperties/${ownerid}`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      alert('Property submitted!');
      console.log(data);
    } else {
      const error = await response.text();
      alert('Error submitting property: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 p-10 space-y-8"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8">
          Add a Property
        </h2>

        {/* Title */}
        <div>
          <label className="block text-slate-700 font-medium mb-2" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white placeholder-slate-400"
            placeholder="Ex: Modern Apartment"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-slate-700 font-medium mb-2" htmlFor="type">
            Type
          </label>
          <select
            name="type"
            id="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white"
          >
            <option value="">-- Select Type --</option>
            {['Appartement','Villa','Maison','Studio','Duplex','Terrain','Bureau','Local Commercial','Chambre'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Ville */}
        <div>
          <label className="block text-slate-700 font-medium mb-2" htmlFor="ville">
            Ville
          </label>
          <select
            name="ville"
            id="ville"
            value={form.ville}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white"
          >
            <option value="">-- Select City --</option>
            {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fes', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan'].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Quartier */}
        <div>
          <label className="block text-slate-700 font-medium mb-2" htmlFor="quartier">
            Quartier
          </label>
          <select
            name="quartier"
            id="quartier"
            value={form.quartier}
            onChange={handleChange}
            required
            disabled={!form.ville}
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="">-- Select Quartier --</option>
            {form.ville && quartiers[form.ville]?.map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        {/* Images Upload */}
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
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
            {/* Add new image square */}
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
          <label className="block text-slate-700 font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white placeholder-slate-400 resize-none"
            placeholder="Describe your property..."
            rows={4}
          />
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-slate-700 font-medium mb-2">Purpose</label>
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="purpose"
                value="sale"
                checked={form.purpose === 'sale'}
                onChange={handlePurposeChange}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="ml-2 text-slate-700 font-medium">Sale</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="purpose"
                value="rent"
                checked={form.purpose === 'rent'}
                onChange={handlePurposeChange}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="ml-2 text-slate-700 font-medium">Rent</span>
            </label>
          </div>

          {/* Price Input */}
          <div className="mt-4 flex items-center space-x-3">
            {form.purpose === 'rent' && (
              <>
                <input
                  type="number"
                  name="rent_price"
                  value={form.rent_price}
                  onChange={handleChange}
                  required
                  min={0}
                  className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white w-40"
                  placeholder="Rent price"
                />
                <span className="text-lg font-semibold text-blue-600">DH / MOIS</span>
              </>
            )}
            {form.purpose === 'sale' && (
              <>
                <input
                  type="number"
                  name="sale_price"
                  value={form.sale_price}
                  onChange={handleChange}
                  required
                  min={0}
                  className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg bg-white w-40"
                  placeholder="Sale price"
                />
                <span className="text-lg font-semibold text-blue-600">DH (one time)</span>
              </>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Add Property
        </button>
      </form>
    </div>
  );
}
