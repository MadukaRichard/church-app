import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Smooth animation

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Connect to your server
      const res = await axios.post('http://127.0.0.1:5000/api/auth/login', form);
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError("Incorrect username or password.");
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        width: '100%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        // Rich Gradient: Deep Slate to Royal Blue
        background: 'linear-gradient(135deg, #020617 0%, #1e293b 100%)', 
        padding: '20px',
        fontFamily: 'sans-serif'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <Card 
          className="border-0 shadow-lg" 
          style={{ 
            borderRadius: '24px', 
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.98)' // Slightly off-white for softness
          }}
        >
          {/* Header Section */}
          <div className="text-center pt-5  px-4">
            <div 
             
            >
              
            </div>
            <h2 className="fw-bold text-dark mb-1">Admin Portal</h2>
            <p className="text-muted small">Secure access for ministry leaders</p>
          </div>

          <Card.Body className="p-4 p-md-5 pt-0">
            {error && (
              <Alert variant="danger" className="text-center py-2 rounded-3 small fw-bold">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-uppercase small text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                  Username
                </Form.Label>
                <Form.Control 
                  type="text" 
                  name="username" 
                  placeholder="Enter your username"
                  onChange={handleChange} 
                  required
                  style={{ 
                    borderRadius: '12px', 
                    padding: '14px', 
                    background: '#F8FAFC', 
                    border: '1px solid #E2E8F0',
                    fontSize: '1rem'
                  }}
                  className="shadow-none focus-blue" 
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-uppercase small text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                  Password
                </Form.Label>
                <Form.Control 
                  type="password" 
                  name="password" 
                  placeholder="••••••••"
                  onChange={handleChange} 
                  required
                  style={{ 
                    borderRadius: '12px', 
                    padding: '14px', 
                    background: '#F8FAFC', 
                    border: '1px solid #E2E8F0',
                    fontSize: '1rem'
                  }}
                  className="shadow-none"
                />
              </Form.Group>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-100 py-3 fw-bold mt-2" 
                style={{ 
                  borderRadius: '12px', 
                  background: 'linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)', 
                  border: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                }}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Sign In to Dashboard"}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <Button variant="link" className="text-decoration-none text-muted small" onClick={() => navigate('/')}>
                ← Return to Home Website
              </Button>
            </div>
          </Card.Body>
        </Card>
        
        {/* Footer Text */}
        <p className="text-center text-white-50 mt-4 small">
          &copy; {new Date().getFullYear()} The Shepherd's Fold. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;