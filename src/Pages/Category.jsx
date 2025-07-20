import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Eye, Grid, List, MapPin, Clock, ArrowLeft, Star, MessageCircle, Shield, Truck, RotateCcw } from 'lucide-react';

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category mapping to match your backend categories
  const categories = [
    { id: 'all', name: 'All', icon: '🏪', count: 0, color: '#1e293b' },
    { id: 'electronics', name: 'electronics', icon: '📱', count: 0, color: '#3b82f6' },
    { id: 'clothing', name: 'clothing', icon: '👕', count: 0, color: '#8b5cf6' },
    { id: 'home', name: 'home', icon: '🏡', count: 0, color: '#84cc16' },
    { id: 'sports', name: 'sports', icon: '⚽', count: 0, color: '#06b6d4' },
    { id: 'books', name: 'books', icon: '📚', count: 0, color: '#10b981' },
    { id: 'other', name: 'other', icon: '🏷️', count: 0, color: '#f59e0b' }
  ];

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Transform API data to match component structure
      const transformedProducts = data.map(product => ({
        id: product.id,
        name: product.title,
        price: product.price || 0,
        originalPrice: product.price ? Math.round(product.price * 1.2) : 0, // Simulate original price
        category: product.category || 'other',
        description: product.description || 'No description available',
        fullDescription: product.description || 'No detailed description available for this product.',
        location: product.location || 'Location not specified',
        timeAgo: 'Recently posted', // You can calculate this if you have createdAt field
        categoryIcon: getCategoryIcon(product.category),
        condition: product.condition || 'Good',
        brand: 'Brand not specified',
        model: product.title,
        storage: 'N/A',
        color: 'Not specified',
        seller: 'Seller', // You'll need to get this from user data
        sellerRating: 4.5,
        sellerReviews: Math.floor(Math.random() * 100) + 10,
        images: [getCategoryIcon(product.category), getCategoryIcon(product.category), getCategoryIcon(product.category)],
        features: ['High Quality', 'Well Maintained', 'Fast Delivery', 'Verified Seller'],
        specifications: {
          'Condition': product.condition || 'Good',
          'Category': product.category || 'Other',
          'Location': product.location || 'Not specified',
          'Price': `$${product.price || 0}`,
          'Contact': product.email || product.number || 'Contact via platform'
        },
        email: product.email,
        phone: product.number,
        message: product.message,
        image: product.image
      }));
      
      setProducts(transformedProducts);
      updateCategoryCounts(transformedProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'electronics': '📱',
      'clothing': '👕',
      'home': '🏡',
      'sports': '⚽',
      'books': '📚',
      'other': '🏷️'
    };
    return iconMap[category] || '🏷️';
  };

  const updateCategoryCounts = (productList) => {
    const counts = {};
    productList.forEach(product => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    
    categories.forEach(cat => {
      if (cat.id === 'all') {
        cat.count = productList.length;
      } else {
        cat.count = counts[cat.name] || 0;
      }
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const handleBackToCategories = () => {
    setSelectedProduct(null);
  };

  const formatPrice = (price) => {
    return price ? `$${parseFloat(price).toFixed(2)}` : 'Price not set';
  };

  // Product Details Page Component
  const ProductDetailsPage = ({ product }) => (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button 
            onClick={handleBackToCategories}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <ArrowLeft size={16} />
            Back to Categories
          </button>
          <button 
            onClick={() => toggleFavorite(product.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: favorites.has(product.id) ? '#fee2e2' : '#f1f5f9',
              color: favorites.has(product.id) ? '#dc2626' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Heart size={16} fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
            {favorites.has(product.id) ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>

        {/* Product Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          padding: '40px'
        }}>
          {/* Left Column - Images */}
          <div>
            <div style={{
              aspectRatio: '1',
              background: product.image ? 
                `url(http://localhost:8080${product.image}) center/cover` : 
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              {!product.image && (
                <div style={{
                  textAlign: 'center',
                  color: 'white'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '10px' }}>
                    {product.categoryIcon}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>
                    {product.name}
                  </div>
                </div>
              )}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px'
            }}>
              {product.images.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  style={{
                    aspectRatio: '1',
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    transition: 'border-color 0.2s'
                  }}
                >
                  {img}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#eff6ff',
              color: '#2563eb',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '16px'
            }}>
              <span>{product.categoryIcon}</span>
              <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
            </div>

            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              {product.name}
            </h1>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <span style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#059669'
              }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span style={{
                    fontSize: '18px',
                    color: '#64748b',
                    textDecoration: 'line-through'
                  }}>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span style={{
                    background: '#dcfce7',
                    color: '#16a34a',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#64748b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} />
                <span>{product.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} />
                <span>{product.timeAgo}</span>
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#e2e8f0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    👤
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: '0 0 4px 0'
                    }}>
                      {product.seller}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < Math.floor(product.sellerRating) ? '#fbbf24' : 'none'}
                            color={i < Math.floor(product.sellerRating) ? '#fbbf24' : '#e5e7eb'}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {product.sellerRating} ({product.sellerReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <MessageCircle size={16} />
                  Contact Seller
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                Description
              </h3>
              <p style={{
                color: '#64748b',
                lineHeight: '1.6',
                margin: 0
              }}>
                {product.fullDescription}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                Key Features
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px'
              }}>
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#64748b'
                    }}
                  >
                    <span style={{
                      color: '#059669',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      ✓
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                Details
              </h3>
              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '8px'
              }}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid #e2e8f0',
                      fontSize: '14px'
                    }}
                  >
                    <span style={{ color: '#64748b', fontWeight: '500' }}>{key}:</span>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            {(product.email || product.phone) && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '12px'
                }}>
                  Contact Information
                </h3>
                <div style={{
                  background: '#f0f9ff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e0f2fe'
                }}>
                  {product.email && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: product.phone ? '8px' : '0',
                      fontSize: '14px',
                      color: '#0369a1'
                    }}>
                      📧 {product.email}
                    </div>
                  )}
                  {product.phone && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#0369a1'
                    }}>
                      📞 {product.phone}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ecfdf5',
                color: '#047857',
                padding: '8px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <Shield size={14} />
                Buyer Protection
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#eff6ff',
                color: '#2563eb',
                padding: '8px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <Truck size={14} />
                Fast Delivery
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#fef3c7',
                color: '#d97706',
                padding: '8px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                <RotateCcw size={14} />
                30-Day Returns
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                background: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                <ShoppingCart size={20} />
                Contact - {formatPrice(product.price)}
              </button>
              <button style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                background: 'white',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                <MessageCircle size={20} />
                Make Offer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // If a product is selected, show details page
  if (selectedProduct) {
    return <ProductDetailsPage product={selectedProduct} />;
  }

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: '18px',
        color: '#64748b'
      }}>
        Loading products...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', color: '#ef4444', marginBottom: '16px' }}>
          Error: {error}
        </div>
        <button
          onClick={fetchProducts}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Main Categories Page
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '10px'
          }}>
            Browse Categories
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#64748b'
          }}>
            Find exactly what you're looking for in our organized categories
          </p>
        </div>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          maxWidth: '500px',
          margin: '0 auto 40px auto'
        }}>
          <Search
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b'
            }}
            size={20}
          />
          <input
            type="text"
            placeholder="Search in categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Categories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              style={{
                background: selectedCategory === category.name ? '#3b82f6' : 'white',
                color: selectedCategory === category.name ? 'white' : '#1e293b',
                border: `2px solid ${selectedCategory === category.name ? '#3b82f6' : '#e2e8f0'}`,
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '32px',
                marginBottom: '8px'
              }}>
                {category.icon}
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '4px',
                textTransform: 'capitalize'
              }}>
                {category.name}
              </div>
              <div style={{
                fontSize: '14px',
                opacity: 0.7
              }}>
                {category.count} items
              </div>
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>🏪</span>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0,
                textTransform: 'capitalize'
              }}>
                {selectedCategory}
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0
              }}>
                {filteredProducts.length} items found
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '10px',
                background: viewMode === 'grid' ? '#3b82f6' : '#f1f5f9',
                color: viewMode === 'grid' ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '10px',
                background: viewMode === 'list' ? '#3b82f6' : '#f1f5f9',
                color: viewMode === 'list' ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '12px',
            color: '#64748b'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
            gap: '20px'
          }}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  display: viewMode === 'list' ? 'flex' : 'block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Product Image */}
                <div style={{
                  width: viewMode === 'list' ? '200px' : '100%',
                  height: viewMode === 'list' ? '150px' : '250px',
                  background: product.image ? 
                    `url(http://localhost:8080${product.image}) center/cover` : 
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  flexShrink: 0
                }}>
                  {!product.image && (
                    <div style={{
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                        {product.categoryIcon}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>
                        {product.name}
                      </div>
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '36px',
                      height: '36px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Heart 
                      size={16} 
                      fill={favorites.has(product.id) ? '#ef4444' : 'none'}
                      color={favorites.has(product.id) ? '#ef4444' : '#64748b'}
                    />
                  </button>
                </div>

                {/* Product Details */}
                <div style={{
                  padding: '20px',
                  flex: 1
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {product.category}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '8px',
                    lineHeight: '1.3'
                  }}>
                    {product.name}
                  </h3>

                  <p style={{
                    color: '#64748b',
                    fontSize: '14px',
                    marginBottom: '12px',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    <MapPin size={14} />
                    <span>{product.location}</span>
                    <span>•</span>
                    <Clock size={14} />
                    <span>{product.timeAgo}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#059669'
                      }}>
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span style={{
                          fontSize: '14px',
                          color: '#64748b',
                          textDecoration: 'line-through'
                        }}>
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span style={{
                        background: '#dcfce7',
                        color: '#16a34a',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(product);
                      }}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                      onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart functionality
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px',
                        background: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#047857'}
                      onMouseLeave={(e) => e.target.style.background = '#059669'}
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;