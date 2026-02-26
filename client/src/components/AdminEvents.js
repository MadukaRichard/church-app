import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table, Card, Modal } from 'react-bootstrap';
import api from '../api';

const EMPTY_FORM = { title: '', date: '', desc: '', image: '' };

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    api.get('/events').then(res => setEvents(Array.isArray(res.data) ? res.data : []));
  }, []);

  // ADD or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/events/${editingId}`, form);
        setEvents(events.map(ev => ev._id === editingId ? res.data : ev));
        setEditingId(null);
      } else {
        const res = await api.post('/events', form);
        setEvents([res.data, ...events]);
      }
      setForm({ ...EMPTY_FORM });
    } catch (err) {
      alert("Error saving event.");
    }
  };

  // EDIT — load into form
  const handleEdit = (event) => {
    setEditingId(event._id);
    setForm({
      title: event.title, date: event.date || '',
      desc: event.desc || '', image: event.image || ''
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
      await api.delete(`/events/${deleteTarget}`);
      setEvents(events.filter(e => e._id !== deleteTarget));
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (err) {
      alert("Failed to delete event.");
    }
  };

  return (
    <Row>
      <Col md={4} className="mb-4 mb-md-0">
        <Card className="p-3 shadow-sm border-0">
          <h5 className="mb-3">{editingId ? 'Edit Event' : 'Add Event'}</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Control className="mb-2" placeholder="Title (e.g. Worship Night)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <Form.Control className="mb-2" placeholder="Date/Time (e.g. Friday 6PM)" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <Form.Control className="mb-2" placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
            <Form.Control as="textarea" className="mb-3" placeholder="Description" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
            <Button type="submit" variant={editingId ? 'warning' : 'dark'} className="w-100">
              {editingId ? 'Save Changes' : 'Add Event'}
            </Button>
            {editingId && (
              <Button variant="outline-secondary" className="w-100 mt-2" onClick={cancelEdit}>Cancel Edit</Button>
            )}
          </Form>
        </Card>
      </Col>
      <Col md={8}>
        <Table hover responsive>
          <thead><tr><th>Event</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {events.map(e => (
              <tr key={e._id}>
                <td>{e.title}</td>
                <td>{e.date}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button size="sm" variant="outline-primary" onClick={() => handleEdit(e)}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => confirmDelete(e._id)}>Delete</Button>
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
          <h4 className="fw-bold mb-3">Are you sure you want to delete this event?</h4>
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
export default AdminEvents;