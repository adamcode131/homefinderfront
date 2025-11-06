import React, { useEffect, useState } from 'react';
import axios from 'axios' ; 
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [section, setSection] = useState('dashboard');
  const [pendingProperties, setPendingProperties] = useState([]);
  const [properties, setProperties] = useState([]); 
  const [filter,setFilter] = useState('') ; 
  const [filteredProperties, setFilteredProperties] = useState([]) ;  
  const [users,setUsers] = useState([]) ; 
  const [added_points , setAddedPoints] = useState(0);
  const [deducted_points , setDeductedPoints] = useState(0);
  const [user , setUser] = useState({})
  const navigate  = useNavigate();
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
// Function to save user changes
// Function to save user changes
const handleSaveUser = async () => {
  try {
    // Calculate balance change for notification
    const oldBalance = selectedUser.balance || 0;
    const newBalance = Number(editUserData.balance) || 0;
    const balanceChange = newBalance - oldBalance;

    console.log('Balance change calculation:', { oldBalance, newBalance, balanceChange });

    // Update user first
    const response = await axios.put(
      `http://localhost:8000/api/user/${selectedUser.id}`,
      editUserData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log('User updated successfully');

    // Only create notification if there was a balance change
    if (balanceChange !== 0) {
      try {
        // Send 0 instead of null to match backend validation
        const notificationData = {
          added_points: balanceChange > 0 ? balanceChange : 0, // Changed from null to 0
          deducted_points: balanceChange < 0 ? Math.abs(balanceChange) : 0 // Changed from null to 0
        };

        console.log('Creating notification with data:', notificationData);

        const notificationResponse = await axios.post(
          `http://localhost:8000/api/addNotification/${selectedUser.id}`,
          notificationData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json'
            },
          }
        );

        console.log('Notification created successfully:', notificationResponse.data);
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
        console.error('Error response data:', notificationError.response?.data);
        // Don't alert here - the user update was successful, just the notification failed
      }
    }

    // Update the users list
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === selectedUser.id ? { ...user, ...editUserData } : user
      )
    );

    setShowProfileModal(false);
    // Reset points tracking
    setAddedPoints(0);
    setDeductedPoints(0);

    alert('User updated successfully!');

  } catch (error) {
    console.error('Failed to update user:', error);
    alert('Failed to update user. Please try again.');
  }
};

const handleCloseModal = () => {
  setShowProfileModal(false);
  setSelectedUser(null);
  setAddedPoints(0);
  setDeductedPoints(0);
};


