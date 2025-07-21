import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Header from './components/Header';
import Home from './Pages/Home';
import CategoriesPage from './Pages/Category';
import Cart from './Pages/Cart';
import CreateProducts from './Pages/CreateProduct';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import ProfilePage from './Pages/Profile';
import About from './Pages/About';

const Layout = ({ children, isLoggedIn, handleLogout }) => {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideHeader && <Header isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
      {children}
    </>
  );
};

const AppWrapper = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setIsLoggedIn(!!storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/login'; // Or use navigate('/') if you want
  };

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/create" element={<CreateProducts />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppWrapper;
