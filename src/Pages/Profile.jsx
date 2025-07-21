import React, { useState, useEffect } from 'react';
import { Heart, Grid, List, Star, MapPin, Calendar, Package } from 'lucide-react';
import './Profile.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [viewMode, setViewMode] = useState('grid');
  const [user, setUser] = useState(null);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      fetch(`http://localhost:8080/api/products/user/${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setUserListings(data);
          } else {
            setUserListings([]);
          }
        })
        .catch(() => setUserListings([]));
    }
  }, []);

  const favoriteItems = [
    {
      id: 5,
      title: 'Gaming Chair',
      price: 450,
      category: 'Furniture',
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300&h=200&fit=crop',
      seller: 'TechGuru99'
    },
    {
      id: 6,
      title: 'Wireless Headphones',
      price: 89,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
      seller: 'AudioLover'
    }
  ];

  const ProductCard = ({ item, isFavorite = false }) => (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={isFavorite ? item.image : `http://localhost:8080${item.image}`}
          alt={item.title}
          className="product-image1"
        />
        {!isFavorite && (
          <span className={`status-badge status-${item.status || 'active'}`}>
            {item.status || 'active'}
          </span>
        )}
        <button className="favorite-btn">
          <Heart className="heart-icon" fill="#e74c3c" />
        </button>
      </div>

      <div className="product-info">
        <div className="category-tag">
          {item.category === 'Electronics' && '📱'}
          {item.category === 'Fashion' && '👕'}
          {item.category === 'Furniture' && '🪑'}
          {item.category === 'Vehicles' && '🚗'}
          <span>{item.category}</span>
        </div>
        <h3 className="product-title">{item.title}</h3>
        <p className="product-price">${item.price}</p>
        {!isFavorite && (
          <div className="product-stats">
            <span>👁️ {item.views || 0}</span>
            <span>❤️ {item.likes || 0}</span>
          </div>
        )}
        {isFavorite && <p className="seller-info">by {item.seller}</p>}
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/000/439/863/small/Basic_Ui__28186_29.jpg"
            alt="Profile"
            className="profile-avatar"
          />
          <div className="profile-details">
            <h2 className="profile-name">{user?.username || "Guest User"}</h2>
            <div className="profile-meta">
              <span className="rating">
                <Star size={16} fill="#ffd700" />
                4.8 (127 reviews)
              </span>
              <span className="location">
                <MapPin size={16} />
                {user?.location || "London"}
              </span>
              <span className="join-date">
                <Calendar size={16} />
                Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              </span>
            </div>
            <p className="profile-bio">
              Email: {user?.email || "No email found"}
            </p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <span className="stat-number">{userListings.length}</span>
            <span className="stat-label">Active Listings</span>
          </div>
          {/* <div className="stat">
            <span className="stat-number">47</span>
            <span className="stat-label">Items Sold</span>
          </div> */}
        </div>
      </div>

      <div className="profile-nav">
        <button
          className={`nav-tab ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          <Package size={18} />
          My Listings
        </button>
        <button
          className={`nav-tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Heart size={18} />
          Favorites
        </button>
      </div>

      <div className="profile-content">
        <div className="content-header">
          <h3 className="section-title">
            {activeTab === 'listings' ? 'My Listings' : 'Favorite Items'}
            ({activeTab === 'listings' ? userListings.length : favoriteItems.length})
          </h3>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className={`products-grid ${viewMode}`}>
          {activeTab === 'listings' &&
            userListings.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          {activeTab === 'favorites' &&
            favoriteItems.map((item) => (
              <ProductCard key={item.id} item={item} isFavorite={true} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
