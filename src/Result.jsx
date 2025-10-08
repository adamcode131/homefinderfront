import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Result = () => {
  const location = useLocation();
  const { propertyIds } = location.state || { propertyIds: [] };
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [query,setQuery] = useState() ; 
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date_reservation: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); // Number of items to display per page
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!propertyIds || propertyIds.length === 0) {
          setError("No properties found.");
          setLoading(false);
          return;
        }

        const response = await axios.post("http://localhost:8000/api/result", {
          propertyIds,
        });

        const fetchedProperties = response.data.properties;
        // Filter only validated properties
        const validatedProperties = fetchedProperties.filter(property => property.is_validated === 1);
        setProperties(validatedProperties);

        // Initialize current image indexes for each property
        const indexes = {};
        validatedProperties.forEach(property => {
          indexes[property.id] = 0;
        });
        setCurrentImageIndexes(indexes);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [propertyIds]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = properties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddToCart = (property) => {
    setCartItems((prev) => [...prev, property]);
    setAddedItem(property);
    setShowCart(true);
    setTimeout(() => setAddedItem(null), 1000);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReservation = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Veuillez ajouter au moins une propriété au panier.");
      return;
    }
    try {
      const reservationData = {
        ...formData,
        properties: cartItems.map((item) => item.id),
      };
      const response = await axios.post(
        "http://localhost:8000/api/leads",
        reservationData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      console.log("Réservation envoyée:", response.data);
      alert("Votre réservation a été envoyée !");

      setCartItems([]);
      setFormData({ name: "", email: "", phone: "", date_reservation: "" });
      setShowCart(false);
    } catch (error) {
      console.error("Erreur lors de la réservation:", error.response || error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  // Carousel functions
  const nextImage = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property || !property.images || property.images.length === 0) return;
    
    setCurrentImageIndexes(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] + 1) % property.images.length
    }));
  };

  const prevImage = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property || !property.images || property.images.length === 0) return;
    
    setCurrentImageIndexes(prev => ({
      ...prev,
      [propertyId]: (prev[propertyId] - 1 + property.images.length) % property.images.length
    }));
  };

  const goToImage = (propertyId, index) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property || !property.images || index >= property.images.length) return;
    
    setCurrentImageIndexes(prev => ({
      ...prev,
      [propertyId]: index
    }));
  };

  const cartVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 300, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  const imageVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Header Skeleton */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 max-w-2xl mx-8">
              <div className="w-full h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-16 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Skeleton */}
      <main className="pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Results Panel Skeleton */}
            <section className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100"
                  >
                    {/* Image Skeleton */}
                    <div className="h-48 bg-gray-200 animate-pulse relative overflow-hidden">
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {[...Array(3)].map((_, dotIndex) => (
                          <div
                            key={dotIndex}
                            className="w-2 h-2 bg-gray-300 rounded-full"
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="p-5">
                      <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cart Skeleton */}
            <div className="w-80 bg-white border rounded-xl shadow-lg p-5 sticky top-24 h-fit">
              <div className="flex justify-between items-center mb-4">
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="space-y-3 mb-4">
                {[...Array(2)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Form Skeleton */}
              <div className="space-y-3 mt-6 pt-4 border-t border-gray-200">
                <div className="w-40 h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                {[...Array(4)].map((_, index) => (
                  <div key={index}>
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                ))}
                <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-medium">
        {error}
      </div>
    );
  } 

  // search function 

    const handleSearch = (e) => {
    
    if (!query.trim()) return;
    
    // Show loading immediately
    setIsSearching(true);
    navigate('/loading', { 
      state: { 
        searchQuery: query,
        timestamp: Date.now() // Prevent caching
      } 
    });

    // Then make the API call
    fetch('https://n8n.manypilots.com/webhook/search', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        chatInput: query,
        token: localStorage.getItem('token')
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Received:", data);
        const ids = data.ids || [];
        // Navigate to results with the data
        navigate('/result', { 
          state: { 
            propertyIds: ids,
            searchQuery: query 
          } 
        });
      })
      .catch(err => {
        console.error("Fetch error:", err);
        // If error, redirect back to home or show error
        navigate('/', { state: { error: "Search failed. Please try again." } });
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
          }`}
        >
          <i className="fa-solid fa-chevron-left mr-2"></i>
          Précédent
        </motion.button>

        <div className="flex space-x-1">
          {pageNumbers.map(number => (
            <motion.button
              key={number}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(number)}
              className={`px-3 py-2 rounded-lg border ${
                currentPage === number
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              {number}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
          }`}
        >
          Suivant
          <i className="fa-solid fa-chevron-right ml-2"></i>
        </motion.button>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold text-blue-600 flex items-center"
              >
                <i className="fa-solid fa-home mr-2"></i>
                <a href="/">Home Finder</a>
              </motion.div>
            </div>
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                onChange={(e)=>setQuery(e.target.value)}
                placeholder="Ex: 2 chambres, 1 salon, quartier Gauthier"
                className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // prevent form submit reload if inside a form
                    handleSearch(); // call your function here
                  }
                }}
              />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <i className="fa-solid fa-search text-blue-600"></i>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(!showCart)}
                className="relative px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                <i className="fa-solid fa-cart-shopping text-xl"></i>
                {cartItems.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartItems.length}
                  </motion.span>
                )}
              </motion.button>

              <motion.select
                whileHover={{ scale: 1.05 }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              >
                <option>FR</option>
                <option>EN</option>
                <option>AR</option>
              </motion.select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Sign Up
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Item Added Notification */}
      <AnimatePresence>
        {addedItem && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center">
              <i className="fa-solid fa-check-circle mr-2"></i>
              {addedItem.title} ajouté au panier!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Results Panel */}
            <section className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600 font-medium">
                  <span className="text-blue-600 font-semibold">
                    {properties.length}
                  </span>{" "}
                  propriétés trouvées
                  <span className="text-gray-500 text-sm ml-2">
                    (Page {currentPage} sur {totalPages})
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, properties.length)} sur {properties.length} propriétés
                </p>
              </div>

              {properties.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">
                  No properties found.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentProperties.map((property) => {
                      const currentIndex = currentImageIndexes[property.id] || 0;
                      const hasImages = property.images && property.images.length > 0;
                      const totalImages = hasImages ? property.images.length : 0;
                      return (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ y: -5 }}
                          onClick={() => navigate(`/details/${property.slug}`)}
                          className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 border border-gray-100 group cursor-pointer"
                        >
                          {/* Image Carousel */}
                          <div className="h-48 relative overflow-hidden">
                            {hasImages ? (
                              <>
                                <AnimatePresence mode="wait">
                                  <motion.img
                                    key={currentIndex}
                                    variants={imageVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full object-cover"
                                    src={`http://localhost:8000/storage/${property.images[currentIndex].path || property.images[currentIndex].url}`}
                                    alt={property.title}
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                    }}
                                  />
                                </AnimatePresence>

                                {/* Navigation Arrows */}
                                {totalImages > 1 && (
                                  <>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage(property.id);
                                      }}
                                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-all z-10"
                                    >
                                      <i className="fa-solid fa-chevron-left text-sm"></i>
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage(property.id);
                                      }}
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-all z-10"
                                    >
                                      <i className="fa-solid fa-chevron-right text-sm"></i>
                                    </motion.button>
                                  </>
                                )}

                                {/* Image Indicators */}
                                {totalImages > 1 && (
                                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                                    {property.images.map((_, index) => (
                                      <button
                                        key={index}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          goToImage(property.id, index);
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                          index === currentIndex 
                                            ? 'bg-white' 
                                            : 'bg-white/50'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                )}

                                {/* Image Counter */}
                                {totalImages > 1 && (
                                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10">
                                    {currentIndex + 1}/{totalImages}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <i className="fa-solid fa-image text-4xl text-gray-400"></i>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          <div className="p-5">
                            <h3 className="text-gray-900 font-semibold mb-2 text-lg">
                              {property.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 flex items-center">
                              <i className="fa-solid fa-bed mr-2 text-blue-600"></i>
                              {property.description}
                            </p>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xl font-bold text-gray-900">
                                {property.sale_price ? `${property.sale_price} DH` :  `${property.rent_price} DH`}
                                <span className="text-sm font-normal text-gray-500">
                                  {property.sale_price === 0 ? "/mois" : "vente"}
                                </span>
                              </span>
                              <span className="text-sm text-gray-500 flex items-center">
                                <i className="fa-solid fa-location-dot mr-1 text-blue-600"></i>
                                {property.ville?.nom || property.ville?.name || 'N/A'} - {property.quartier?.nom || property.quartier?.name || 'N/A'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">
                              Type: {property.type} | Intention: {property.intention}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(property);
                              }}
                              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            >
                              Réservation Rapide
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && <Pagination />}
                </>
              )}
            </section>

            {/* Cart Section */}
            <AnimatePresence>
              {showCart && (
                <motion.aside
                  variants={cartVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-80 bg-white border rounded-xl shadow-lg p-5 sticky top-24 h-fit"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Votre Panier</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowCart(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="fa-solid fa-times"></i>
                    </motion.button>
                  </div>

                  {cartItems.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-500 text-center py-8"
                    >
                      <i className="fa-solid fa-cart-shopping text-3xl mb-3 text-gray-300 block"></i>
                      Aucun article ajouté.
                    </motion.p>
                  ) : (
                    <>
                      <ul className="space-y-3 mb-4 max-h-96 overflow-y-auto pr-2">
                        <AnimatePresence>
                          {cartItems.map((item, index) => (
                            <motion.li
                              key={index}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              layout
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex-1">
                                <span className="font-medium block">
                                  {item.title}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {item.price ? `${item.price} DH` : "Price not available"}
                                </span>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeFromCart(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </motion.button>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>

                      {/* Reservation Form */}
                      <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleReservation}
                        className="space-y-3 mt-6 pt-4 border-t border-gray-200"
                      >
                        <h3 className="font-semibold text-gray-700">
                          Informations de réservation
                        </h3>

                        {/* If logged in → only date + confirm */}
                        {token ? (
                          <>
                            <input
                              type="date"
                              name="date_reservation"
                              value={formData.date_reservation}
                              onChange={handleFormChange}
                              required
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              name="name"
                              placeholder="Nom complet"
                              value={formData.name}
                              onChange={handleFormChange}
                              required
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                            <input
                              type="email"
                              name="email"
                              placeholder="Email"
                              value={formData.email}
                              onChange={handleFormChange}
                              required
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                            <input
                              type="tel"
                              name="phone"
                              placeholder="Téléphone"
                              value={formData.phone}
                              onChange={handleFormChange}
                              required
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                            <input
                              type="date"
                              name="date_reservation"
                              value={formData.date_reservation}
                              onChange={handleFormChange}
                              required
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            />
                          </>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-sm hover:bg-blue-700 transition-all font-medium"
                        >
                          Confirmer la réservation
                        </motion.button>
                      </motion.form>
                    </>
                  )}
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Result;