import React, { useState } from 'react';
import { Heart, Grid, List, Star, MapPin, Calendar, Package } from 'lucide-react';
import './Profile.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('listings');
  const [viewMode, setViewMode] = useState('grid');

  const userListings = [
    {
      id: 1,
      title: 'MacBook Pro 16-inch',
      price: 1899,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop',
      status: 'active',
      views: 45,
      likes: 12
    },
    {
      id: 2,
      title: 'Vintage Camera',
      price: 320,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop',
      status: 'sold',
      views: 23,
      likes: 8
    },
    {
      id: 3,
      title: 'Designer Jacket',
      price: 150,
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=200&fit=crop',
      status: 'active',
      views: 67,
      likes: 19
    },
    {
      id: 4,
      title: 'Coffee Table',
      price: 280,
      category: 'Furniture',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      status: 'pending',
      views: 34,
      likes: 6
    }
  ];

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
        <img src={item.image} alt={item.title} className="product-image1" />
        {!isFavorite && (
          <span className={`status-badge status-${item.status}`}>
            {item.status}
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
            <span>👁️ {item.views}</span>
            <span>❤️ {item.likes}</span>
          </div>
        )}
        
        {isFavorite && (
          <p className="seller-info">by {item.seller}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-info">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face"
            alt="Profile"
            className="profile-avatar"
          />
          <div className="profile-details">
            <h2 className="profile-name">Alex Johnson</h2>
            <div className="profile-meta">
              <span className="rating">
                <Star size={16} fill="#ffd700" />
                4.8 (127 reviews)
              </span>
              <span className="location">
                <MapPin size={16} />
                New York, NY
              </span>
              <span className="join-date">
                <Calendar size={16} />
                Joined March 2023
              </span>
            </div>
            <p className="profile-bio">
              Tech enthusiast and collector. Selling quality electronics and vintage items. 
              Fast shipping and excellent customer service guaranteed!
            </p>
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-number">47</span>
            <span className="stat-label">Items Sold</span>
          </div>
          <div className="stat">
            <span className="stat-number">12</span>
            <span className="stat-label">Active Listings</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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

      {/* Content Section */}
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
            userListings.map(item => (
              <ProductCard key={item.id} item={item} />
            ))
          }
          {activeTab === 'favorites' && 
            favoriteItems.map(item => (
              <ProductCard key={item.id} item={item} isFavorite={true} />
            ))
          }
        </div>
      </div>


    </div>
  );
};

export default ProfilePage;