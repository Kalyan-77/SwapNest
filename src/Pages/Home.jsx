import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, Eye, Grid, List } from 'lucide-react';

const Home = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());

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
      category: 'Electronics',
      description: 'Excellent condition iPhone 14 Pro Max with original box and accessories.',
      location: 'New York, NY',
      timeAgo: '2 days ago',
      image: '/api/placeholder/300/200',
      categoryIcon: 'Electronics'
    },
    {
      id: 2,
      name: 'Gaming Laptop',
      price: 1200,
      category: 'Electronics',
      description: 'High-performance gaming laptop with RTX 3070 graphics card.',
      location: 'Los Angeles, CA',
      timeAgo: '1 week ago',
      image: '/api/placeholder/300/200',
      categoryIcon: 'Electronics'
    },
    {
      id: 3,
      name: 'Vintage Bike',
      price: 250,
      category: 'Vehicles',
      description: 'Classic vintage bicycle in good working condition.',
      location: 'Chicago, IL',
      timeAgo: '3 days ago',
      image: '/api/placeholder/300/200',
      categoryIcon: 'Vehicles'
    },
    {
      id: 4,
      name: 'Sofa Set',
      price: 450,
      category: 'Furniture',
      description: 'Comfortable 3-piece sofa set, barely used.',
      location: 'Houston, TX',
      timeAgo: '5 days ago',
      image: '/api/placeholder/300/200',
      categoryIcon: 'Furniture'
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
    productCardHover: {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
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
                      {product.categoryIcon.charAt(0)}
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