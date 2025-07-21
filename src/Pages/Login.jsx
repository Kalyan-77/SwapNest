import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      console.log("Login Success:", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));

      alert("Login successful!");
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <main className="login-main">
        <div className="login-wrapper">
          <div className="login-left">
            <div className="login-hero">
              <h1 className="hero-title">Welcome Back</h1>
              <p className="hero-subtitle">
                Sign in to your SwapNest account and continue your marketplace journey
              </p>
            </div>
          </div>

          <div className="login-right">
            <div className="login-form-container">
              <div className="login-header-text">
                <h2>Sign In</h2>
                <p>Access your SwapNest account</p>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
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

                <button type="submit" className="login-submit-btn">
                  Sign In
                </button>

                <p className="auth-switch">
                  Don't have an account?
                  <Link to="/signup" className="switch-link">Sign Up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
