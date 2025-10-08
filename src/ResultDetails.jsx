import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ResultDetails() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const[categories,setCategories] = useState([]);
  const [isSearching,setIsSearching] = useState(false);
  const[query,setQuery] = useState();

  const navigate = useNavigate();

  // Token check
  const token = localStorage.getItem("token");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date_reservation: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `http://localhost:8000/api/details/${slug}`
        );
        setProperty(response.data.property);
        console.log(response.data.property);
      } catch (error) {
        console.error("Failed to fetch property details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

    useEffect(()=>{
    fetch('http://localhost:8000/api/admin/filter-categories', { method: 'GET' })
    .then(res => res.json())
    .then(data => setCategories(data))
  },[]) 


    // search bar function logic

    const handleSearch = (e) => {
    e.preventDefault();
    
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
            searchQuery: query ,
            
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

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
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
      </header>

      {/* Main Content Skeleton */}
      <main className="pt-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Skeleton */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-40 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Gallery Skeleton */}
            <section className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="relative h-96 bg-gray-200 animate-pulse"></div>
                {/* Thumbnails Skeleton */}
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Property Info Skeleton */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse mx-auto mb-2"></div>
                      <div className="w-12 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
                      <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    </div>
                  ))}
                </div>

                <div className="mb-8">
                  <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Booking Sidebar Skeleton */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-32 h-10 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>

                <div className="mb-6">
                  <div className="w-48 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
                  <div className="w-64 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>

                {/* Form Skeleton */}
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index}>
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  ))}
                  <div className="w-full h-14 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!property) {
    return <div className="text-center py-20">Loading property details...</div>;
  }

  const images = property.images.map((img) => img.url);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const selectImage = (index) => setCurrentImageIndex(index);

  const similarProperties = property.similar || [];

  // Form handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await axios.post(
        "http://localhost:8000/api/leads",
        {
          ...formData,
          properties: [slug], // changed slug to Slug
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMsg("Visite réservée avec succès !");
      setFormData({
        name: "",
        email: "",
        phone: "",
        date_reservation: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message || "Erreur, veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };
 
  const handleSubmit2 =(e)=>{
    e.preventDefault()
    fetch(`http://localhost:8000/api/addLead/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date_reservation: formData.date_reservation,
        message: formData.message,
        properties: [slug]
      })
    })
  }





  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-blue-600 flex items-center cursor-pointer">
              <i className="fa-solid fa-home mr-2"></i>
              HomeFinder
            </Link>
            </div>
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  onChange={(e)=>setQuery(e.target.value)}
                  onKeyDown={(e) =>{ if(e.key === "Enter"){handleSearch(e) } }}
                  placeholder="Ex: 2 chambres, 1 salon, quartier Gauthier"
                  className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <i className="fa-solid fa-search text-blue-600"></i>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors">
                <option>FR</option>
                <option>EN</option>
                <option>AR</option>
              </select>
              <button className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Login
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="hover:text-blue-600 cursor-pointer">Accueil</span>
              <i className="fa-solid fa-chevron-right text-xs"></i>
              <span className="hover:text-blue-600 cursor-pointer">Recherche</span>
              <i className="fa-solid fa-chevron-right text-xs"></i>
              <span className="text-gray-900 font-medium">{property.title}</span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Gallery */}
            <section className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="relative h-96 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={`http://localhost:8000/storage/${images[currentImageIndex]}`}
                    alt={property.title}
                  />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {property.nouveau ? "Nouveau" : ""}
                  </div>
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full"
                  >
                    <i
                      className={`${isFavorite ? "fa-solid text-red-500" : "fa-regular"
                        } fa-heart text-gray-600 hover:text-red-500 cursor-pointer transition-colors text-lg`}
                    ></i>
                  </button>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                    {currentImageIndex + 1} / {images.length} photos
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-all"
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-all"
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                          ? "border-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={`http://localhost:8000/storage/${image}`}
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border border-gray-100">
                {/* Header section */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                    <p className="text-gray-600 flex items-center">
                      <i className="fa-solid fa-location-dot mr-2 text-blue-600"></i>
                      {property.ville?.name}, {property.quartier?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {property.sale_price ? property.sale_price : property.rent_price} DH
                    </div>
                    <div className="text-sm text-gray-500">/mois</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {property.filter_options && property.filter_options.length > 0 ? (
                    property.filter_options.map((option, index) => {
                      // Pick an icon dynamically depending on category name or slug
                      const icon = option.slug.includes('chambre')
                        ? 'fa-bed'
                        : option.slug.includes('salon')
                        ? 'fa-couch'
                        : option.slug.includes('m2') || option.slug.includes('superficie')
                        ? 'fa-ruler-combined'
                        : option.slug.includes('jardin')
                        ? 'fa-tree'
                        : 'fa-check-circle';

                      return (
                        <div
                          key={index}
                          className="text-center p-4 bg-gray-50 rounded-lg hover:shadow transition"
                        >
                          <i className={`fa-solid ${icon} text-blue-600 text-xl mb-2`}></i>
                          <div className="font-semibold text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-600 capitalize">
                            {
                              option.slug.includes('chambre')
                                ? 'Chambre'
                                : option.slug.includes('salon')
                                ? 'Salon'
                                : option.slug.includes('m2') || option.slug.includes('superficie')
                                ? 'Superficie'
                                : option.slug.includes('jardin')
                                ? 'Jardin'
                                : 'Autre'
                            }
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-500 col-span-4 text-center">Aucun filtre disponible</div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>
              </div>

            </section>

            {/* Booking Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {property.sale_price ? property.sale_price : property.rent_price} DH
                  </div>
                  <div className="text-gray-500">/mois</div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Réserver une visite
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Remplissez vos informations pour planifier une visite
                  </p>
                </div>

                {/* Booking Form */}
                <form 
                  className="space-y-4" 
                  onSubmit={token ? handleSubmit : handleSubmit2}
                >
                  {successMsg && <div className="text-green-600">{successMsg}</div>}
                  {errorMsg && <div className="text-red-600">{errorMsg}</div>}

                  {token ? (
                    // Authenticated users → only pick date
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date souhaitée *
                      </label>
                      <input
                        type="date"
                        name="date_reservation"
                        value={formData.date_reservation}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  ) : (
                    <>
                      {/* Nom complet */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                          placeholder="Votre nom"
                        />
                      </div>

                      {/* Adresse Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                          placeholder="exemple@mail.com"
                        />
                      </div>

                      {/* Numéro de téléphone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de téléphone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                          placeholder="+212 6XX XXX XXX"
                        />
                      </div>

                      {/* Date souhaitée */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date souhaitée *
                        </label>
                        <input
                          type="date"
                          name="date_reservation"
                          value={formData.date_reservation}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message (optionnel)
                        </label>
                        <textarea
                          name="message"
                          rows="3"
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors resize-none"
                          placeholder="Questions ou demandes spécifiques..."
                        ></textarea>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
                  >
                    {loading ? "Envoi..." : "Confirmer la visite"}
                  </button>
                </form>

              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}