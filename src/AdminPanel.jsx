import React, { useEffect, useState } from 'react';
import axios from 'axios' ; 

export default function AdminPanel() {
  const [section, setSection] = useState('dashboard');
  const [pendingProperties, setPendingProperties] = useState([]);
  const [properties, setProperties] = useState([]); 
  const [filter,setFilter] = useState('') ; 
  const [filteredProperties, setFilteredProperties] = useState([]) ;  
  const [users,setUsers] = useState([]) ; 
  const [refunds,setRefunds] = useState([]); 
  // VIEW PROFILE
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    phone : '', 
    role: '' , 
    balance  : 0
  });
  // State for adding options to categories
  const [showAddOptionForm, setShowAddOptionForm] = useState({});
  const [newOption, setNewOption] = useState({
    filter_category_id: null,
    name: "",
    slug: "",
    sort_order: 0,
    is_active: true
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    entity_types: "",
    sort_order: 0,
  });  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryEntityTypes, setNewCategoryEntityTypes] = useState(["property"]);
  const [categories, setCategories] = useState([]);

  
  
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

  // fetch refunds 

  useEffect(() => {
    if(section === 'refunds_demands') {
      fetch('http://localhost:8000/api/all-refunds')
        .then(res => res.json())
        .then(data => {
          console.log('Refunds:', data.refunds);
          setRefunds(data.refunds || []);
        })
        .catch(err => console.error(err));
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

// fetch users
useEffect(() => {
  fetch('http://localhost:8000/api/users')
    .then((resp) => resp.json())
    .then((data) => setUsers(data.users || []))
    .catch((err) => console.error(err));
}, []);

// --- Fetch Categories from DB ---
useEffect(() => {
  if (section === "dashboard") {
    fetchCategories();
  }
}, [section]);

// Function to fetch categories
const fetchCategories = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/admin/filter-categories", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    // Ensure it's always an array
    setCategories(Array.isArray(response.data.categories) ? response.data.categories : []);
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    setCategories([]);
  }
};

// ADD NEW CATEGORY 
const handleAddCategory = async () => {
  if (!newCategory.name.trim()) return;

  try {
    // Prepare payload
    const payload = {
      name: newCategory.name,
      slug: newCategory.slug || undefined,
      entity_types: newCategory.entity_types
        ? newCategory.entity_types.split(",").map((type) => type.trim())
        : ["property"],
      sort_order: newCategory.sort_order || 0,
      is_active: newCategory.is_active ?? true,
    };

    // Send POST request to backend
    const response = await axios.post(
      "http://localhost:8000/api/admin/filter-categories",
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // Refresh categories from database instead of just adding to UI
    await fetchCategories();
    
    // Reset form
    setNewCategory({ name: "", slug: "", entity_types: "", sort_order: 0, is_active: true });
    setShowAddForm(false);

  } catch (error) {
    console.error("Failed to add category:", error.response?.data?.message || error.message);
    alert("Failed to add category. Please try again.");
  }
}; 

// DELETE CATEGORY
const handleDeleteCategory = async (categoryId) => {
  if (!window.confirm("Are you sure you want to delete this category?")) return;
  
  try {
    await axios.delete(`http://localhost:8000/api/admin/filter-categories/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    
    // Refresh categories from database
    await fetchCategories();
  } catch (error) {
    console.error("Failed to delete category:", error.response?.data?.message || error.message);
    alert("Failed to delete category. Please try again.");
  }
}; 

// Function to add a new option to a category
const handleAddOption = async (categoryId) => {
  if (!newOption.name.trim()) {
    alert("Option name is required");
    return;
  }

  try {
    const payload = {
      filter_category_id: categoryId,
      name: newOption.name,
      slug: newOption.slug || undefined,
      sort_order: newOption.sort_order || 0,
      is_active: newOption.is_active ?? true,
    };

    const response = await fetch(
      "http://localhost:8000/api/admin/filter-options",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to add option');
    }

    // Reset form and refresh categories
    setNewOption({ 
      filter_category_id: null, 
      name: "", 
      slug: "", 
      sort_order: 0, 
      is_active: true 
    });
    setShowAddOptionForm({ ...showAddOptionForm, [categoryId]: false });
    await fetchCategories();
    
  } catch (error) {
    console.error("Failed to add option:", error.message);
    alert("Failed to add option. Please try again.");
  }
};

// Function to delete an option
const handleDeleteOption = async (optionId) => {
  if (!window.confirm("Are you sure you want to delete this option?")) return;

  try {
    const response = await fetch(
      `http://localhost:8000/api/admin/filter-options/${optionId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete option');
    }

    await fetchCategories();
    
  } catch (error) {
    console.error("Failed to delete option:", error.message);
    alert(error.message || "Failed to delete option. Please try again.");
  }
}; 

const handleAcceptRefund = (refundId)=>{
  fetch(`http://localhost:8000/api/accept-refund/${refundId}`,{method:'POST'  , Authorization: `Bearer ${localStorage.getItem("token")}`})
  .then(res => res.json())
  .then(data => console.log(data.message))
  .catch(err => console.error(err));
} 
  // view profile functions 
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setEditUserData({
      name: user.name,
      email: user.email,
      phone : user.phone,
      role: user.role,
      balance : user.balance 
    });
    setShowProfileModal(true);
  }; 

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Function to save user changes
  const handleSaveUser = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/user/${selectedUser.id}`,
        editUserData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the users list
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id ? { ...user, ...editUserData } : user
        )
      );

      setShowProfileModal(false);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowProfileModal(false);
    setSelectedUser(null);
  };


const handleBalanceChange = (amount) => {
  // Ensure we're working with numbers
  const currentBalance = Number(editUserData.balance) || 0;
  const newBalance = Math.max(0, Math.round(currentBalance + amount)); // Prevent negative balance
  
  // Update both states to keep them in sync
  setSelectedUser(prev => ({
    ...prev,
    balance: newBalance
  }));
  
  setEditUserData(prev => ({
    ...prev,
    balance: newBalance
  }));
};




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
          <button
            onClick={() => setSection('refunds_demands')}
            className={`text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              section === 'refunds_demands'
                ? 'bg-blue-100 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Refunds Demands
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
  <div className="w-full max-w-6xl mx-auto px-4 py-8">
    {/* Header Section */}
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-4">
        All Properties
      </h1>
      <p className="text-slate-600 text-lg max-w-2xl mx-auto">
        Discover your perfect property from our curated collection
      </p>
    </div>

    {/* Enhanced Search Bar */}
    <div className="relative w-full max-w-2xl mx-auto mb-12">
      <div className="relative group">
        <input
          type="text"
          placeholder="Search by title, type, or city..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-blue-100 
                    shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200 
                    focus:border-blue-400 placeholder-slate-400 bg-white 
                    transition-all duration-300 hover:border-blue-200
                    hover:shadow-xl text-slate-700 font-medium"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 
                       group-hover:text-green-500 transition-colors duration-300">
          <i className="fa-solid fa-magnifying-glass text-lg"></i>
        </span>
        
        {/* Animated search indicator */}
        {filter && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>

    {/* Results Section */}
    {filteredProperties.length === 0 ? (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 
                      flex items-center justify-center">
          <i className="fa-solid fa-house-circle-exclamation text-3xl text-blue-400"></i>
        </div>
        <h3 className="text-2xl font-semibold text-slate-700 mb-3">
          No properties found
        </h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Try adjusting your search terms or browse all available properties
        </p>
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="group bg-white rounded-2xl border-2 border-blue-50 
                     shadow-lg hover:shadow-2xl transition-all duration-500 
                     hover:border-blue-100 overflow-hidden hover:-translate-y-2"
          >
            {/* Property Images */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
              {property.images && property.images.length > 0 ? (
                <>
                  <img
                    src={`http://localhost:8000/storage/${property.images[0].url}`}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 
                             transition-transform duration-700"
                  />
                  {/* Image count badge */}
                  {property.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm 
                                  px-2 py-1 rounded-full text-xs font-semibold 
                                  text-blue-700 shadow-sm">
                      +{property.images.length - 1}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fa-solid fa-image text-4xl text-blue-200"></i>
                </div>
              )}
              
              {/* Status Badge */}
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full 
                             text-xs font-semibold backdrop-blur-sm
                             ${property.is_validated 
                               ? 'bg-green-500/90 text-white' 
                               : 'bg-orange-500/90 text-white'}`}>
                {property.is_validated ? '✓ Validated' : 'Pending'}
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800 mb-2 
                             group-hover:text-blue-600 transition-colors 
                             duration-300 line-clamp-2">
                  {property.title}
                </h2>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-tag text-blue-400"></i>
                    {property.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-location-dot text-green-400"></i>
                    {property.ville_id}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 
                            rounded-xl border border-blue-100">
                <p className="text-lg font-bold text-blue-700">
                  {property.sale_price ? property.sale_price : property.rent_price} DH
                </p>
                <p className="text-sm text-slate-600">
                  {property.sale_price ? 'One-time payment' : 'Per month'}
                </p>
              </div>

              {/* Additional Images Preview */}
              {property.images && property.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {property.images.slice(1, 4).map((img) => (
                    <img
                      key={img.id}
                      src={`http://localhost:8000/storage/${img.url}`}
                      alt={property.title}
                      className="w-12 h-12 object-cover rounded-lg border-2 
                               border-white shadow-sm hover:border-blue-300 
                               transition-all duration-300"
                    />
                  ))}
                  {property.images.length > 4 && (
                    <div className="w-12 h-12 bg-blue-100 rounded-lg border-2 
                                  border-white flex items-center justify-center 
                                  text-xs font-semibold text-blue-600">
                      +{property.images.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
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
  {users.map((user, index) => {
    const roleColors = {
      admin: {
        card: 'from-red-50 to-white border-red-100',
        badge: 'bg-red-500 text-white',
        accent: 'bg-red-500',
        text: 'text-red-600',
        icon: 'text-red-500',
        gradient: 'from-red-500 to-red-600',
        hover: 'hover:shadow-red-200'
      },
      owner: {
        card: 'from-green-50 to-white border-green-100',
        badge: 'bg-green-500 text-white',
        accent: 'bg-green-500',
        text: 'text-green-600',
        icon: 'text-green-500',
        gradient: 'from-green-500 to-green-600',
        hover: 'hover:shadow-green-200'
      },
      user: {
        card: 'from-blue-50 to-white border-blue-100',
        badge: 'bg-blue-500 text-white',
        accent: 'bg-blue-500',
        text: 'text-blue-600',
        icon: 'text-blue-500',
        gradient: 'from-blue-500 to-blue-600',
        hover: 'hover:shadow-blue-200'
      }
    };

    const colors = roleColors[user.role] || roleColors.user;

    return (
      <div
        key={user.id}
        className={`group relative bg-gradient-to-br ${colors.card} rounded-3xl border shadow-lg ${colors.hover} hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden`}
        style={{
          animation: `cardSlideIn 0.6s ease-out ${index * 0.1}s both`
        }}
      >
        {/* Background Gradient Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.card.replace('50', '100').replace('to-white', 'to-white/80')} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        <div className="relative p-6">
          {/* User Avatar & Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl font-bold text-white">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()} 
                </span>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                user.isActive ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>
            
            {/* Role Badge - Integrated with existing design */}
            {user.role && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full ${colors.badge} text-xs font-bold uppercase tracking-wide shadow-sm`}>
                {user.role}
              </span>
            )}
          </div>

          {/* User Info - Cleaner integration */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300 mb-2">
              {user.name}
            </h2>
            
            <p className="text-gray-600 text-sm flex items-center mb-3">
              <svg className={`w-4 h-4 mr-2 ${colors.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {user.email}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center">
                <svg className={`w-3 h-3 mr-1 ${colors.icon}`} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between py-3 px-4 bg-white/50 rounded-xl border border-white mb-4">
            <div className="text-center">
              <div className="font-bold text-gray-900">12</div>
              <div className="text-xs text-gray-500">Projects</div>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="text-center">
              <div className="font-bold text-gray-900">47</div>
              <div className="text-xs text-gray-500">Tasks</div>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="text-center">
              <div className="font-bold text-gray-900">89%</div>
              <div className="text-xs text-gray-500">Done</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-gray-100">
            <button onClick={() => handleViewProfile(user)} className={`flex-1 bg-gradient-to-r ${colors.gradient} hover:shadow-lg text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md`}>
              View Profile
            </button>
            <button className={`p-2.5 ${colors.text}/10 hover:${colors.text}/20 ${colors.text} rounded-xl transition-all duration-300 transform hover:scale-105 border border-current/20`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 border-2 border-transparent group-hover:border-${colors.accent.split('-')[1]}-200 rounded-3xl transition-all duration-500 pointer-events-none`} />
        
        {/* Role-colored Accent Bar */}
        <div className={`absolute top-0 left-0 w-full h-1 ${colors.accent} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />
      </div>
    );
  })}
</div>
            )}

{/* VIEW PROFILE MODAL */} 
{showProfileModal && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
      {/* Modal Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">Edit User Profile</h3>
        <button
          onClick={handleCloseModal}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={editUserData.name ?? ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={editUserData.email ?? ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={editUserData.phone ?? ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            name="role"
            value={editUserData.role ?? ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Balance Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Balance
          </label>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">
                {Number(editUserData.balance || 0).toFixed(2)} points
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBalanceChange(-1)}
                className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center transition-colors duration-200 font-bold"
              >
                -
              </button>
              <button
                onClick={() => handleBalanceChange(1)}
                className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded flex items-center justify-center transition-colors duration-200 font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
        <button
          onClick={handleCloseModal}
          className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveUser}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        )} 

          {section === "dashboard" && (
            <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen w-full">
              {/* Header */}
              <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Filter Dashboard
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Manage your categories and options with ease
                </p>
              </div>

              {/* Add Category Button */}
              {!showAddForm && (
                <div className="flex justify-center mb-8">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300"
                  >
                    + Add Category
                  </button>
                </div>
              )}

              {/* Add Category Form */}
              {showAddForm && (
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mb-8">
              <h3 className="text-2xl font-bold mb-4">Add New Category</h3>
              <div className="space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Category name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full p-3 border rounded-xl border-gray-300"
                  />
                </div>

                {/* Entity Types */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Entity Types</label>
                  <select
                    value={newCategory.entity_types}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, entity_types: e.target.value })
                    }
                    className="w-full p-3 border rounded-xl border-gray-300"
                  >
                    <option value="">Select entity type</option>
                    {newCategoryEntityTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>


                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Sort Order</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newCategory.sort_order}
                    onChange={(e) => setNewCategory({ ...newCategory, sort_order: parseInt(e.target.value) })}
                    className="w-full p-3 border rounded-xl border-gray-300"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleAddCategory}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          )}


              {/* Categories List */}
              {categories && categories.length > 0 ? (
                <div className="space-y-8 max-w-6xl mx-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id ?? Math.random()}
                      className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden transform hover:scale-[1.01]"
                    >
                      {/* Category Header */}
                      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        <h3 className="text-2xl font-bold">{category.name}</h3>
                        <div className="flex gap-3">
                          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-300">
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(category.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Category Meta */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border-t border-gray-100">
                        <div>
                          <span className="text-sm text-gray-500">Slug</span>
                          <p className="text-lg font-semibold">{category.slug || "-"}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Entity Types</span>
                          <p className="text-lg font-semibold">
                            {Array.isArray(category.entity_types) ? category.entity_types.join(", ") : "-"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Sort Order</span>
                          <p className="text-lg font-semibold">{category.sort_order ?? "-"}</p>
                        </div>
                      </div>

                      {/* Options */}
                      
{/* Options */}
<div className="p-6 bg-gray-50 border-t border-gray-100">
  {/* Header with Add Option Button */}
  <div className="flex justify-between items-center mb-4">
    <h4 className="text-xl font-bold">
      Options ({category.active_options?.length || 0})
    </h4>
    <button
      onClick={() => setShowAddOptionForm({ 
        ...showAddOptionForm, 
        [category.id]: !showAddOptionForm[category.id] 
      })}
      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Add Option
    </button>
  </div>

  {/* Add Option Form */}
  {showAddOptionForm[category.id] && (
    <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h5 className="font-semibold mb-3 text-gray-700">New Option</h5>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Option Name *
          </label>
          <input
            type="text"
            placeholder="e.g., Swimming Pool, Garden, etc."
            value={newOption.name}
            onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
            className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Slug (optional)
          </label>
          <input
            type="text"
            placeholder="Auto-generated if empty"
            value={newOption.slug}
            onChange={(e) => setNewOption({ ...newOption, slug: e.target.value })}
            className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Sort Order
          </label>
          <input
            type="number"
            placeholder="0"
            value={newOption.sort_order}
            onChange={(e) => setNewOption({ 
              ...newOption, 
              sort_order: parseInt(e.target.value) || 0 
            })}
            className="w-full p-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => {
              setShowAddOptionForm({ ...showAddOptionForm, [category.id]: false });
              setNewOption({ 
                filter_category_id: null, 
                name: "", 
                slug: "", 
                sort_order: 0, 
                is_active: true 
              });
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => handleAddOption(category.id)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Add Option
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Options List */}
  {category.active_options && category.active_options.length > 0 ? (
    <div className="space-y-3">
      {category.active_options.map((option) => (
        <div
          key={option.id ?? Math.random()}
          className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800">{option.name}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {option.slug}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Sort Order: {option.sort_order}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-300 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteOption(option.id)}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all duration-300 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-200">
      <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p className="text-gray-400 font-medium">No options available</p>
    </div>
  )}
</div>
                    
                    </div>
                  ))}
                </div> 
              ) : (
                <p className="text-center text-gray-500">No categories found.</p>
              )}
            </div>
          )}


          {section === "refunds_demands" && (
            <div className="w-full max-w-6xl mx-auto px-4 py-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Refund Requests
                </h1>
                <p className="text-gray-600">Manage refund requests from users</p>
              </div>

              {refunds.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Refund Requests</h3>
                  <p className="text-gray-500">All refund requests have been processed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {refunds.map((refund) => (
                    <div 
                      key={refund.id} 
                      className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Compact Header */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900 text-base">
                              {refund.lead?.property?.title || 'Property Not Found'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              refund.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              refund.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {refund.status || 'PENDING'}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="text-lg font-bold text-blue-600">1 point</p>
                          </div>
                        </div>
                      </div>

                      {/* Compact Content */}
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {/* Lead Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-700">Lead</span>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2 text-gray-600">
                                <svg className="w-3 h-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                <span className="truncate">{refund.lead?.email || 'No email'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{refund.lead?.phone || 'No phone'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Owner Info */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-700">Owner</span>
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="text-gray-900 font-medium truncate">
                                {refund.lead?.owner?.name || 'No owner'}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <svg className="w-3 h-3 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="truncate">{refund.lead?.owner?.email || 'No email'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <svg className="w-3 h-3 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{refund.lead?.owner?.phone || 'No phone'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Refund Reason Preview */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-700">Reason</span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                              {refund.reason}
                            </p>
                          </div>
                        </div>

                        {/* Compact Action Buttons */}
                        <div className="flex gap-3 pt-3 border-t border-gray-100">
                          <button 
                            onClick={() => handleAcceptRefund(refund.id)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-white transition-all bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-200 text-sm"
                          >
                            <i className="fa-solid fa-check text-xs"></i>
                            Accept
                          </button>

                          <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-white transition-all bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-red-200 text-sm">
                            <i className="fa-solid fa-xmark text-xs"></i>
                            Decline
                          </button>
                        </div>
                      </div>
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