const handleBalanceChange = (amount) => {
  const currentBalance = Number(editUserData.balance) || 0;
  const newBalance = Math.max(0, Math.round(currentBalance + amount));
  
  // Update the edit data
  setEditUserData(prev => ({
    ...prev,
    balance: newBalance
  }));

  const diff = newBalance - currentBalance;
  
  // Track points for notification
  if (diff > 0) {
    setAddedPoints(prev => prev + diff);
    setDeductedPoints(0);
  } else if (diff < 0) {
    setDeductedPoints(prev => prev + Math.abs(diff));
    setAddedPoints(0);
  }
};



  useEffect(()=>{
    axios.get('http://localhost:8000/api/user',{headers : {Authorization : `Bearer ${localStorage.getItem('token')}`}})
    .then((res) => {
      setUser(res.data.user)  
      console.log(res.data.user)
    })
  },[])


  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-soft border-r border-gray-200 fixed left-0 top-0 h-full z-40">
        <div className="p-6 border-b border-gray-200">
          <div className="text-xl font-bold text-primary flex items-center">
            <i className="fa-solid fa-home mr-2"></i>
            <img src="./logo.svg" alt="" className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
          </div>
          <p className="text-sm text-gray-600 mt-1">Admin Dashboard</p>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            <button
              onClick={() => setSection('dashboard')}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                section === 'dashboard'
                  ? 'text-primary bg-blue-50 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fa-solid fa-chart-line mr-3 w-5"></i>
              Dashboard
            </button>
            <button
              onClick={() => setSection('users')}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                section === 'users'
                  ? 'text-primary bg-blue-50 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fa-solid fa-users mr-3 w-5"></i>
              Users
            </button>
            <button
              onClick={() => setSection('not_validated_properties')}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                section === 'not_validated_properties'
                  ? 'text-primary bg-blue-50 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fa-solid fa-clock mr-3 w-5"></i>
              Pending Properties
            </button>
            <button
              onClick={() => setSection('all_properties')}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer w-full text-left ${
                section === 'all_properties'
                  ? 'text-primary bg-blue-50 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fa-solid fa-building mr-3 w-5"></i>
              All Properties
            </button>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <img onClick={()=>{navigate('/admin-profile')}}  src={`http://localhost:8000/storage/${user.image}`} alt="Admin" className="w-10 h-10 rounded-full object-cover hover:cursor-pointer" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-600">{user.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Fixed to account for sidebar */}
      <main className="flex-1 ml-64 p-8">
        {/* Pending Properties */}
        {section === 'not_validated_properties' && (
          <div className="w-full">
            <header className="bg-white border-b border-gray-200">
              <div className="px-8 py-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pending Properties</h1>
                    <p className="text-gray-600 mt-1">Review and validate property submissions</p>
                  </div>
                </div>
                
                <div className="flex space-x-6 mb-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center space-x-3">
                    <i className="fa-solid fa-clock text-orange-600"></i>
                    <div>
                      <div className="text-sm text-orange-600 font-medium">Pending</div>
                      <div className="text-xl font-bold text-orange-700">{pendingProperties.length}</div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center space-x-3">
                    <i className="fa-solid fa-check text-green-600"></i>
                    <div>
                      <div className="text-sm text-green-600 font-medium">Approved</div>
                      <div className="text-xl font-bold text-green-700">142</div>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center space-x-3">
                    <i className="fa-solid fa-times text-red-600"></i>
                    <div>
                      <div className="text-sm text-red-600 font-medium">Rejected</div>
                      <div className="text-xl font-bold text-red-700">23</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                      <input 
                        type="text" 
                        placeholder="Search by property name or owner..." 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                    <select className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                      <option>All Cities</option>
                      <option>Casablanca</option>
                      <option>Rabat</option>
                      <option>Marrakech</option>
                    </select>
                    <select className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                      <option>All Types</option>
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>Studio</option>
                    </select>
                    <select className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                      <option>Sort: Newest</option>
                      <option>Sort: Oldest</option>
                      <option>Sort: Price</option>
                      <option>Sort: Owner</option>
                    </select>
                    <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium">
                      <i className="fa-solid fa-rotate-right mr-2"></i>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <div className="p-8">
              <div className="space-y-8">
                {pendingProperties.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-3xl flex items-center justify-center">
                      <i className="fa-solid fa-house-circle-exclamation text-3xl text-gray-400"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties Found</h3>
                    <p className="text-gray-500">All properties have been validated or no submissions are pending.</p>
                  </div>
                ) : (
                  pendingProperties.map((property, index) => (
                    <div 
                      key={property.id} 
                      className="bg-white rounded-3xl shadow-soft border border-gray-200 overflow-hidden hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                {property.type}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(property.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                            <p className="text-gray-600 mb-4">
                              {property.ville_id} • {property.rooms} chambres • {property.surface} m² • {property.sale_price || property.rent_price} DH{property.rent_price && '/mois'}
                            </p>
                          </div>
                          <div className="w-32 h-24 rounded-2xl overflow-hidden ml-6">
                            {property.images && property.images.length > 0 ? (
                              <img 
                                className="w-full h-full object-cover" 
                                src={`http://localhost:8000/storage/${property.images[0].url}`} 
                                alt="Property" 
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <i className="fa-solid fa-image text-gray-400"></i>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {property.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {property.user?.name || 'Unknown User'}
                              </div>
                              <div className="text-xs text-gray-600">
                                {property.user?.email || 'No email'}
                              </div>
                            </div>
                            <button className="text-primary hover:text-primary/80 text-sm font-medium">
                              <i className="fa-solid fa-user mr-1"></i>
                              View Profile
                            </button>
                          </div>
                          
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => validateProperty(property.id)}
                              className="px-6 py-3 bg-accent text-white rounded-2xl hover:bg-accent/90 hover:shadow-card transition-all duration-300 font-medium"
                            >
                              <i className="fa-solid fa-check mr-2"></i>
                              Validate
                            </button>
                            <button 
                              onClick={() => {/* Add reject functionality */}}
                              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 hover:shadow-card transition-all duration-300 font-medium"
                            >
                              <i className="fa-solid fa-times mr-2"></i>
                              Reject
                            </button>
                            <button className="px-4 py-3 text-primary border border-primary/20 rounded-2xl hover:bg-primary/5 transition-colors">
                              <i className="fa-solid fa-eye"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* All Properties */}
        {section === 'all_properties' && (
          <div className="w-full max-w-6xl mx-auto">
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
                            {property.ville.name}
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

        {/* Users Section */}
        {section === "users" && (
          <div className="w-full">
            {/* Header Section */}
            <header className="bg-white border-b border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                  <p className="text-gray-600 mt-1">Manage platform users and their roles</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <i className="fa-solid fa-user-plus mr-2"></i>
                    Add User
                  </button>
                  <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
                    <i className="fa-solid fa-download mr-2"></i>
                    Export
                  </button>
                </div>
              </div>

              {/* Search and Filters Bar */}
              <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input type="text" placeholder="Search by name or email..." className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white" />
                  </div>
                </div>
                
                <select className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white min-w-[120px]">
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                  <option value="user">User</option>
                </select>
                
                <select className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white min-w-[120px]">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="disabled">Disabled</option>
                </select>
                
                <select className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white min-w-[140px]">
                  <option value="date">Sort by Join Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="balance">Sort by Balance</option>
                </select>
              </div>
            </header>

            {/* Analytics Summary Strip */}
            <div className="px-8 py-4">
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-users text-primary"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-accent mt-1">{users.filter(u => u.isActive).length}</p>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-user-check text-accent"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Users</p>
                      <p className="text-2xl font-bold text-orange-500 mt-1">0</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-user-clock text-orange-500"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Admins</p>
                      <p className="text-2xl font-bold text-red-500 mt-1">{users.filter(u => u.role === 'admin').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <i className="fa-solid fa-user-shield text-red-500"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

                  {/* Users Grid */}
                    <div className="px-8 pb-8">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {users.map((user, index) => {
                            const roleColors = {
                              admin: {
                                badge: 'bg-red-100 text-red-700',
                                avatar: 'bg-red-500',
                                button: 'bg-primary'
                              },
                              owner: {
                                badge: 'bg-green-100 text-green-700',
                                avatar: 'bg-accent',
                                button: 'bg-accent'
                              },
                              user: {
                                badge: 'bg-blue-100 text-blue-700',
                                avatar: 'bg-primary',
                                button: 'bg-primary'
                              }
                            };

                            const colors = roleColors[user.role] || roleColors.user;

                            return (
                              <div key={user.id} className="bg-white rounded-3xl shadow-soft border border-gray-100 p-6 hover:shadow-card-hover transition-all duration-300 relative">
                                <div className="absolute top-4 right-4">
                                  <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                  </button>
                                </div>
                                
                                <div className="flex items-center justify-between mb-4">
                                  <div className={`w-14 h-14 ${colors.avatar} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-soft`}>
                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </div>
                                  <span className={`px-3 py-1.5 ${colors.badge} rounded-full text-sm font-medium`}>
                                    {user.role}
                                  </span>
                                </div>
                                
                                <div className="mb-5">
                                  <h3 className="text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
                                  <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                                  <p className="text-gray-500 text-xs">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                                  <div className="bg-gray-50 rounded-xl p-3">
                                    <div className="text-base font-bold text-gray-900">12</div>
                                    <div className="text-xs text-gray-600">Projects</div>
                                  </div>
                                  <div className="bg-gray-50 rounded-xl p-3">
                                    <div className="text-base font-bold text-gray-900">47</div>
                                    <div className="text-xs text-gray-600">Tasks</div>
                                  </div>
                                  <div className="bg-gray-50 rounded-xl p-3">
                                    <div className="text-base font-bold text-gray-900">{user.balance || 0}</div>
                                    <div className="text-xs text-gray-600">Balance</div>
                                  </div>
                                </div>
                                
                                <button 
                                  onClick={() => handleViewProfile(user)} 
                                  className={`w-full py-3 ${colors.button} text-white rounded-2xl hover:${colors.button}/90 hover:shadow-card-hover transition-all duration-300 font-medium`}
                                >
                                  View Profile
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* VIEW PROFILE MODAL */} 
                    {showProfileModal && selectedUser && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-soft max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                          <div className="p-8">
                            <div className="text-center mb-8">
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fa-solid fa-user-edit text-primary text-2xl"></i>
                              </div>
                              <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit User Profile</h2>
                              <p className="text-gray-600">Update user information and settings</p>
                            </div>

                            <div className="space-y-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={editUserData.name ?? ""}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                                  placeholder="Enter full name"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={editUserData.email ?? ""}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                                  placeholder="Enter email address"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                  type="tel"
                                  name="phone"
                                  value={editUserData.phone ?? ""}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                                  placeholder="Enter phone number"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <select
                                  name="role"
                                  value={editUserData.role ?? ""}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
                                >
                                  <option value="user">User</option>
                                  <option value="owner">Owner</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </div>

{/* Balance Section */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Balance (Points)</label>
  
  {/* Balance Display and Quick Actions */}
  <div className="flex items-center gap-3 mb-3">
    <div className="flex-1 relative">
      <input
        type="number"
        name="balance"
        value={editUserData.balance ?? 0}
        onChange={handleInputChange}
        className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50/50"
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
        <i className="fa-solid fa-coins"></i>
      </div>
    </div>
    
    {/* Quick Action Buttons */}
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => handleBalanceChange(100)}
        className="px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
      >
        +100
      </button>
      <button
        type="button"
        onClick={() => handleBalanceChange(-100)}
        className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
      >
        -100
      </button>
    </div>
  </div>

  {/* Points Summary */}
  {(added_points > 0 || deducted_points > 0) && (
    <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm">
      {added_points > 0 && (
        <p className="text-green-600">Points to be added: +{added_points}</p>
      )}
      {deducted_points > 0 && (
        <p className="text-red-600">Points to be deducted: -{deducted_points}</p>
      )}
    </div>
  )}
</div>

                              <div className="flex space-x-3 pt-6">
                                <button
                                  onClick={handleCloseModal}
                                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors font-medium"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleSaveUser}
                                  className="flex-1 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-colors font-medium shadow-soft"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

        {/* Dashboard Section */}
        {section === "dashboard" && (
          <div className="w-full">
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
      </main>
    </div>
  );
}