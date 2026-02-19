import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// --- COMPONENT IMPORTS ---
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// --- PAGE IMPORTS ---
import Home from './pages/Home';
import Sermons from './pages/Sermons';
import Events from './pages/Events';
import Give from './pages/Give';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

// --- SECURITY GUARD ---
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" />;
};

// --- LAYOUT HELPER (The "Brain") ---
// This component checks the URL to decide if we show the Nav/Footer
const Layout = () => {
  const location = useLocation();
  
  // Check if the current page is the Login page
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="d-flex flex-column min-vh-100">
      
      {/* 1. Only show Navigation if NOT on Login page */}
      {!isLoginPage && <Navigation />}
      
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/events" element={<Events />} />
          <Route path="/give" element={<Give />} />
          
          {/* LOGIN ROUTE */}
          <Route path="/login" element={<Login />} />

          {/* ADMIN ROUTE */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>

      {/* 2. Only show Footer if NOT on Login page */}
      {!isLoginPage && <Footer />} 
      
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;