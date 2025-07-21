import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Eye, Grid, List, MapPin, Clock, ArrowLeft, Star, MessageCircle, Shield, Truck, RotateCcw, Plus, Minus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import './Categories.css';

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState({});
  const [addToCartSuccess, setAddToCartSuccess] = useState({});
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All', icon: '🏪', count: 0, color: '#1e293b' },
    { id: 'electronics', name: 'electronics', icon: '📱', count: 0, color: '#3b82f6' },
    { id: 'clothing', name: 'clothing', icon: '👕', count: 0, color: '#8b5cf6' },
    { id: 'home', name: 'home', icon: '🏡', count: 0, color: '#84cc16' },
    { id: 'sports', name: 'sports', icon: '⚽', count: 0, color: '#06b6d4' },
    { id: 'books', name: 'books', icon: '📚', count: 0, color: '#10b981' },
    { id: 'other', name: 'other', icon: '🏷️', count: 0, color: '#f59e0b' }
  ]);

  const navigate = useNavigate();
  
  // For demo purposes - in real app, this would come from authentication
  const currentUserId = 1;

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/api/products');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched products:', data); // Debug log
      
      // Transform API data to match component structure
      const transformedProducts = data.map(product => ({
        id: product.id,
        name: product.title,
        price: product.price || 0,
        originalPrice: product.price ? Math.round(product.price * 1.2) : 0,
        category: product.category || 'other',
        description: product.description || 'No description available',
        fullDescription: product.description || 'No detailed description available for this product.',
        location: product.location || 'Location not specified',
        timeAgo: 'Recently posted',
        categoryIcon: getCategoryIcon(product.category),
        condition: product.condition || 'Good',
        brand: 'Brand not specified',
        model: product.title,
        storage: 'N/A',
        color: 'Not specified',
        seller: 'Seller',
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
        image: product.image ? (
          product.image.startsWith('http') ? product.image : 
          product.image.startsWith('/') ? `http://localhost:8080${product.image}` :
          `http://localhost:8080/${product.image}`
        ) : null,
        fallbackImage: product.image
      }));
      
      setProducts(transformedProducts);
      updateCategoryCounts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/${currentUserId}`);
      if (response.ok) {
        const cartData = await response.json();
        console.log('Fetched cart data:', cartData); // Debug log
        setCart(cartData);
      } else if (response.status === 404) {
        // Cart not found is normal for new users
        setCart([]);
      } else {
        console.warn('Failed to fetch cart:', response.status, response.statusText);
        setCart([]);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCart([]);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setCartLoading(prev => ({ ...prev, [productId]: true }));
      console.log('Adding to cart:', { userId: currentUserId, productId, quantity }); // Debug log
      
      // Try JSON format first
      const response = await fetch('http://localhost:8080/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          productId: productId,
          quantity: quantity
        })
      });

      console.log('Add to cart response:', response.status, response.statusText); // Debug log

      if (!response.ok) {
        // If JSON doesn't work, try form-encoded format
        if (response.status === 415 || response.status === 400) {
          const formResponse = await fetch('http://localhost:8080/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              userId: currentUserId.toString(),
              productId: productId.toString(),
              quantity: quantity.toString()
            })
          });
          
          if (!formResponse.ok) {
            const errorText = await formResponse.text();
            throw new Error(`Failed to add to cart: ${formResponse.status} ${errorText}`);
          }
        } else {
          const errorText = await response.text();
          throw new Error(`Failed to add to cart: ${response.status} ${errorText}`);
        }
      }

      await fetchCart(); // Refresh cart data
      
      // Show success animation
      setAddToCartSuccess(prev => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setAddToCartSuccess(prev => ({ ...prev, [productId]: false }));
      }, 2000);
      
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(`Failed to add product to cart: ${err.message}`);
    } finally {
      setCartLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const updateCartQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
      return;
    }
    
    try {
      console.log('Updating cart quantity:', { userId: currentUserId, productId, quantity: newQuantity }); // Debug log
      
      // Try JSON format first
      let response = await fetch('http://localhost:8080/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          productId: productId,
          quantity: newQuantity
        })
      });

      // If JSON doesn't work, try form-encoded format
      if (!response.ok && (response.status === 415 || response.status === 400)) {
        response = await fetch('http://localhost:8080/api/cart/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            userId: currentUserId.toString(),
            productId: productId.toString(),
            quantity: newQuantity.toString()
          })
        });
      }

      if (response.ok) {
        await fetchCart();
      } else {
        const errorText = await response.text();
        console.error('Failed to update cart:', response.status, errorText);
      }
    } catch (err) {
      console.error('Error updating cart:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      console.log('Removing from cart:', { userId: currentUserId, productId }); // Debug log
      
      // Try JSON format first
      let response = await fetch('http://localhost:8080/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          productId: productId
        })
      });

      // If JSON doesn't work, try form-encoded format
      if (!response.ok && (response.status === 415 || response.status === 400)) {
        response = await fetch('http://localhost:8080/api/cart/remove', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            userId: currentUserId.toString(),
            productId: productId.toString()
          })
        });
      }

      if (response.ok) {
        await fetchCart();
      } else {
        const errorText = await response.text();
        console.error('Failed to remove from cart:', response.status, errorText);
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const getCartQuantity = (productId) => {
    const cartItem = cart.find(item => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const isInCart = (productId) => {
    return cart.some(item => item.productId === productId);
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
    // Count products by category
    const counts = {};
    productList.forEach(product => {
      const category = product.category || 'other';
      counts[category] = (counts[category] || 0) + 1;
    });
    
    console.log('Category counts:', counts); // Debug log
    
    // Update categories state with new counts
    setCategories(prevCategories => 
      prevCategories.map(cat => {
        if (cat.id === 'all' || cat.name === 'All') {
          return { ...cat, count: productList.length };
        } else {
          return { ...cat, count: counts[cat.name] || 0 };
        }
      })
    );
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

  // Enhanced Image Component with error handling
  const ProductImage = ({ product, style, showFallback = true }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };

    const handleImageError = () => {
      setImageError(true);
      setImageLoaded(false);
    };

    if (!product.image || imageError) {
      return (
        <div style={{
          ...style,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}>
          {showFallback && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: style?.fontSize || '48px', marginBottom: '8px' }}>
                {product.categoryIcon}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', maxWidth: '150px' }}>
                {product.name}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div style={style}>
        {!imageLoaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px'
          }}>
            Loading...
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: imageLoaded ? 'block' : 'none'
          }}
        />
      </div>
    );
  };

  // Add to Cart Button Component
  const AddToCartButton = ({ product, style = {} }) => {
    const inCart = isInCart(product.id);
    const quantity = getCartQuantity(product.id);
    const isLoading = cartLoading[product.id];
    const showSuccess = addToCartSuccess[product.id];

    if (showSuccess) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: '#dcfce7',
          color: '#16a34a',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '500',
          ...style
        }}>
          <CheckCircle size={14} />
          Added!
        </div>
      );
    }

    if (inCart) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f3f4f6',
          borderRadius: '8px',
          ...style
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateCartQuantity(product.id, quantity - 1);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <Minus size={12} />
          </button>
          <span style={{
            padding: '0 12px',
            fontSize: '14px',
            fontWeight: '500',
            minWidth: '20px',
            textAlign: 'center'
          }}>
            {quantity}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateCartQuantity(product.id, quantity + 1);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              background: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <Plus size={12} />
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product.id);
        }}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: isLoading ? '#9ca3af' : '#059669',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '12px',
          fontWeight: '500',
          ...style
        }}
      >
        <ShoppingCart size={14} />
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </button>
    );
  };

  // Cart Summary Component
  const CartSummary = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => {
      // Find the product to get the current price
      const product = products.find(p => p.id === item.productId);
      const price = product ? product.price : item.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    if (totalItems === 0) return null;

    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e2e8f0',
        minWidth: '250px',
        zIndex: 1000
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            background: '#3b82f6',
            borderRadius: '50%',
            color: 'white'
          }}>
            <ShoppingCart size={20} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
              Shopping Cart
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              {totalItems} item{totalItems !== 1 ? 's' : ''} • ${totalPrice.toFixed(2)}
            </div>
          </div>
        </div>
        <button style={{
          width: '100%',
          padding: '12px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
        onClick={() => navigate('/cart')} >
          View Cart
        </button>
      </div>
    );
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
            <ProductImage
              product={product}
              style={{
                aspectRatio: '1',
                borderRadius: '12px',
                marginBottom: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}
              showFallback={true}
            />
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

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                Specifications
              </h3>
              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: '#f8fafc',
                      borderRadius: '8px'
                    }}
                  >
                    <span style={{
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      {key}
                    </span>
                    <span style={{
                      color: '#64748b'
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                Key Features
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#059669'
                    }}
                  >
                    <CheckCircle size={16} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              paddingTop: '24px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <AddToCartButton 
                product={product}
                style={{ 
                  flex: 1,
                  justifyContent: 'center',
                  padding: '16px',
                  fontSize: '16px'
                }}
              />
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500'
              }}>
                <Eye size={18} />
                Quick View
              </button>
            </div>

            {/* Trust Indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '24px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#64748b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} />
                <span>Buyer Protection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={14} />
                <span>Fast Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RotateCcw size={14} />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#64748b', margin: 0 }}>Loading products...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#dc2626',
            fontSize: '24px'
          }}>
            ⚠️
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 8px 0'
          }}>
            Error Loading Products
          </h3>
          <p style={{
            color: '#64748b',
            margin: '0 0 24px 0',
            lineHeight: '1.5'
          }}>
            {error}
          </p>
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
      </div>
    );
  }

  // Show product details if selected
  if (selectedProduct) {
    return <ProductDetailsPage product={selectedProduct} />;
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
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Browse Products
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '16px',
            margin: 0
          }}>
            Discover amazing products from our community
          </p>
        </div>

        {/* Search and Filters */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Search Bar */}
          <div style={{
            position: 'relative',
            marginBottom: '20px'
          }}>
            <Search 
              size={20} 
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* View Mode Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: viewMode === 'grid' ? '#3b82f6' : '#f1f5f9',
                  color: viewMode === 'grid' ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <Grid size={16} />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: viewMode === 'list' ? '#3b82f6' : '#f1f5f9',
                  color: viewMode === 'list' ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <List size={16} />
                List
              </button>
            </div>
            <div style={{
              color: '#64748b',
              fontSize: '14px'
            }}>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: selectedCategory === category.name ? category.color : 'white',
                color: selectedCategory === category.name ? 'white' : category.color,
                border: `2px solid ${category.color}`,
                borderRadius: '24px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '18px' }}>{category.icon}</span>
              <span style={{ textTransform: 'capitalize' }}>{category.name}</span>
              <span style={{
                background: selectedCategory === category.name ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '12px'
              }}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '12px',
            color: '#64748b'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '16px',
              opacity: '0.5'
            }}>
              📦
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 8px 0'
            }}>
              No products found
            </h3>
            <p style={{ margin: 0 }}>
              {searchQuery ? 
                `No products match "${searchQuery}" in ${selectedCategory === 'All' ? 'any category' : selectedCategory}` :
                `No products available in ${selectedCategory === 'All' ? 'any category' : selectedCategory}`
              }
            </p>
          </div>
        ) : (
          <div style={{
            display: viewMode === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'none',
            flexDirection: viewMode === 'list' ? 'column' : 'none',
            gap: '20px'
          }}>
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => handleViewDetails(product)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
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
                {viewMode === 'grid' ? (
                  <>
                    <ProductImage
                      product={product}
                      style={{
                        aspectRatio: '1',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      showFallback={true}
                    />
                    <div style={{ padding: '16px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1e293b',
                          margin: 0,
                          lineHeight: '1.3',
                          flex: 1
                        }}>
                          {product.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            color: favorites.has(product.id) ? '#dc2626' : '#9ca3af',
                            marginLeft: '8px'
                          }}
                        >
                          <Heart 
                            size={18} 
                            fill={favorites.has(product.id) ? 'currentColor' : 'none'} 
                          />
                        </button>
                      </div>
                      
                      <p style={{
                        color: '#64748b',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        margin: '0 0 12px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
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
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        <MapPin size={12} />
                        <span>{product.location}</span>
                        <span>•</span>
                        <Clock size={12} />
                        <span>{product.timeAgo}</span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#059669'
                          }}>
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span style={{
                              fontSize: '14px',
                              color: '#9ca3af',
                              textDecoration: 'line-through'
                            }}>
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <AddToCartButton product={product} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <ProductImage
                      product={product}
                      style={{
                        width: '200px',
                        aspectRatio: '1',
                        flexShrink: 0,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      showFallback={true}
                    />
                    <div style={{
                      padding: '20px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            marginBottom: '8px'
                          }}>
                            <span>{product.categoryIcon}</span>
                            <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
                          </div>
                          <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#1e293b',
                            margin: '0 0 8px 0',
                            lineHeight: '1.3'
                          }}>
                            {product.name}
                          </h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            color: favorites.has(product.id) ? '#dc2626' : '#9ca3af',
                            marginLeft: '16px'
                          }}
                        >
                          <Heart 
                            size={20} 
                            fill={favorites.has(product.id) ? 'currentColor' : 'none'} 
                          />
                        </button>
                      </div>

                      <p style={{
                        color: '#64748b',
                        fontSize: '15px',
                        lineHeight: '1.5',
                        margin: '0 0 16px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: '3',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {product.description}
                      </p>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} />
                          <span>{product.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} />
                          <span>{product.timeAgo}</span>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <span style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#059669'
                          }}>
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <>
                              <span style={{
                                fontSize: '16px',
                                color: '#9ca3af',
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
                        <AddToCartButton 
                          product={product}
                          style={{ fontSize: '14px', padding: '10px 16px' }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary */}
      <CartSummary />

      {/* CSS for animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default CategoriesPage;