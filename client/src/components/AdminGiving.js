import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table, Image, Alert } from 'react-bootstrap';
import axios from 'axios';

const AdminGiving = () => {
  // --- STATE MANAGEMENT ---
  const [causes, setCauses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    desc: '',
    story: '', // <--- NEW: Store the long story here
    image: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // --- 1. LOAD DATA FROM BACKEND ---
  useEffect(() => {
    const fetchCauses = async () => {
      try {
        // NOTE: Using 127.0.0.1 to fix connection issues
        const res = await axios.get('http://127.0.0.1:5000/api/giving');
        setCauses(res.data);
      } catch (err) {
        console.error("Error loading causes:", err);
      }
    };
    fetchCauses();
  }, []);

  // --- 2. HANDLE INPUT CHANGES ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- 3. ADD NEW CAUSE (POST to Database) ---
  const handleAdd = async () => {
    // Basic validation
    if (!form.title || !form.desc) return alert("Please fill in a Title and Description");

    try {
      // Send to Backend (using 127.0.0.1)
      const res = await axios.post('http://127.0.0.1:5000/api/giving', form);
      
      // Update UI with the new item from the database
      setCauses([res.data, ...causes]);

      // Reset Form & Show Success
      setForm({ title: '', desc: '', story: '', image: '' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (err) {
      console.error(err);
      alert("Failed to save. Is the server running?");
    }
  };

  // --- 4. DELETE CAUSE (DELETE from Database) ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cause?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/giving/${id}`);
        // Remove from UI
        setCauses(causes.filter(c => c._id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete.");
      }
    }
  };

  return (
    <Row>
      {/* --- LEFT COLUMN: THE FORM --- */}
      <Col md={4} className="border-end pe-4">
        <h4 className="mb-3 text-success">➕ Add Donation Cause</h4>
        
        {showSuccess && <Alert variant="success">Cause added successfully!</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Cause Title</Form.Label>
            <Form.Control 
              type="text" 
              name="title"
              placeholder="e.g. Building Fund" 
              value={form.title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Short Description</Form.Label>
            <Form.Control 
              as="textarea" 
              name="desc"
              rows={2} 
              placeholder="One sentence summary..." 
              value={form.desc}
              onChange={handleChange}
            />
          </Form.Group>

          {/* --- NEW: STORY INPUT --- */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Full Story (Mini-Blog)</Form.Label>
            <Form.Control 
              as="textarea" 
              name="story"
              rows={5} 
              placeholder="Write the full details, testimony, or need here..." 
              value={form.story}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Image URL (Optional)</Form.Label>
            <Form.Control 
              type="text" 
              name="image"
              placeholder="https://..." 
              value={form.image}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Paste a link to an image from Unsplash or your server.
            </Form.Text>
          </Form.Group>

          <Button variant="success" className="w-100 fw-bold" onClick={handleAdd}>
            Publish Cause
          </Button>
        </Form>
      </Col>

      {/* --- RIGHT COLUMN: THE LIST --- */}
      <Col md={8} className="ps-4">
        <h4 className="mb-3">Active Causes</h4>
        
        {causes.length === 0 ? (
          <div className="alert alert-secondary text-center">
            No causes active yet. Add one on the left!
          </div>
        ) : (
          <Table hover responsive className="align-middle shadow-sm">
            <thead className="bg-light">
              <tr>
                <th style={{ width: '80px' }}>Image</th>
                <th>Details</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {causes.map((cause) => (
                <tr key={cause._id}>
                  <td>
                    <Image 
                      src={cause.image || 'https://via.placeholder.com/60'} 
                      rounded 
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                    />
                  </td>
                  <td>
                    <h6 className="mb-0 fw-bold">{cause.title}</h6>
                    <small className="text-muted">{cause.desc}</small>
                  </td>
                  <td className="text-end">
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(cause._id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default AdminGiving;