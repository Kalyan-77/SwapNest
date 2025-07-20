import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/users', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      alert('Registration successful!');
      navigate('/login'); // redirect to login page
    } catch (error) {
      console.error('Error:', error);
      alert('Registration failed.');
    }
  };

  return (
    <div className="signup-container">
      <main className="signup-main">
        <div className="signup-wrapper">
          <div className="signup-left">
            <div className="signup-hero">
              <h1 className="hero-title">Join SwapNest</h1>
              <p className="hero-subtitle">
                Create your account and start buying and selling with confidence
              </p>
              <div className="hero-features">
                <div className="feature-item">🚀 Quick setup process</div>
                <div className="feature-item">🌟 Access to premium features</div>
                <div className="feature-item">🤝 Join trusted community</div>
              </div>
            </div>
          </div>

          <div className="signup-right">
            <div className="signup-form-container">
              <h2>Create Account</h2>
              <p>Start your SwapNest journey today</p>

              <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>User Name</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                    />
                    I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
                  </label>
                </div>

                <button className="signup-submit-btn" type="submit">
                  Create Account
                </button>
              </form>

              <p className="auth-switch">
                Already have an account?
                <Link to="/login" className="switch-link">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
