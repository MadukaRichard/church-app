import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table, Card } from 'react-bootstrap';
import api from '../api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', desc: '', image: '' });

  useEffect(() => {
    api.get('/events').then(res => setEvents(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post('/events', form);
    setEvents([res.data, ...events]);
    setForm({ title: '', date: '', desc: '', image: '' });
  };

  const handleDelete = async (id) => {
    await api.delete(`/events/${id}`);
    setEvents(events.filter(e => e._id !== id));
  };

  return (
    <Row>
      <Col md={4}>
        <Card className="p-3 shadow-sm border-0">
          <h5 className="mb-3">📅 Add Event</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Control className="mb-2" placeholder="Title (e.g. Worship Night)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <Form.Control className="mb-2" placeholder="Date/Time (e.g. Friday 6PM)" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            <Form.Control className="mb-2" placeholder="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
            <Form.Control as="textarea" className="mb-3" placeholder="Description" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
            <Button type="submit" variant="dark" className="w-100">Add Event</Button>
          </Form>
        </Card>
      </Col>
      <Col md={8}>
        <Table hover>
          <thead><tr><th>Event</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {events.map(e => (
              <tr key={e._id}>
                <td>{e.title}</td>
                <td>{e.date}</td>
                <td><Button size="sm" variant="danger" onClick={() => handleDelete(e._id)}>X</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};
export default AdminEvents;