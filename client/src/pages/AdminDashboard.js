import React, { useState } from 'react';
import { Container, Card, Tabs, Tab, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// --- IMPORTS ---
import AdminHome from './AdminHome';
import AdminSermons from '../components/AdminSermons';
import AdminGiving from '../components/AdminGiving';
import AdminEvents from '../components/AdminEvents';

const AdminDashboard = () => {
  const [key, setKey] = useState('home'); 
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <Container className="my-5 px-3">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="fw-bold fs-3 fs-md-1">Admin Command Center</h1>
        </div>
        <Button variant="outline-danger" onClick={() => setShowLogoutModal(true)}>Logout</Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Tabs
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3 bg-light p-2 rounded-top"
            fill
          >
            <Tab eventKey="home" title=" Home Page">
              <div className="p-3">
                <AdminHome />
              </div>
            </Tab>

            <Tab eventKey="sermons" title=" Sermons">
              <div className="p-3">
                <AdminSermons />
              </div>
            </Tab>

            <Tab eventKey="events" title="Events">
              <div className="p-3">
                <AdminEvents />
              </div>
            </Tab>

            <Tab eventKey="giving" title=" Giving">
              <div className="p-3">
                <AdminGiving />
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Body className="text-center p-4">
          <h4 className="fw-bold mb-3">Are you sure you want to logout?</h4>
          <p className="text-muted mb-4">You will need to sign in again to access the dashboard.</p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="outline-secondary" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleLogout}>Yes, Logout</Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;