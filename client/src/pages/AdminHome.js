import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table, Image, Alert } from 'react-bootstrap';
import axios from 'axios';

const AdminHome = () => {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    buttonText: 'Learn More',
    textColor: 'white',
    overlayOpacity: 0.5
  });
  const [message, setMessage] = useState('');

  // 1. FETCH SLIDES
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      // FIX: Changed localhost to 127.0.0.1
      const res = await axios.get('http://127.0.0.1:5000/api/hero');
      setSlides(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 2. HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3. ADD NEW SLIDE
  const handleAdd = async () => {
    if (!form.title || !form.image) return alert("Title and Image are required");

    try {
      // FIX: Changed localhost to 127.0.0.1
      await axios.post('http://127.0.0.1:5000/api/hero', form);
      setMessage('✅ Slide Added!');
      fetchSlides(); // Refresh list
      setForm({ title: '', subtitle: '', image: '', link: '', buttonText: 'Learn More', textColor: 'white', overlayOpacity: 0.5 }); // Reset form
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert("Error adding slide. Is the server running?");
    }
  };

  // 4. DELETE SLIDE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slide?")) return;
    try {
      // FIX: Changed localhost to 127.0.0.1
      await axios.delete(`http://127.0.0.1:5000/api/hero/${id}`);
      setSlides(slides.filter(s => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Row>
      {/* LEFT: FORM */}
      <Col md={4} className="border-end pe-4">
        <h4 className="mb-3 text-primary">➕ Add Hero Slide</h4>
        {message && <Alert variant="success">{message}</Alert>}
        
        <Form>
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
          <Button variant="primary" className="w-100 mt-3" onClick={handleAdd}>Publish Slide</Button>
        </Form>
      </Col>

      {/* RIGHT: LIST */}
      <Col md={8} className="ps-4">
        <h4 className="mb-3">Active Slides</h4>
        <Table hover responsive>
          <thead>
            <tr>
              <th width="60">Img</th>
              <th>Content</th>
              <th>Action</th>
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
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(slide._id)}>🗑</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default AdminHome;