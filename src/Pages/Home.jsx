import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Eye, Grid, List, MapPin, Clock, ArrowLeft, Star, MessageCircle, Shield, Truck, RotateCcw } from 'lucide-react';

const Home = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend API base URL - adjust this to match your backend server
  const API_BASE_URL = 'http://localhost:8080/api/products';

  // Fetch products from backend on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform backend data to match frontend format
      const transformedProducts = data.map(product => ({
        id: product.id,
        name: product.title,
        price: product.price || 0,
        originalPrice: product.originalPrice || null,
        category: product.category || 'Uncategorized',
        description: product.description || 'No description available',
        fullDescription: product.description || 'No detailed description available',
        location: product.location || 'Location not specified',
        timeAgo: formatTimeAgo(product.createdAt) || 'Recently posted',
        image: product.image ? `http://localhost:8080${product.image}` : '/api/placeholder/300/200',
        images: [getCategoryEmoji(product.category), '📦', '🔍', '✨'],
        categoryIcon: getCategoryIcon(product.category),
        seller: product.user?.name || product.email || 'Anonymous Seller',
        sellerRating: 4.5, // Default rating since it's not in backend
        sellerReviews: Math.floor(Math.random() * 100) + 10, // Random reviews
        features: generateFeatures(product),
        specifications: {
          'Condition': product.condition || 'Good',
          'Category': product.category || 'General',
          'Location': product.location || 'Not specified',
          'Contact': product.email || product.number || 'Contact seller',
          'Posted': formatTimeAgo(product.createdAt) || 'Recently'
        },
        // Backend specific fields
        email: product.email,
        number: product.number,
        message: product.message,
        condition: product.condition
      }));
      
      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`Failed to load products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format timestamps
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently posted';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} weeks ago`;
  };

  // Helper function to get category emoji
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Electronics': '📱',
      'Vehicles': '🚗',
      'Furniture': '🛋️',
      'Fashion': '👕',
      'Books': '📚',
      'Sports': '⚽',
      'Home': '🏠',
      'Garden': '🌱',
      'Tools': '🔧',
      'default': '📦'
    };
    return emojiMap[category] || emojiMap.default;
  };

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    if (!category) return 'G';
    return category.charAt(0).toUpperCase();
  };

  // Helper function to generate features based on product data
  const generateFeatures = (product) => {
    const features = [];
    
    if (product.condition) features.push(`${product.condition} Condition`);
    if (product.category) features.push(`${product.category} Category`);
    if (product.location) features.push(`Available in ${product.location}`);
    if (product.email) features.push('Email Contact Available');
    if (product.number) features.push('Phone Contact Available');
    
    // Add default features if none exist
    if (features.length === 0) {
      features.push('Quality Product', 'Fast Response', 'Reliable Seller');
    }
    
    return features;
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
  };

  // Loading component
  const LoadingComponent = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #1e293b',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ color: '#6b7280', fontSize: '1rem' }}>Loading products...</p>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        padding: '20px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h3 style={{ color: '#dc2626', marginBottom: '8px' }}>Error Loading Products</h3>
        <p style={{ color: '#7f1d1d', marginBottom: '16px' }}>{error}</p>
        <button
          onClick={fetchProducts}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Product Details Page Component
  const ProductDetailsPage = ({ product }) => {
    const detailsStyles = {
      page: {
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
      },
      container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#ffffff'
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px 0',
        borderBottom: '1px solid #e5e7eb'
      },
      backButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        color: '#374151',
        transition: 'all 0.2s'
      },
      favoriteButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: favorites.has(product.id) ? '#fef2f2' : 'white',
        border: favorites.has(product.id) ? '1px solid #fca5a5' : '1px solid #d1d5db',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        color: favorites.has(product.id) ? '#dc2626' : '#374151',
        transition: 'all 0.2s'
      },
      content: {
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? '400px 1fr' : '1fr',
        gap: '40px',
        marginTop: '30px'
      },
      images: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      },
      mainImage: {
        position: 'relative',
        width: '100%',
        height: '300px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e9ecef'
      },
      imagePlaceholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6c757d',
        fontSize: '0.9rem',
        textAlign: 'center',
        padding: '20px'
      },
      productEmoji: {
        fontSize: '3rem',
        marginBottom: '12px'
      },
      productTitle: {
        fontSize: '1.1rem',
        fontWeight: '500'
      },
      discountBadge: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        boxShadow: '0 2px 8px rgba(238, 90, 36, 0.3)'
      },
      thumbnailGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px'
      },
      thumbnail: {
        width: '70px',
        height: '70px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: '2px solid #e9ecef',
        fontSize: '1.3rem'
      },
      info: {
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        paddingLeft: '10px'
      },
      categoryBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: '#fff3cd',
        color: '#856404',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '500',
        width: 'fit-content',
        border: '1px solid #ffeaa7'
      },
      categoryIcon: {
        width: '18px',
        height: '18px',
        backgroundColor: '#ffd93d',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#856404',
        fontSize: '0.7rem',
        fontWeight: '600'
      },
      title: {
        fontSize: '2.2rem',
        fontWeight: '700',
        color: '#2c3e50',
        lineHeight: '1.2',
        margin: '0'
      },
      priceSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        margin: '10px 0'
      },
      currentPrice: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#27ae60'
      },
      originalPrice: {
        fontSize: '1.3rem',
        color: '#95a5a6',
        textDecoration: 'line-through'
      },
      locationTime: {
        display: 'flex',
        gap: '25px',
        margin: '15px 0'
      },
      infoItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#7f8c8d',
        fontSize: '0.95rem'
      },
      sellerCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        margin: '20px 0'
      },
      sellerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      },
      sellerAvatar: {
        width: '50px',
        height: '50px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.4rem'
      },
      sellerText: {
        display: 'flex',
        flexDirection: 'column'
      },
      sellerName: {
        margin: '0 0 5px 0',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#2c3e50'
      },
      sellerRating: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      stars: {
        display: 'flex',
        gap: '2px'
      },
      star: {
        width: '14px',
        height: '14px'
      },
      starFilled: {
        color: '#f39c12',
        fill: '#f39c12'
      },
      starEmpty: {
        color: '#bdc3c7',
        fill: 'none'
      },
      ratingText: {
        fontSize: '0.85rem',
        color: '#7f8c8d'
      },
      contactSellerBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #007bff, #0056b3)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)'
      },
      section: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        margin: '25px 0'
      },
      sectionTitle: {
        fontSize: '1.3rem',
        fontWeight: '600',
        color: '#2c3e50',
        margin: '0',
        paddingBottom: '8px',
        borderBottom: '2px solid #ecf0f1'
      },
      descriptionText: {
        fontSize: '1rem',
        color: '#5d6d7e',
        lineHeight: '1.6',
        margin: '0',
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '8px',
        borderLeft: '4px solid #007bff'
      },
      sellerMessage: {
        fontSize: '0.95rem',
        color: '#495057',
        backgroundColor: '#e7f3ff',
        padding: '15px',
        borderRadius: '8px',
        borderLeft: '4px solid #007bff',
        margin: '0'
      },
      featuresList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginTop: '10px'
      },
      featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        border: '1px solid #e9ecef'
      },
      checkmark: {
        width: '18px',
        height: '18px',
        background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: '600',
        flexShrink: 0
      },
      featureText: {
        fontSize: '0.9rem',
        color: '#495057',
        fontWeight: '500'
      },
      specifications: {
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #e9ecef'
      },
      specItem: {
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        gap: '15px',
        padding: '12px 0',
        borderBottom: '1px solid #e9ecef'
      },
      specKey: {
        fontWeight: '600',
        color: '#495057',
        fontSize: '0.9rem'
      },
      specValue: {
        color: '#6c757d',
        fontSize: '0.9rem'
      },
      contactInfo: {
        background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e1bee7'
      },
      contactInfoP: {
        margin: '8px 0',
        fontSize: '0.95rem',
        color: '#4a148c',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      trustBadges: {
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        margin: '20px 0'
      },
      badge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 15px',
        backgroundColor: '#e8f5e8',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: '#2e7d32',
        border: '1px solid #c8e6c9',
        fontWeight: '500'
      },
      actionButtons: {
        display: 'flex',
        gap: '15px',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #e9ecef'
      },
      addToCartBtn: {
        flex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '15px 25px',
        background: 'linear-gradient(135deg, #28a745, #20c997)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 3px 12px rgba(40, 167, 69, 0.3)'
      },
      makeOfferBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '15px 25px',
        backgroundColor: 'white',
        color: '#007bff',
        border: '2px solid #007bff',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }
    };

    return (
      <div style={detailsStyles.page}>
        <div style={detailsStyles.container}>
          {/* Header */}
          <div style={detailsStyles.header}>
            <button 
              onClick={handleBackToHome}
              style={detailsStyles.backButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#d1d5db';
              }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              Back to Home
            </button>
            <button 
              onClick={() => toggleFavorite(product.id)}
              style={detailsStyles.favoriteButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fef2f2';
                e.target.style.borderColor = '#fca5a5';
                e.target.style.color = '#dc2626';
              }}
              onMouseLeave={(e) => {
                if (!favorites.has(product.id)) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.color = '#374151';
                }
              }}
            >
              <Heart style={{
                width: '16px',
                height: '16px',
                fill: favorites.has(product.id) ? '#dc2626' : 'none',
                color: favorites.has(product.id) ? '#dc2626' : '#374151'
              }} />
              {favorites.has(product.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>

          {/* Product Content */}
          <div style={detailsStyles.content}>
            {/* Left Column - Images */}
            <div style={detailsStyles.images}>
              <div style={detailsStyles.mainImage}>
                {product.image && product.image !== '/api/placeholder/300/200' ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div style={{
                  ...detailsStyles.imagePlaceholder,
                  display: product.image && product.image !== '/api/placeholder/300/200' ? 'none' : 'flex'
                }}>
                  <div style={detailsStyles.productEmoji}>{product.images[0]}</div>
                  <div style={detailsStyles.productTitle}>{product.name}</div>
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div style={detailsStyles.discountBadge}>
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>
              <div style={detailsStyles.thumbnailGrid}>
                {product.images.map((img, index) => (
                  <div key={index} style={detailsStyles.thumbnail}>
                    {img}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div style={detailsStyles.info}>
              <div style={detailsStyles.categoryBadge}>
                <span style={detailsStyles.categoryIcon}>
                  {product.categoryIcon}
                </span>
                <span>{product.category}</span>
              </div>

              <h1 style={detailsStyles.title}>{product.name}</h1>
              
              <div style={detailsStyles.priceSection}>
                <span style={detailsStyles.currentPrice}>${product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span style={detailsStyles.originalPrice}>${product.originalPrice}</span>
                    <span style={detailsStyles.discountBadge}>
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <div style={detailsStyles.locationTime}>
                <div style={detailsStyles.infoItem}>
                  <MapPin style={{ width: '16px', height: '16px' }} />
                  <span>{product.location}</span>
                </div>
                <div style={detailsStyles.infoItem}>
                  <Clock style={{ width: '16px', height: '16px' }} />
                  <span>{product.timeAgo}</span>
                </div>
              </div>

              <div style={detailsStyles.sellerCard}>
                <div style={detailsStyles.sellerInfo}>
                  <div style={detailsStyles.sellerAvatar}>
                    👤
                  </div>
                  <div style={detailsStyles.sellerText}>
                    <h3 style={detailsStyles.sellerName}>{product.seller}</h3>
                    <div style={detailsStyles.sellerRating}>
                      <div style={detailsStyles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} style={{
                            ...detailsStyles.star,
                            ...(i < Math.floor(product.sellerRating) ? detailsStyles.starFilled : detailsStyles.starEmpty)
                          }} />
                        ))}
                      </div>
                      <span style={detailsStyles.ratingText}>{product.sellerRating} ({product.sellerReviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <button style={detailsStyles.contactSellerBtn}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.3)';
                  }}
                >
                  <MessageCircle style={{ width: '16px', height: '16px' }} />
                  Contact Seller
                </button>
              </div>

              <div style={detailsStyles.section}>
                <h3 style={detailsStyles.sectionTitle}>Description</h3>
                <p style={detailsStyles.descriptionText}>{product.fullDescription}</p>
                {product.message && (
                  <p style={detailsStyles.sellerMessage}>
                    <strong>Seller's message:</strong> {product.message}
                  </p>
                )}
              </div>

              <div style={detailsStyles.section}>
                <h3 style={detailsStyles.sectionTitle}>Key Features</h3>
                <div style={detailsStyles.featuresList}>
                  {product.features.map((feature, index) => (
                    <div key={index} style={detailsStyles.featureItem}>
                      <span style={detailsStyles.checkmark}>✓</span>
                      <span style={detailsStyles.featureText}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={detailsStyles.section}>
                <h3 style={detailsStyles.sectionTitle}>Specifications</h3>
                <div style={detailsStyles.specifications}>
                  {Object.entries(product.specifications).map(([key, value], index, array) => (
                    <div key={key} style={{
                      ...detailsStyles.specItem,
                      borderBottom: index === array.length - 1 ? 'none' : '1px solid #e9ecef'
                    }}>
                      <div style={detailsStyles.specKey}>{key}:</div>
                      <div style={detailsStyles.specValue}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={detailsStyles.section}>
                <h3 style={detailsStyles.sectionTitle}>Contact Information</h3>
                <div style={detailsStyles.contactInfo}>
                  {product.email && (
                    <p style={detailsStyles.contactInfoP}>
                      <span>📧</span>
                      <strong>Email:</strong> {product.email}
                    </p>
                  )}
                  {product.number && (
                    <p style={detailsStyles.contactInfoP}>
                      <span>📞</span>
                      <strong>Phone:</strong> {product.number}
                    </p>
                  )}
                  <p style={detailsStyles.contactInfoP}>
                    <span>📍</span>
                    <strong>Location:</strong> {product.location}
                  </p>
                </div>
              </div>

              <div style={detailsStyles.trustBadges}>
                <div style={detailsStyles.badge}>
                  <Shield style={{ width: '16px', height: '16px' }} />
                  Verified Seller
                </div>
                <div style={detailsStyles.badge}>
                  <Truck style={{ width: '16px', height: '16px' }} />
                  Local Delivery
                </div>
                <div style={detailsStyles.badge}>
                  <RotateCcw style={{ width: '16px', height: '16px' }} />
                  Return Policy
                </div>
              </div>

              <div style={detailsStyles.actionButtons}>
                <button style={detailsStyles.addToCartBtn}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 16px rgba(40, 167, 69, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 12px rgba(40, 167, 69, 0.3)';
                  }}
                >
                  <ShoppingCart style={{ width: '18px', height: '18px' }} />
                  Add to Cart
                </button>
                <button style={detailsStyles.makeOfferBtn}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#007bff';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = '#007bff';
                  }}
                >
                  💰 Make Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render logic
  if (selectedProduct) {
    return <ProductDetailsPage product={selectedProduct} />;
  }

  const styles = {
    // page: {
    //   minHeight: '50vh',
    //   backgroundColor: '#f8f9fa',
    //   fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
    // },
    container: {
      maxWidth: '100%',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    },
    // Hero Header Styles
    heroSection: {
      background: 'linear-gradient(135deg, #5a6c7d 0%, #4a5a6b 100%)',
      padding: '80px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '30px'
    },
    heroContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2,
      height: '250px'
    },
    heroTitle: {
      fontSize: '3.5rem',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '16px',
      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      letterSpacing: '-0.02em'
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      color: '#e8eaed',
      marginBottom: '40px',
      fontWeight: '400',
      opacity: 0.9,
      maxWidth: '600px',
      margin: '0 auto 40px auto',
      lineHeight: '1.6'
    },
    // Updated search container for hero
    searchContainer: {
      position: 'relative',
      maxWidth: '500px',
      margin: '0 auto 40px auto',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: '50px',
      padding: '4px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    searchInput: {
      flex: 1,
      padding: '16px 50px 16px 24px',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '50px',
      backgroundColor: 'transparent',
      outline: 'none',
      color: '#333333',
      fontWeight: '400'
    },
    searchIcon: {
      position: 'absolute',
      right: '20px',
      color: '#6c757d',
      cursor: 'pointer',
      transition: 'color 0.2s ease'
    },
    // View controls in hero
    controls: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '15px'
    },
    viewToggle: {
      display: 'flex',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '4px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)'
    },
    viewButton: {
      padding: '8px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.9rem'
    },
    activeViewButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    inactiveViewButton: {
      backgroundColor: 'transparent',
      color: 'rgba(255, 255, 255, 0.8)'
    },
    // Rest of the existing styles remain the same
    filterInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef'
    },
    resultsCount: {
      color: '#495057',
      fontSize: '1rem',
      fontWeight: '500'
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: viewMode === 'grid' 
        ? 'repeat(auto-fill, minmax(280px, 1fr))' 
        : '1fr',
      gap: viewMode === 'grid' ? '25px' : '15px',
      marginBottom: '40px'
    },
    productCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '1px solid #e9ecef',
      display: viewMode === 'list' ? 'flex' : 'block',
      height: viewMode === 'list' ? '200px' : 'auto'
    },
    imageContainer: {
      position: 'relative',
      width: viewMode === 'list' ? '200px' : '100%',
      height: viewMode === 'list' ? '100%' : '200px',
      backgroundColor: '#f8f9fa',
      flexShrink: 0
    },
    productImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6c757d',
      fontSize: '0.9rem',
      textAlign: 'center'
    },
    productEmoji: {
      fontSize: '2.5rem',
      marginBottom: '8px'
    },
    discountBadge: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '15px',
      fontSize: '0.75rem',
      fontWeight: '600',
      boxShadow: '0 2px 6px rgba(238, 90, 36, 0.3)'
    },
    favoriteButton: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      background: 'rgba(255, 255, 255, 0.9)',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backdropFilter: 'blur(10px)'
    },
    productInfo: {
      padding: viewMode === 'list' ? '20px' : '15px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    productHeader: {
      marginBottom: '8px'
    },
    categoryBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      backgroundColor: '#fff3cd',
      color: '#856404',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '500',
      marginBottom: '8px'
    },
    categoryIcon: {
      width: '14px',
      height: '14px',
      backgroundColor: '#ffd93d',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#856404',
      fontSize: '0.6rem',
      fontWeight: '600'
    },
    productName: {
      fontSize: viewMode === 'list' ? '1.3rem' : '1.1rem',
      fontWeight: '600',
      color: '#2c3e50',
      margin: '0 0 8px 0',
      lineHeight: '1.3',
      display: '-webkit-box',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    productDescription: {
      fontSize: '0.9rem',
      color: '#6c757d',
      margin: '0 0 12px 0',
      display: '-webkit-box',
      WebkitLineClamp: viewMode === 'list' ? '3' : '2',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      lineHeight: '1.4'
    },
    priceSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    },
    currentPrice: {
      fontSize: viewMode === 'list' ? '1.4rem' : '1.2rem',
      fontWeight: '700',
      color: '#27ae60'
    },
    originalPrice: {
      fontSize: '0.9rem',
      color: '#95a5a6',
      textDecoration: 'line-through'
    },
    productFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto'
    },
    locationTime: {
      display: 'flex',
      flexDirection: viewMode === 'list' ? 'row' : 'column',
      gap: viewMode === 'list' ? '15px' : '4px'
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      color: '#7f8c8d',
      fontSize: '0.8rem'
    },
    viewDetailsBtn: {
      padding: '8px 16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.85rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#6c757d'
    },
    emptyStateIcon: {
      fontSize: '4rem',
      marginBottom: '20px'
    },
    emptyStateTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#495057'
    },
    emptyStateText: {
      fontSize: '1rem',
      lineHeight: '1.5',
      maxWidth: '400px',
      margin: '0 auto'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.heroSection}>
  <div style={styles.heroContainer}>
    <h1 style={styles.heroTitle}>Welcome to MarketPlace</h1>
    <p style={styles.heroSubtitle}>Buy and sell anything, anywhere, anytime</p>
    
    {/* Search Bar */}
    <div style={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search products..."
        style={styles.searchInput}
        onFocus={(e) => {
          e.target.style.borderColor = '#007bff';
          e.target.style.backgroundColor = '#ffffff';
          e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#e9ecef';
          e.target.style.backgroundColor = '#f8f9fa';
          e.target.style.boxShadow = 'none';
        }}
      />
      <Search style={styles.searchIcon} size={20} />
    </div>
    
    {/* View Controls */}
    <div style={styles.controls}>
      <div style={styles.viewToggle}>
        <button
          onClick={() => setViewMode('grid')}
          style={{
            ...styles.viewButton,
            ...(viewMode === 'grid' ? styles.activeViewButton : styles.inactiveViewButton)
          }}
        >
          <Grid size={16} />
          Grid
        </button>
        <button
          onClick={() => setViewMode('list')}
          style={{
            ...styles.viewButton,
            ...(viewMode === 'list' ? styles.activeViewButton : styles.inactiveViewButton)
          }}
        >
          <List size={16} />
          List
        </button>
      </div>
    </div>
  </div>
</div>

        {/* Loading State */}
        {loading && <LoadingComponent />}

        {/* Error State */}
        {error && <ErrorComponent />}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Filter Info */}
            <div style={styles.filterInfo}>
              <div style={styles.resultsCount}>
                {products.length} products found
              </div>
            </div>

            {/* Products Grid/List */}
            {products.length > 0 ? (
              <div style={styles.productGrid}>
                {products.map((product) => (
                  <div
                    key={product.id}
                    style={styles.productCard}
                    onClick={() => handleViewDetails(product)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* Image Container */}
                    <div style={styles.imageContainer}>
                      {product.image && product.image !== '/api/placeholder/300/200' ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={styles.productImage}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div style={{
                        ...styles.imagePlaceholder,
                        display: product.image && product.image !== '/api/placeholder/300/200' ? 'none' : 'flex'
                      }}>
                        <div style={styles.productEmoji}>{product.images[0]}</div>
                        <div>{product.name}</div>
                      </div>
                      
                      {/* Discount Badge */}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div style={styles.discountBadge}>
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                      
                      {/* Favorite Button */}
                      <button
                        style={styles.favoriteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.background = 'rgba(255, 255, 255, 1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                        }}
                      >
                        <Heart
                          size={16}
                          style={{
                            color: favorites.has(product.id) ? '#e74c3c' : '#95a5a6',
                            fill: favorites.has(product.id) ? '#e74c3c' : 'none'
                          }}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div style={styles.productInfo}>
                      <div style={styles.productHeader}>
                        <div style={styles.categoryBadge}>
                          <span style={styles.categoryIcon}>
                            {product.categoryIcon}
                          </span>
                          <span>{product.category}</span>
                        </div>
                        <h3 style={styles.productName}>{product.name}</h3>
                        <p style={styles.productDescription}>{product.description}</p>
                      </div>

                      <div style={styles.priceSection}>
                        <span style={styles.currentPrice}>${product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span style={styles.originalPrice}>${product.originalPrice}</span>
                        )}
                      </div>

                      <div style={styles.productFooter}>
                        <div style={styles.locationTime}>
                          <div style={styles.infoItem}>
                            <MapPin size={12} />
                            <span>{product.location}</span>
                          </div>
                          <div style={styles.infoItem}>
                            <Clock size={12} />
                            <span>{product.timeAgo}</span>
                          </div>
                        </div>
                        <button
                          style={styles.viewDetailsBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(product);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#0056b3';
                            e.target.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#007bff';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyStateIcon}>📦</div>
                <h2 style={styles.emptyStateTitle}>No Products Found</h2>
                <p style={styles.emptyStateText}>
                  We couldn't find any products matching your search criteria. 
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;