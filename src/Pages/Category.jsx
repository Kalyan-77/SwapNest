import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Eye, Grid, List, MapPin, Clock, ArrowLeft, Star, MessageCircle, Shield, Truck, RotateCcw, Plus, Minus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import './Categories.css'; // Assuming you might have this CSS file

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

  const navigate = useNavigate();

  // For demo purposes - in real app, this would come from authentication
  const currentUserId = 1;

  // Category mapping initialized as state
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All', icon: '🏪', count: 0, color: '#1e293b' },
    { id: 'electronics', name: 'electronics', icon: '📱', count: 0, color: '#3b82f6' },
    { id: 'clothing', name: 'clothing', icon: '👕', count: 0, color: '#8b5cf6' },
    { id: 'home', name: 'home', icon: '🏡', count: 0, color: '#84cc16' },
    { id: 'sports', name: 'sports', icon: '⚽', count: 0, color: '#06b6d4' },
    { id: 'books', name: 'books', icon: '📚', count: 0, color: '#10b981' },
    { id: 'other', name: 'other', icon: '🏷️', count: 0, color: '#f59e0b' }
  ]);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // --- API Calls ---
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
        category: product.category ? product.category.toLowerCase() : 'other', // Ensure lowercase for consistent matching
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

  // --- Helper Functions ---
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
    return iconMap[category ? category.toLowerCase() : 'other'] || '🏷️';
  };

  const updateCategoryCounts = (productList) => {
    const counts = {};
    productList.forEach(product => {
      const category = product.category || 'other'; // Ensure category is lowercase here too
      counts[category] = (counts[category] || 0) + 1;
    });

    console.log('Category counts:', counts); // Debug log

    setCategories(prevCategories =>
      prevCategories.map(cat => {
        if (cat.id === 'all' || cat.name === 'All') {
          return { ...cat, count: productList.length };
        } else {
          // Use cat.id as the key for matching with counts
          return { ...cat, count: counts[cat.id] || 0 };
        }
      })
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    // Match based on product.category (already lowercased in transformation) or 'All'
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory.toLowerCase();
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

  // --- Components ---

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
                      padding: '8px 12px',
                      background: '#f0fdf4',
                      color: '#16a34a',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    <CheckCircle size={16} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                Specifications
              </h3>
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      padding: '12px 16px',
                      borderBottom: index < Object.entries(product.specifications).length - 1 ? '1px solid #e2e8f0' : 'none'
                    }}
                  >
                    <span style={{
                      flex: '1',
                      fontWeight: '500',
                      color: '#475569'
                    }}>
                      {key}
                    </span>
                    <span style={{
                      flex: '1',
                      color: '#1e293b'
                    }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <AddToCartButton
                product={product}
                style={{
                  flex: 1,
                  fontSize: '16px',
                  padding: '14px 20px',
                  justifyContent: 'center'
                }}
              />
              <button style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 20px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                flex: 1,
                gap: '8px'
              }}>
                <Eye size={16} />
                Quick View
              </button>
            </div>
            {/* End of the provided JSX */}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      fontFamily: '"Inter", sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      color: '#334155',
    }}>
      {selectedProduct ? (
        <ProductDetailsPage product={selectedProduct} />
      ) : (
        <>
          {/* Header */}
          <header style={{
            backgroundColor: 'white',
            borderBottom: '1px solid #e2e8f0',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>Categories</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '10px 12px 10px 40px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    width: '250px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
              <button style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center'
              }}>
                <ShoppingCart size={24} />
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}> {/* Adjust 65px based on header height */}
            {/* Sidebar for Categories */}
            <aside style={{
              width: '250px',
              backgroundColor: 'white',
              borderRight: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '2px 0 4px rgba(0,0,0,0.02)',
              flexShrink: 0
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '1px solid #f1f5f9'
              }}>
                Product Categories
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {categories.map(category => (
                  <li key={category.id} style={{ marginBottom: '8px' }}>
                    <button
                      onClick={() => setSelectedCategory(category.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: selectedCategory === category.name ? category.color : 'none',
                        color: selectedCategory === category.name ? 'white' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: selectedCategory === category.name ? '600' : 'normal',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedCategory === category.name ? `0 4px 10px rgba(0,0,0,0.1)` : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategory !== category.name) {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.color = '#1e293b';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== category.name) {
                          e.currentTarget.style.backgroundColor = 'none';
                          e.currentTarget.style.color = '#475569';
                        }
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {category.icon}
                        <span style={{ textTransform: 'capitalize' }}>{category.name}</span>
                      </span>
                      <span style={{
                        backgroundColor: selectedCategory === category.name ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                        color: selectedCategory === category.name ? 'white' : '#64748b',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Product Display Area */}
            <main style={{ flexGrow: 1, padding: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                  {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Products`}
                </h2>
                {/* Search Bar above products */}
<div style={{
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: '20px'
}}>
  <div style={{ position: 'relative' }}>
    <Search size={18} color="#64748b" style={{
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)'
    }} />
    <input
      type="text"
      placeholder="Search products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{
        padding: '10px 12px 10px 40px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        width: '250px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s'
      }}
      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
      onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
    />
  </div>
</div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: viewMode === 'grid' ? '#3b82f6' : 'white',
                      color: viewMode === 'grid' ? 'white' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    
                    <Grid size={18} /> Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: viewMode === 'list' ? '#3b82f6' : 'white',
                      color: viewMode === 'list' ? 'white' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <List size={18} /> List
                  </button>
                </div>
              </div>

              {loading && <p style={{ textAlign: 'center', fontSize: '18px', color: '#64748b' }}>Loading products...</p>}
              {error && <p style={{ textAlign: 'center', fontSize: '18px', color: '#dc2626' }}>Error: {error}</p>}

              {!loading && !error && filteredProducts.length === 0 && (
                <p style={{ textAlign: 'center', fontSize: '18px', color: '#64748b' }}>No products found in this category or matching your search.</p>
              )}

              <div style={{
                display: viewMode === 'grid' ? 'grid' : 'block',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'none',
                gap: '20px'
              }}>
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      overflow: 'hidden',
                      display: viewMode === 'grid' ? 'flex' : 'flex',
                      flexDirection: viewMode === 'grid' ? 'column' : 'row',
                      alignItems: viewMode === 'list' ? 'center' : 'stretch',
                      marginBottom: viewMode === 'list' ? '15px' : '0',
                      transition: 'transform 0.2s ease-in-out',
                      cursor: 'pointer',
                      border: '1px solid #e2e8f0'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    onClick={() => handleViewDetails(product)}
                  >
                    <ProductImage
                      product={product}
                      style={{
                        width: viewMode === 'grid' ? '100%' : '180px',
                        height: viewMode === 'grid' ? '200px' : '150px',
                        flexShrink: 0,
                        position: 'relative',
                        borderRadius: viewMode === 'grid' ? '12px 12px 0 0' : '12px 0 0 12px',
                        overflow: 'hidden'
                      }}
                    />

                    <div style={{
                      padding: viewMode === 'grid' ? '15px' : '15px 20px',
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ marginBottom: viewMode === 'grid' ? '10px' : '0' }}>
                        <h3 style={{
                          fontSize: viewMode === 'grid' ? '18px' : '20px',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                          color: '#1e293b',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {product.name}
                        </h3>
                        <p style={{
                          fontSize: '13px',
                          color: '#64748b',
                          margin: '0 0 10px 0',
                          display: viewMode === 'grid' ? '-webkit-box' : 'block',
                          WebkitLineClamp: viewMode === 'grid' ? 2 : 'none',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {product.description}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: viewMode === 'grid' ? 'flex-end' : 'center',
                        marginTop: viewMode === 'grid' ? 'auto' : '0',
                        flexDirection: viewMode === 'grid' ? 'column' : 'row',
                        gap: viewMode === 'grid' ? '10px' : '20px',
                        width: '100%'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: viewMode === 'grid' ? '20px' : '24px', fontWeight: 'bold', color: '#059669' }}>
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span style={{ fontSize: '14px', color: '#64748b', textDecoration: 'line-through' }}>
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent opening product details
                              toggleFavorite(product.id);
                            }}
                            style={{
                              background: favorites.has(product.id) ? '#fee2e2' : '#f1f5f9',
                              color: favorites.has(product.id) ? '#dc2626' : '#64748b',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                              flexShrink: 0
                            }}
                          >
                            <Heart size={18} fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
                          </button>
                          <AddToCartButton product={product} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
          <CartSummary />
        </>
      )}
    </div>
  );
};

export default CategoriesPage;