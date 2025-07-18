import React, { useState } from 'react';
import { Search, Heart, ShoppingCart, Eye, Grid, List, MapPin, Clock, ArrowLeft, Star, MessageCircle, Shield, Truck, RotateCcw } from 'lucide-react';
import './Categories.css';

const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = [
    { id: 'all', name: 'All', icon: '🏪', count: 156, color: '#1e293b' },
    { id: 'electronics', name: 'Electronics', icon: '📱', count: 45, color: '#3b82f6' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗', count: 23, color: '#ef4444' },
    { id: 'furniture', name: 'Furniture', icon: '🪑', count: 34, color: '#f59e0b' },
    { id: 'fashion', name: 'Fashion', icon: '👕', count: 28, color: '#8b5cf6' },
    { id: 'books', name: 'Books', icon: '📚', count: 12, color: '#10b981' },
    { id: 'sports', name: 'Sports', icon: '⚽', count: 14, color: '#06b6d4' },
    { id: 'home', name: 'Home & Garden', icon: '🏡', count: 19, color: '#84cc16' },
    { id: 'toys', name: 'Toys & Games', icon: '🎮', count: 16, color: '#f97316' },
    { id: 'health', name: 'Health & Beauty', icon: '💄', count: 8, color: '#ec4899' },
    { id: 'music', name: 'Music & Instruments', icon: '🎵', count: 7, color: '#6366f1' },
    { id: 'pets', name: 'Pets', icon: '🐕', count: 5, color: '#f59e0b' }
  ];

  const products = [
    {
      id: 1,
      name: 'iPhone 14 Pro Max',
      price: 899,
      originalPrice: 1099,
      category: 'Electronics',
      description: 'Excellent condition iPhone 14 Pro Max with original box.',
      fullDescription: 'This iPhone 14 Pro Max is in excellent condition with minimal signs of use. Includes original box, charging cable, and all accessories. The device has been well-maintained and features the latest iOS updates. Perfect for anyone looking for a premium smartphone experience.',
      location: 'New York, NY',
      timeAgo: '2 days ago',
      categoryIcon: '📱',
      condition: 'Excellent',
      brand: 'Apple',
      model: 'iPhone 14 Pro Max',
      storage: '256GB',
      color: 'Deep Purple',
      seller: 'John Smith',
      sellerRating: 4.8,
      sellerReviews: 127,
      images: ['📱', '📱', '📱', '📱'],
      features: ['Face ID', '5G Compatible', 'Wireless Charging', 'Water Resistant'],
      specifications: {
        'Display': '6.7-inch Super Retina XDR',
        'Processor': 'A16 Bionic chip',
        'Camera': '48MP Main + 12MP Ultra Wide',
        'Battery': 'Up to 29 hours video playback',
        'Storage': '256GB',
        'Color': 'Deep Purple'
      }
    },
    {
      id: 2,
      name: 'Gaming Laptop',
      price: 1200,
      originalPrice: 1599,
      category: 'Electronics',
      description: 'High-performance gaming laptop with RTX 3070.',
      fullDescription: 'Powerful gaming laptop perfect for gaming and professional work. Features the latest RTX 3070 graphics card, 16GB RAM, and 1TB SSD. Excellent cooling system and RGB keyboard. Ideal for gamers and content creators.',
      location: 'Los Angeles, CA',
      timeAgo: '1 week ago',
      categoryIcon: '📱',
      condition: 'Very Good',
      brand: 'ASUS',
      model: 'ROG Strix G15',
      storage: '1TB SSD',
      color: 'Black',
      seller: 'Tech Store LA',
      sellerRating: 4.9,
      sellerReviews: 89,
      images: ['💻', '💻', '💻', '💻'],
      features: ['RTX 3070', '16GB RAM', '144Hz Display', 'RGB Keyboard'],
      specifications: {
        'Display': '15.6-inch 144Hz FHD',
        'Processor': 'AMD Ryzen 7 5800H',
        'Graphics': 'NVIDIA RTX 3070',
        'Memory': '16GB DDR4',
        'Storage': '1TB NVMe SSD',
        'Weight': '2.3 kg'
      }
    },
    {
      id: 3,
      name: 'Vintage Bike',
      price: 250,
      originalPrice: 350,
      category: 'Vehicles',
      description: 'Classic vintage bicycle in good working condition.',
      fullDescription: 'Beautiful vintage bicycle from the 1980s. Recently serviced with new tires and brake pads. Perfect for city riding or as a collector\'s item. Unique design with original paint job.',
      location: 'Chicago, IL',
      timeAgo: '3 days ago',
      categoryIcon: '🚗',
      condition: 'Good',
      brand: 'Schwinn',
      model: 'Vintage Cruiser',
      storage: 'N/A',
      color: 'Blue',
      seller: 'Bike Enthusiast',
      sellerRating: 4.6,
      sellerReviews: 45,
      images: ['🚲', '🚲', '🚲', '🚲'],
      features: ['Vintage Design', 'New Tires', 'Serviced', 'Original Paint'],
      specifications: {
        'Frame': 'Steel Frame',
        'Wheel Size': '26 inches',
        'Gears': 'Single Speed',
        'Brakes': 'Coaster Brake',
        'Condition': 'Recently Serviced',
        'Year': '1980s'
      }
    },
    {
      id: 4,
      name: 'Modern Sofa',
      price: 450,
      originalPrice: 800,
      category: 'Furniture',
      description: 'Comfortable sectional sofa, barely used.',
      fullDescription: 'Stylish modern sectional sofa in excellent condition. Only used for 6 months in a pet-free, smoke-free home. Very comfortable with high-quality fabric. Perfect for living room or family room.',
      location: 'Houston, TX',
      timeAgo: '3 days ago',
      categoryIcon: '🪑',
      condition: 'Like New',
      brand: 'West Elm',
      model: 'Urban Sectional',
      storage: 'N/A',
      color: 'Gray',
      seller: 'Sarah Johnson',
      sellerRating: 4.7,
      sellerReviews: 23,
      images: ['🛋️', '🛋️', '🛋️', '🛋️'],
      features: ['Sectional Design', 'Pet-Free Home', 'Smoke-Free', 'High-Quality Fabric'],
      specifications: {
        'Material': 'Premium Fabric',
        'Dimensions': 'L: 84" x W: 36" x H: 32"',
        'Seating': '3-4 People',
        'Color': 'Charcoal Gray',
        'Condition': 'Like New',
        'Assembly': 'Required'
      }
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
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

  // Product Details Page Component
  const ProductDetailsPage = ({ product }) => (
    <div className="product-details-page">
      <div className="product-details-container">
        {/* Header */}
        <div className="product-details-header">
          <button onClick={handleBackToCategories} className="back-button">
            <ArrowLeft className="icon-small" />
            Back to Categories
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
                <div className="image-content">
                  <div className="category-icon-large">{product.categoryIcon}</div>
                  <div className="product-name">{product.name}</div>
                </div>
              </div>
            </div>
            <div className="thumbnail-grid">
              {product.images.map((img, index) => (
                <div key={index} className="thumbnail">
                  <span className="thumbnail-icon">{img}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="product-info">
            <div className="category-badge">
              <span>{product.categoryIcon}</span>
              <span>{product.category}</span>
            </div>

            <h1 className="product-title">{product.name}</h1>
            
            <div className="price-section">
              <span className="current-price">${product.price}</span>
              {product.originalPrice && (
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

            <div className="seller-info">
              <div className="seller-details">
                <div className="seller-avatar">
                  <span>👤</span>
                </div>
                <div className="seller-text">
                  <h3 className="seller-name">{product.seller}</h3>
                  <div className="seller-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`star ${i < Math.floor(product.sellerRating) ? 'star-filled' : ''}`} />
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

            <div className="description-section">
              <h3 className="section-title">Description</h3>
              <p className="description-text">{product.fullDescription}</p>
            </div>

            <div className="features-section">
              <h3 className="section-title">Key Features</h3>
              <div className="features-grid">
                {product.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="check-mark">✓</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="specifications-section">
              <h3 className="section-title">Specifications</h3>
              <div className="specs-list">
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
                <ShoppingCart className="icon-small" />
                Add to Cart - ${product.price}
              </button>
              <button className="make-offer-btn">
                <MessageCircle className="icon-small" />
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

  // Main Categories Page
  return (
    <div className="categories-page">
      <div className="categories-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Browse Categories</h1>
          <p className="page-subtitle">Find exactly what you're looking for in our organized categories</p>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search in categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`category-card ${selectedCategory === category.name ? 'category-active' : ''}`}
            >
              <div className="category-content">
                <div className="category-icon">{category.icon}</div>
                <div className="category-name">{category.name}</div>
                <div className="category-count">{category.count} items</div>
              </div>
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="results-header">
          <div className="results-info">
            <span className="results-icon">🏪</span>
            <div>
              <h2 className="results-title">{selectedCategory}</h2>
              <p className="results-count">{filteredProducts.length} items found</p>
            </div>
          </div>
          <div className="view-toggles">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-toggle ${viewMode === 'grid' ? 'toggle-active' : ''}`}
            >
              <Grid className="icon-small" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-toggle ${viewMode === 'list' ? 'toggle-active' : ''}`}
            >
              <List className="icon-small" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`products-grid ${viewMode === 'list' ? 'products-list' : ''}`}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={`product-card ${viewMode === 'list' ? 'product-list-item' : ''}`}>
              {/* Product Image */}
              <div className="product-image">
                <div className="product-category-tag">
                  <span>{product.categoryIcon}</span>
                  <span>{product.category}</span>
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="favorite-heart"
                >
                  <Heart className={`icon-small ${favorites.has(product.id) ? 'heart-filled' : ''}`} />
                </button>
                <div className="product-image-content">
                  <div className="product-image-placeholder">
                    <div className="product-image-icon">{product.categoryIcon}</div>
                    <div className="product-image-name">{product.name}</div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="product-details">
                <h3 className="product-card-title">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <p className="product-description">{product.description}</p>
                
                <div className="product-meta">
                  <div className="meta-item">
                    <MapPin className="meta-icon" />
                    <span>{product.location}</span>
                  </div>
                  <div className="meta-item">
                    <Clock className="meta-icon" />
                    <span>{product.timeAgo}</span>
                  </div>
                </div>

                <div className="product-actions">
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="view-details-btn"
                  >
                    <Eye className="icon-small" />
                    View Details
                  </button>
                  <button className="cart-btn">
                    <ShoppingCart className="icon-small" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;