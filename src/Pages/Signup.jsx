import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    // firstName: '',
    // lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions!');
      return;
    }
    console.log('Signup:', formData);
  };

  return (
    <div className="signup-container">
      {/* Main Content */}
      <main className="signup-main">
        <div className="signup-wrapper">
          <div className="signup-left">
            <div className="signup-hero">
              <h1 className="hero-title">Join SwapNest</h1>
              <p className="hero-subtitle">
                Create your account and start buying and selling with confidence
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <span className="feature-icon">🚀</span>
                  <span>Quick setup process</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌟</span>
                  <span>Access to premium features</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🤝</span>
                  <span>Join trusted community</span>
                </div>
              </div>
            </div>
          </div>

          <div className="signup-right">
            <div className="signup-form-container">
              <div className="signup-header-text">
                <h2>Create Account</h2>
                <p>Start your SwapNest journey today</p>
              </div>

              <div className="signup-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">User Name</label>
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your User Name"
                    />
                  </div>
                  {/* <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your last name"
                    />
                  </div> */}
                </div>

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
                  <div className="password-requirements">
                    <small>Password must be at least 8 characters long</small>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      required
                    />
                    {/* <span className="checkmark"></span> */}
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </label>
                </div>

                <button className="signup-submit-btn" onClick={handleSubmit}>
                  Create Account
                </button>

                {/* <div className="auth-divider">
                  <span>or</span>
                </div> */}

                {/* <div className="social-login">
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
                  Already have an account?
                   <Link to="/login" className="switch-link">Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;