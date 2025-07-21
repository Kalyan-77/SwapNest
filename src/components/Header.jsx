import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ isLoggedIn, handleLogout }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-box">SN</div>
        <span className="logo-text">SwapNest</span>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/about">About</Link>
        </nav>
      </div>

      <div className="search-box">
        <input type="text" placeholder="Search products..." />
        <button>🔍</button>
      </div>

      <div className="header-right">
        <Link to="/create" className="sell-btn">➕ Sell</Link>
        <Link to="/cart" className="icon">🛒</Link>
        <Link to="/profile" className="icon">👤</Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="login-btn">
            Logout
          </button>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
