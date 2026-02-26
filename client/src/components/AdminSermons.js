import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table, Alert, Badge, Modal } from 'react-bootstrap';
import api from '../api';

// Extracts YouTube video ID from any format:
// - Full URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
// - Short URL: https://youtu.be/dQw4w9WgXcQ
// - Embed URL: https://www.youtube.com/embed/dQw4w9WgXcQ
// - Just the ID: dQw4w9WgXcQ
const extractVideoId = (input) => {
  if (!input) return '';
  const match = input.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (match) return match[1];
  // If no URL pattern matched, assume it's already just the ID
  const idMatch = input.match(/^[a-zA-Z0-9_-]{11}$/);
  return idMatch ? idMatch[0] : input.trim();
};

const EMPTY_FORM = { title: '', preacher: '', videoLink: '', category: '', description: '' };

const AdminSermons = () => {
  const [sermons, setSermons] = useState([]);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [message, setMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchSermons(); }, []);

  const fetchSermons = async () => {
    try {
      const res = await api.get('/sermons');
      setSermons(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching sermons:", err);
      setMessage({ type: 'danger', text: 'Error loading sermons. Is the backend running?' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ADD or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/sermons/${editingId}`, formData);
        setSermons(sermons.map(s => s._id === editingId ? res.data : s));
        setMessage({ type: 'success', text: '✅ Sermon updated!' });
        setEditingId(null);
      } else {
        const res = await api.post('/sermons', formData);
        setMessage({ type: 'success', text: 'Success! Sermon added.' });
        setSermons([res.data, ...sermons]);
      }
      setFormData({ ...EMPTY_FORM });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error: Could not save sermon.' });
    }
  };

  // EDIT — load into form
  const handleEdit = (sermon) => {
    setEditingId(sermon._id);
    setFormData({
      title: sermon.title, preacher: sermon.preacher, videoLink: sermon.videoLink,
      category: sermon.category, description: sermon.description || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FORM });
  };

  // DELETE with confirmation
  const confirmDelete = (id) => { setDeleteTarget(id); setShowDeleteModal(true); };
  const handleDelete = async () => {
    try {
      await api.delete(`/sermons/${deleteTarget}`);
      setSermons(sermons.filter(s => s._id !== deleteTarget));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      alert("Failed to delete sermon.");
    }
  };

  return (
    <Row>
      <h2 className="mb-4">Admin Dashboard: Sermons</h2>
      
      <Col md={4} className="border-end pe-4 admin-form-col">
        <h4 className="text-primary mb-3">{editingId ? 'Edit Sermon' : 'Add New Sermon'}</h4>
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
            <Form.Label>YouTube Video Link or ID</Form.Label>
            <Form.Control name="videoLink" value={formData.videoLink} onChange={handleChange} required placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
            <Form.Text className="text-muted">Paste a full YouTube URL or just the video ID</Form.Text>
            {formData.videoLink && extractVideoId(formData.videoLink) && (
              <div className="mt-2">
                <div className="ratio ratio-16x9" style={{ maxWidth: '100%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${extractVideoId(formData.videoLink)}`}
                    title="Video Preview"
                    allowFullScreen
                    style={{ borderRadius: '5px' }}
                  ></iframe>
                </div>
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control name="category" value={formData.category} onChange={handleChange} required placeholder="e.g. Prayer" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} rows={2} />
          </Form.Group>

          <Button variant={editingId ? 'warning' : 'primary'} type="submit" className="w-100">
            {editingId ? 'Save Changes' : 'Upload Sermon'}
          </Button>
          {editingId && (
            <Button variant="outline-secondary" className="w-100 mt-2" onClick={cancelEdit}>Cancel Edit</Button>
          )}
        </Form>
      </Col>

      <Col md={8} className="ps-md-4 admin-list-col">
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sermons.map((sermon) => (
                <tr key={sermon._id}>
                  <td>
                    <img 
                      src={`https://img.youtube.com/vi/${extractVideoId(sermon.videoLink)}/mqdefault.jpg`} 
                      alt="thumbnail"
                      style={{ width: '100px', borderRadius: '5px' }}
                    />
                  </td>
                  <td>
                    <strong>{sermon.title}</strong><br/>
                    <small className="text-muted">{sermon.preacher}</small>
                  </td>
                  <td><Badge bg="secondary">{sermon.category}</Badge></td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button variant="outline-primary" size="sm" onClick={() => handleEdit(sermon)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(sermon._id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body className="text-center p-4">
          <h4 className="fw-bold mb-3">Are you sure you want to delete this sermon?</h4>
          <p className="text-muted mb-4">This action cannot be undone.</p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
          </div>
        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default AdminSermons;