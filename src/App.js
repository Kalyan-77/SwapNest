import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CategoriesPage from './Pages/Category';
import Cart from './Pages/Cart';
import CreateProducts from './Pages/CreateProduct';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Header from './components/Header';
import Home from './Pages/Home';
import ProfilePage from './Pages/Profile';
import About from './Pages/About';


const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeader = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/create" element={<CreateProducts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path='/about' element={<About/>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
