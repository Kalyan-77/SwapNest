import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, Eye, Grid, List, MapPin, Clock, ArrowLeft, Star, MessageCircle, Shield, Truck, RotateCcw } from 'lucide-react';

const Home = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = [
    { id: 'electronics', name: 'Electronics', icon: 'E' },
    { id: 'vehicles', name: 'Vehicles', icon: 'V' },
    { id: 'furniture', name: 'Furniture', icon: 'F' },
    { id: 'fashion', name: 'Fashion', icon: 'F' },
    { id: 'books', name: 'Books', icon: 'B' },
    { id: 'sports', name: 'Sports', icon: 'S' }
  ];

  const products = [
    {
      id: 1,
      name: 'iPhone 14 Pro Max',
      price: 899,
      originalPrice: 999,
      category: 'Electronics',
      description: 'Excellent condition iPhone 14 Pro Max with original box and accessories.',
      fullDescription: 'This iPhone 14 Pro Max is in excellent condition with minimal signs of use. Comes with original box, charger, and unused accessories. The device has been well-maintained and protected with a case and screen protector since day one.',
      location: 'New York, NY',
      timeAgo: '2 days ago',
      image: '/api/placeholder/300/200',
      images: ['📱', '📦', '🔌', '📱'],
      categoryIcon: 'E',
      seller: 'John Smith',
      sellerRating: 4.8,
      sellerReviews: 127,
      features: ['128GB Storage', 'Face ID', 'Wireless Charging', 'Water Resistant', 'Original Box Included'],
      specifications: {
        'Storage': '128GB',
        'Color': 'Deep Purple',
        'Condition': 'Excellent',
        'Battery Health': '95%',
        'Warranty': 'Apple Care+ until 2024'
      }
    },
    {
      id: 2,
      name: 'Gaming Laptop',
      price: 1200,
      originalPrice: 1500,
      category: 'Electronics',
      description: 'High-performance gaming laptop with RTX 3070 graphics card.',
      fullDescription: 'Powerful gaming laptop perfect for high-end gaming and professional work. Features the latest RTX 3070 graphics card, 16GB RAM, and a fast SSD. Barely used, mostly for light gaming sessions.',
      location: 'Los Angeles, CA',
      timeAgo: '1 week ago',
      image: '/api/placeholder/300/200',
      images: ['💻', '🎮', '⚡', '🖥️'],
      categoryIcon: 'E',
      seller: 'TechGamer Pro',
      sellerRating: 4.9,
      sellerReviews: 89,
      features: ['RTX 3070 GPU', '16GB RAM', '1TB SSD', '144Hz Display', 'RGB Backlit Keyboard'],
      specifications: {
        'Processor': 'Intel i7-11800H',
        'Graphics': 'NVIDIA RTX 3070',
        'RAM': '16GB DDR4',
        'Storage': '1TB NVMe SSD',
        'Display': '15.6" 144Hz'
      }
    },
    {
      id: 3,
      name: 'Vintage Bike',
      price: 250,
      category: 'Vehicles',
      description: 'Classic vintage bicycle in good working condition.',
      fullDescription: 'Beautiful vintage bicycle from the 1980s, fully restored and in excellent working condition. Perfect for casual rides around the city or as a collector\'s item.',
      location: 'Chicago, IL',
      timeAgo: '3 days ago',
      image: '/api/placeholder/300/200',
      images: ['🚲', '⚙️', '🔧', '🚲'],
      categoryIcon: 'V',
      seller: 'Vintage Wheels',
      sellerRating: 4.7,
      sellerReviews: 45,
      features: ['Fully Restored', 'New Tires', 'Smooth Gears', 'Classic Design', 'Ready to Ride'],
      specifications: {
        'Year': '1985',
        'Brand': 'Classic Cruiser',
        'Frame Size': '54cm',
        'Gears': '10-speed',
        'Condition': 'Restored'
      }
    },
    {
      id: 4,
      name: 'Sofa Set',
      price: 450,
      originalPrice: 800,
      category: 'Furniture',
      description: 'Comfortable 3-piece sofa set, barely used.',
      fullDescription: 'Beautiful 3-piece sofa set in excellent condition. Very comfortable and stylish, perfect for any living room. Selling due to moving to a smaller apartment.',
      location: 'Houston, TX',
      timeAgo: '5 days ago',
      image: '/api/placeholder/300/200',
      images: ['🛋️', '🏠', '✨', '🛋️'],
      categoryIcon: 'F',
      seller: 'HomeFurnish',
      sellerRating: 4.6,
      sellerReviews: 62,
      features: ['3-piece set', 'High-quality fabric', 'Comfortable cushions', 'Easy to clean', 'Pet-friendly'],
      specifications: {
        'Pieces': '3 (Sofa + 2 Chairs)',
        'Material': 'Premium Fabric',
        'Color': 'Light Gray',
        'Dimensions': '7ft x 3ft',
        'Condition': 'Like New'
      }
    }
  ];

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

  // Product Details Page Component
  const ProductDetailsPage = ({ product }) => {
    return (
      <div className="product-details-page">
        <div className="product-details-container">
          {/* Header */}
          <div className="product-details-header">
            <button 
              onClick={handleBackToHome}
              className="back-button"
            >
              <ArrowLeft className="icon-small" />
              Back to Home
            </button>
            <button 
              onClick={() => toggleFavorite(product.id)}
              className={`favorite-button ${favorites.has(product.id) ? 'favorite-active' : ''}`}
            >
              <Heart className={`icon-small ${favorites.has(product.id) ? 'heart-filled' : ''}`} />
              {favorites.has(product.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>

          {/* Product Content */}
          <div className="product-content">
            {/* Left Column - Images */}
            <div className="product-images">
              <div className="main-image">
                <div className="image-placeholder">
                  <div className="product-emoji">{product.images[0]}</div>
                  <div className="product-title">{product.name}</div>
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="discount-badge">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>
              <div className="thumbnail-grid">
                {product.images.map((img, index) => (
                  <div key={index} className="thumbnail">
                    <span className="thumbnail-emoji">{img}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="product-info">
              <div className="category-badge">
                <span className="category-icon">
                  {product.categoryIcon}
                </span>
                <span>{product.category}</span>
              </div>

              <h1 className="product-title">{product.name}</h1>
              
              <div className="price-section">
                <span className="current-price">${product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="original-price">${product.originalPrice}</span>
                )}
                <span className="discount-badge">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
              </div>

              <div className="location-time">
                <div className="info-item">
                  <MapPin className="icon-small" />
                  <span>{product.location}</span>
                </div>
                <div className="info-item">
                  <Clock className="icon-small" />
                  <span>{product.timeAgo}</span>
                </div>
              </div>

              <div className="seller-card">
                <div className="seller-info">
                  <div className="seller-avatar">
                    <span className="avatar-emoji">👤</span>
                  </div>
                  <div className="seller-text">
                    <h3 className="seller-name">{product.seller}</h3>
                    <div className="seller-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`star ${i < Math.floor(product.sellerRating) ? 'star-filled' : 'star-empty'}`} />
                        ))}
                      </div>
                      <span className="rating-text">{product.sellerRating} ({product.sellerReviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <button className="contact-seller-btn">
                  <MessageCircle className="icon-small" />
                  Contact Seller
                </button>
              </div>

              <div className="section">
                <h3 className="section-title">Description</h3>
                <p className="description-text">{product.fullDescription}</p>
              </div>

              <div className="description-section">
                <h3 className="section-title">Key Features</h3>
                <div className="features-list">
                  {product.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span className="checkmark">✓</span>
                      <span className="feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <h3 className="section-title">Specifications</h3>
                <div className="specifications">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-key">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="trust-badges">
                <div className="badge">
                  <Shield className="icon-small" />
                  <span>Buyer Protection</span>
                </div>
                <div className="badge">
                  <Truck className="icon-small" />
                  <span>Fast Delivery</span>
                </div>
                <div className="badge">
                  <RotateCcw className="icon-small" />
                  <span>30-Day Returns</span>
                </div>
              </div>

              <div className="action-buttons">
                <button className="add-to-cart-btn">
                  <ShoppingCart className="icon-medium" />
                  Add to Cart - ${product.price}
                </button>
                <button className="make-offer-btn">
                  <MessageCircle className="icon-medium" />
                  Make Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If a product is selected, show details page
  if (selectedProduct) {
    return <ProductDetailsPage product={selectedProduct} />;
  }

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
    },
    heroSection: {
      background: 'linear-gradient(to right, #475569, #334155)',
      color: 'white',
      padding: '80px 0',
      textAlign: 'center'
    },
    heroContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    heroTitle: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '16px'
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      opacity: 0.9,
      marginBottom: '32px'
    },
    searchContainer: {
      maxWidth: '600px',
      margin: '0 auto',
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      padding: '16px 24px',
      fontSize: '1.125rem',
      borderRadius: '8px',
      border: 'none',
      outline: 'none',
      color: '#374151',
      paddingRight: '60px'
    },
    searchIcon: {
      position: 'absolute',
      right: '16px',
      top: '16px',
      width: '24px',
      height: '24px',
      color: '#9ca3af'
    },
    mainContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 20px'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      gap: '16px'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    viewControls: {
      display: 'flex',
      gap: '8px'
    },
    viewBtn: {
      padding: '8px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    viewBtnActive: {
      backgroundColor: '#1e293b',
      color: 'white'
    },
    viewBtnInactive: {
      backgroundColor: '#e5e7eb',
      color: '#4b5563'
    },
    productsGrid: {
      display: 'grid',
      gap: '24px'
    },
    productsGridView: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
    },
    productsListView: {
      gridTemplateColumns: '1fr'
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column'
    },
    productCardList: {
      flexDirection: 'row',
      height: '200px'
    },
    productImage: {
      position: 'relative',
      backgroundColor: '#f3f4f6',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    productImageList: {
      width: '300px',
      height: '200px',
      flexShrink: 0
    },
    categoryBadge: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      background: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      color: '#4b5563',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    categoryIcon: {
      width: '16px',
      height: '16px',
      backgroundColor: '#d1d5db',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem'
    },
    favoriteBtn: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      padding: '8px',
      background: 'white',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    productPlaceholder: {
      color: '#6b7280',
      fontSize: '0.875rem',
      textAlign: 'center',
      padding: '0 20px'
    },
    productDetails: {
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    productDetailsListView: {
      justifyContent: 'space-between'
    },
    productName: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px'
    },
    productPrice: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#059669',
      marginBottom: '12px'
    },
    productDescription: {
      fontSize: '0.875rem',
      color: '#4b5563',
      marginBottom: '16px',
      lineHeight: '1.5'
    },
    productMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      fontSize: '0.75rem',
      color: '#6b7280'
    },
    productLocation: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    productActions: {
      display: 'flex',
      gap: '8px',
      marginTop: 'auto'
    },
    actionBtn: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    actionBtnPrimary: {
      backgroundColor: '#1e293b',
      color: 'white'
    },
    actionBtnSecondary: {
      backgroundColor: 'white',
      color: '#1e293b',
      border: '1px solid #1e293b'
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroContainer}>
          <h1 style={styles.heroTitle}>Welcome to SwapNest</h1>
          <p style={styles.heroSubtitle}>Buy and sell anything, anywhere, anytime</p>
          
          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search for products..."
              style={styles.searchInput}
            />
            <Search style={styles.searchIcon} />
          </div>
        </div>
      </div>

      <div style={styles.mainContainer}>
        {/* Featured Products Section */}
        <div>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Products ({products.length})</h2>
            <div style={styles.viewControls}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  ...styles.viewBtn,
                  ...(viewMode === 'grid' ? styles.viewBtnActive : styles.viewBtnInactive)
                }}
                onMouseEnter={(e) => {
                  if (viewMode !== 'grid') {
                    e.target.style.backgroundColor = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewMode !== 'grid') {
                    e.target.style.backgroundColor = '#e5e7eb';
                  }
                }}
              >
                <Grid style={{ width: '20px', height: '20px' }} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  ...styles.viewBtn,
                  ...(viewMode === 'list' ? styles.viewBtnActive : styles.viewBtnInactive)
                }}
                onMouseEnter={(e) => {
                  if (viewMode !== 'list') {
                    e.target.style.backgroundColor = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (viewMode !== 'list') {
                    e.target.style.backgroundColor = '#e5e7eb';
                  }
                }}
              >
                <List style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </div>

          <div style={{
            ...styles.productsGrid,
            ...(viewMode === 'grid' ? styles.productsGridView : styles.productsListView)
          }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  ...styles.productCard,
                  ...(viewMode === 'list' ? styles.productCardList : {})
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Product Image */}
                <div style={{
                  ...styles.productImage,
                  ...(viewMode === 'list' ? styles.productImageList : {})
                }}>
                  <div style={styles.categoryBadge}>
                    <span style={styles.categoryIcon}>
                      {product.categoryIcon}
                    </span>
                    {product.category}
                  </div>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    style={styles.favoriteBtn}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <Heart
                      style={{
                        width: '20px',
                        height: '20px',
                        color: favorites.has(product.id) ? '#ef4444' : '#4b5563',
                        fill: favorites.has(product.id) ? '#ef4444' : 'none',
                        transition: 'color 0.2s'
                      }}
                    />
                  </button>
                  <div style={styles.productPlaceholder}>{product.name}</div>
                </div>

                {/* Product Details */}
                <div style={{
                  ...styles.productDetails,
                  ...(viewMode === 'list' ? styles.productDetailsListView : {})
                }}>
                  <div>
                    <h3 style={styles.productName}>{product.name}</h3>
                    <p style={styles.productPrice}>${product.price}</p>
                    <p style={styles.productDescription}>{product.description}</p>
                    
                    <div style={styles.productMeta}>
                      <span style={styles.productLocation}>📍 {product.location}</span>
                      <span>{product.timeAgo}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={styles.productActions}>
                    <button
                      style={{
                        ...styles.actionBtn,
                        ...styles.actionBtnPrimary
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0f172a';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#1e293b';
                      }}
                    >
                      <ShoppingCart style={{ width: '16px', height: '16px' }} />
                      Add to Cart
                    </button>
                    <button
                      style={{
                        ...styles.actionBtn,
                        ...styles.actionBtnSecondary
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#1e293b';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = '#1e293b';
                      }}
                      onClick={() => handleViewDetails(product)}
                    >
                      <Eye style={{ width: '16px', height: '16px' }} />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;