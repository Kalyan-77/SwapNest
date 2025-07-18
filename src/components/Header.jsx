import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      {/* Left: Logo */}
      <div className="header-left">
        <div className="logo-box">SN</div>
        <span className="logo-text">SwapNest</span>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/about">About</Link>
        </nav>
      </div>

      {/* Center: Search */}
      <div className="search-box">
        <input type="text" placeholder="Search products..." />
        <button>🔍</button>
      </div>

      {/* Right: Sell, Cart, Profile, Login */}
      <div className="header-right">
        <Link to="/create" className="sell-btn">➕ Sell</Link>
        <Link to="/cart" className="icon">🛒</Link>
        <Link to="/profile" className="icon">👤</Link>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </header>
  );
};

export default Header;
