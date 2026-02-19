import React, { useState, useEffect } from 'react';
import { Form, Button, Card, ProgressBar, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const AdminMission = () => {
  const [mission, setMission] = useState({ title: '', raised: 0, goal: 0 });
  const [message, setMessage] = useState('');

  // Fetch current data
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/mission').then(res => setMission(res.data));
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setMission({ ...mission, [e.target.name]: e.target.value });
  };

  // Save Changes
  const handleSave = async () => {
    try {
      await axios.put('http://127.0.0.1:5000/api/mission', mission);
      setMessage('✅ Mission Updated Successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert("Error saving mission.");
    }
  };

  // Calculate Percentage for Preview
  const percent = mission.goal > 0 ? Math.round((mission.raised / mission.goal) * 100) : 0;

  return (
    <Card className="p-4 border-0 shadow-sm" style={{ maxWidth: '600px' }}>
      <h4 className="mb-4 text-primary">🎯 Manage Mission Goal</h4>
      
      {/* PREVIEW SECTION */}
      <div className="p-3 bg-light rounded mb-4">
        <h6 className="text-muted text-uppercase small">Live Preview:</h6>
        <h5 className="fw-bold">{mission.title}</h5>
        <ProgressBar now={percent} variant="success" label={`${percent}%`} className="mb-2" style={{ height: '20px' }} />
        <p className="small text-muted mb-0">${mission.raised} raised of ${mission.goal} goal</p>
      </div>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Mission Title</Form.Label>
          <Form.Control 
            type="text" 
            name="title" 
            value={mission.title} 
            onChange={handleChange} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Amount Raised ($)</Form.Label>
          <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control 
              type="number" 
              name="raised" 
              value={mission.raised} 
              onChange={handleChange} 
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Total Goal ($)</Form.Label>
          <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control 
              type="number" 
              name="goal" 
              value={mission.goal} 
              onChange={handleChange} 
            />
          </InputGroup>
        </Form.Group>

        <Button variant="dark" className="w-100 py-2" onClick={handleSave}>
          Update Mission Goal
        </Button>
        {message && <p className="text-success text-center mt-3 fw-bold">{message}</p>}
      </Form>
    </Card>
  );
};

export default AdminMission;