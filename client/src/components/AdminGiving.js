import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table, Image, Alert, Modal } from 'react-bootstrap';
import api from '../api';

const EMPTY_FORM = { title: '', desc: '', story: '', image: '' };

const AdminGiving = () => {
  const [causes, setCauses] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const res = await api.get('/giving');
        setCauses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error loading causes:", err);
      }
    };
    fetchCauses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.desc) return alert("Please fill in a Title and Description");
    try {
      if (editingId) {
        const res = await api.put(`/giving/${editingId}`, form);
        setCauses(causes.map(c => c._id === editingId ? res.data : c));
        setSuccessMsg('✅ Cause updated!');
        setEditingId(null);
      } else {
        const res = await api.post('/giving', form);
        setCauses([res.data, ...causes]);
        setSuccessMsg('✅ Cause added successfully!');
      }
      setForm({ ...EMPTY_FORM });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save. Is the server running?");
    }
  };

  // EDIT — load into form
  const handleEdit = (cause) => {
    setEditingId(cause._id);
    setForm({
      title: cause.title, desc: cause.desc || '',
      story: cause.story || '', image: cause.image || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  // DELETE with confirmation
  const confirmDelete = (id) => { setDeleteTarget(id); setShowDeleteModal(true); };
  const handleDelete = async () => {
    try {
      await api.delete(`/giving/${deleteTarget}`);
      setCauses(causes.filter(c => c._id !== deleteTarget));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  };

  return (
    <Row>
      <Col md={4} className="border-end pe-4 admin-form-col">
        <h4 className="mb-3 text-success">{editingId ? 'Edit Cause' : 'Add Donation Cause'}</h4>
        
        {showSuccess && <Alert variant="success">{successMsg}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Cause Title</Form.Label>
            <Form.Control 
              type="text" name="title"
              placeholder="e.g. Building Fund" 
              value={form.title} onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Short Description</Form.Label>
            <Form.Control 
              as="textarea" name="desc" rows={2} 
              placeholder="One sentence summary..." 
              value={form.desc} onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Full Story (Mini-Blog)</Form.Label>
            <Form.Control 
              as="textarea" name="story" rows={5} 
              placeholder="Write the full details, testimony, or need here..." 
              value={form.story} onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Image URL (Optional)</Form.Label>
            <Form.Control 
              type="text" name="image"
              placeholder="https://..." 
              value={form.image} onChange={handleChange}
            />
            <Form.Text className="text-muted">
              Paste a link to an image from Unsplash or your server.
            </Form.Text>
          </Form.Group>

          <Button variant={editingId ? 'warning' : 'success'} className="w-100 fw-bold" type="submit">
            {editingId ? 'Save Changes' : 'Publish Cause'}
          </Button>
          {editingId && (
            <Button variant="outline-secondary" className="w-100 mt-2" onClick={cancelEdit}>Cancel Edit</Button>
          )}
        </Form>
      </Col>

      <Col md={8} className="ps-md-4 admin-list-col">
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
                    <div className="d-flex gap-1 justify-content-end">
                      <Button variant="outline-primary" size="sm" onClick={() => handleEdit(cause)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(cause._id)}>
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
          <h4 className="fw-bold mb-3">Are you sure you want to delete this cause?</h4>
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

export default AdminGiving;