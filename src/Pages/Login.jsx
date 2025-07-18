import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', formData);
  };

  return (
    <div className="login-container">
      {/* Main Content */}
      <main className="login-main">
        <div className="login-wrapper">
          <div className="login-left">
            <div className="login-hero">
              <h1 className="hero-title">Welcome Back</h1>
              <p className="hero-subtitle">
                Sign in to your SwapNest account and continue your marketplace journey
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Quick and secure login</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Your data is protected</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>Personalized experience</span>
                </div>
              </div>
            </div>
          </div>

          <div className="login-right">
            <div className="login-form-container">
              <div className="login-header-text">
                <h2>Sign In</h2>
                <p>Access your SwapNest account</p>
              </div>

              <div className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    {/* <span className="checkmark"></span> */}
                    Remember me
                  </label>
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>

                <button className="login-submit-btn" onClick={handleSubmit}>
                  Sign In
                </button>

                {/* <div className="auth-divider">
                  <span>or</span>
                </div>

                <div className="social-login">
                  <button type="button" className="social-btn google-btn">
                    <span className="social-icon">🔍</span>
                    Continue with Google
                  </button>
                  <button type="button" className="social-btn facebook-btn">
                    <span className="social-icon">📘</span>
                    Continue with Facebook
                  </button>
                </div> */}

                <p className="auth-switch">
                    Don't have an account?
                    <Link to="/signup" className="switch-link">Sign Up</Link>
                </p>

              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Login;