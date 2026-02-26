import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table, Image, Alert, Modal } from 'react-bootstrap';
import api from '../api';

const EMPTY_FORM = {
  title: '', subtitle: '', image: '', link: '',
  buttonText: 'Learn More', textColor: 'white', overlayOpacity: 0.5
};

const AdminHome = () => {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { fetchSlides(); }, []);

  const fetchSlides = async () => {
    try {
      const res = await api.get('/hero');
      setSlides(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image) return alert("Title and Image are required");
    try {
      if (editingId) {
        const res = await api.put(`/hero/${editingId}`, form);
        setSlides(slides.map(s => s._id === editingId ? res.data : s));
        setMessage('✅ Slide Updated!');
        setEditingId(null);
      } else {
        await api.post('/hero', form);
        setMessage('✅ Slide Added!');
        fetchSlides();
      }
      setForm({ ...EMPTY_FORM });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert("Error saving slide. Is the server running?");
    }
  };

  // EDIT — load into form
  const handleEdit = (slide) => {
    setEditingId(slide._id);
    setForm({
      title: slide.title, subtitle: slide.subtitle || '', image: slide.image,
      link: slide.link || '', buttonText: slide.buttonText || 'Learn More',
      textColor: slide.textColor || 'white', overlayOpacity: slide.overlayOpacity ?? 0.5
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
      await api.delete(`/hero/${deleteTarget}`);
      setSlides(slides.filter(s => s._id !== deleteTarget));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Row>
      <Col md={4} className="border-end pe-4 admin-form-col">
        <h4 className="mb-3 text-primary">{editingId ? 'Edit Slide' : 'Add Hero Slide'}</h4>
        {message && <Alert variant="success">{message}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Main Headline</Form.Label>
            <Form.Control name="title" value={form.title} onChange={handleChange} placeholder="e.g. Welcome Home" />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Subtitle</Form.Label>
            <Form.Control as="textarea" rows={2} name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="e.g. Join us this Sunday..." />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Image URL (Required)</Form.Label>
            <Form.Control name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Button Link (Optional)</Form.Label>
            <Form.Control name="link" value={form.link} onChange={handleChange} placeholder="/sermons or https://youtube.com..." />
          </Form.Group>
          <Row>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Text Color</Form.Label>
                <Form.Select name="textColor" value={form.textColor} onChange={handleChange}>
                  <option value="white">White</option>
                  <option value="#0F172A">Dark</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label>Overlay Opacity ({Math.round(form.overlayOpacity * 100)}%)</Form.Label>
                <Form.Range name="overlayOpacity" min={0} max={1} step={0.1} value={form.overlayOpacity} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Button variant={editingId ? 'warning' : 'primary'} className="w-100 mt-3" type="submit">
            {editingId ? 'Save Changes' : 'Publish Slide'}
          </Button>
          {editingId && (
            <Button variant="outline-secondary" className="w-100 mt-2" onClick={cancelEdit}>Cancel Edit</Button>
          )}
        </Form>
      </Col>

      <Col md={8} className="ps-md-4 admin-list-col">
        <h4 className="mb-3">Active Slides</h4>
        <Table hover responsive>
          <thead>
            <tr>
              <th width="60">Img</th>
              <th>Content</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((slide) => (
              <tr key={slide._id}>
                <td><Image src={slide.image} rounded style={{width: 50, height: 30, objectFit: 'cover'}} /></td>
                <td>
                  <strong>{slide.title}</strong><br/>
                  <small className="text-muted">{slide.subtitle}</small>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <Button size="sm" variant="outline-primary" onClick={() => handleEdit(slide)}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => confirmDelete(slide._id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body className="text-center p-4">
          <h4 className="fw-bold mb-3">Are you sure you want to delete this slide?</h4>
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

export default AdminHome;