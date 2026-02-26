import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table, Alert, Badge } from 'react-bootstrap';
import api from '../api';

const AdminSermons = () => {
  // --- STATE ---
  const [sermons, setSermons] = useState([]); // Store the list of sermons
  const [formData, setFormData] = useState({
    title: '',
    preacher: '',
    videoLink: '',
    category: '',
    description: ''
  });
  const [message, setMessage] = useState(null);

  // --- 1. FETCH SERMONS ON LOAD ---
  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const res = await api.get('/sermons');
      setSermons(res.data);
    } catch (err) {
      console.error("Error fetching sermons:", err);
      setMessage({ type: 'danger', text: 'Error loading sermons. Is the backend running?' });
    }
  };

  // --- 2. HANDLE INPUT ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. SUBMIT (ADD SERMON) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/sermons', formData);
      
      // Success!
      setMessage({ type: 'success', text: 'Success! Sermon added.' });
      setFormData({ title: '', preacher: '', videoLink: '', category: '', description: '' }); // Clear form
      
      // Update the list immediately
      setSermons([res.data, ...sermons]);
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);

    } catch (err) {
      setMessage({ type: 'danger', text: 'Error: Could not save sermon.' });
    }
  };

  // --- 4. DELETE SERMON ---
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this sermon?")) return;

    try {
      await api.delete(`/sermons/${id}`);
      // Remove from UI
      setSermons(sermons.filter(s => s._id !== id));
    } catch (err) {
      alert("Failed to delete sermon.");
    }
  };

  return (
    <Row>
      <h2 className="mb-4">Admin Dashboard: Sermons</h2>
      
      {/* --- LEFT COLUMN: ADD SERMON --- */}
      <Col md={4} className="border-end pe-4">
        <h4 className="text-primary mb-3">➕ Add New Sermon</h4>
        {message && <Alert variant={message.type}>{message.text}</Alert>}

        <Form onSubmit={handleSubmit} className="p-3 shadow-sm bg-light rounded">
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. The Power of Faith" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Preacher</Form.Label>
            <Form.Control name="preacher" value={formData.preacher} onChange={handleChange} required placeholder="e.g. Pastor Richard" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>YouTube Video ID</Form.Label>
            <Form.Control name="videoLink" value={formData.videoLink} onChange={handleChange} required placeholder="e.g. dQw4w9WgXcQ" />
            <Form.Text className="text-muted">Only the ID (the part after v=)</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control name="category" value={formData.category} onChange={handleChange} required placeholder="e.g. Prayer" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} rows={2} />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">Upload Sermon</Button>
        </Form>
      </Col>

      {/* --- RIGHT COLUMN: SERMON LIST --- */}
      <Col md={8} className="ps-4">
        <h4 className="mb-3">Library ({sermons.length})</h4>
        
        {sermons.length === 0 ? (
          <p className="text-muted">No sermons found. Add one!</p>
        ) : (
          <Table hover responsive className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>Thumbnail</th>
                <th>Details</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sermons.map((sermon) => (
                <tr key={sermon._id}>
                  <td>
                    <img 
                      src={`https://img.youtube.com/vi/${sermon.videoLink}/default.jpg`} 
                      alt="thumbnail"
                      style={{ width: '80px', borderRadius: '5px' }}
                    />
                  </td>
                  <td>
                    <strong>{sermon.title}</strong><br/>
                    <small className="text-muted">{sermon.preacher}</small>
                  </td>
                  <td><Badge bg="secondary">{sermon.category}</Badge></td>
                  <td>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(sermon._id)}>
                      🗑 Delete
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

export default AdminSermons;