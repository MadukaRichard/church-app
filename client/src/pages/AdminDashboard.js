import React, { useState } from 'react';
import { Container, Card, Tabs, Tab, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// --- IMPORTS ---
// 1. AdminHome is in the SAME folder (pages), so we use './'
import AdminHome from './AdminHome';

// 2. These two are in the 'components' folder, so we use '../components/'
import AdminSermons from '../components/AdminSermons';
import AdminGiving from '../components/AdminGiving'; // <--- NEW IMPORT
import AdminEvents from '../components/AdminEvents';

const AdminDashboard = () => {
  const [key, setKey] = useState('home'); 
  const navigate = useNavigate();

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold"> Admin Command Center</h1>
        </div>
        <Button variant="outline-danger" onClick={() => navigate('/')}>Logout</Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Tabs
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3 bg-light p-2 rounded-top"
            fill
          >
            {/* TAB 1: HOME PAGE */}
            <Tab eventKey="home" title=" Home Page">
              <div className="p-3">
                <AdminHome />
              </div>
            </Tab>

            {/* TAB 2: SERMONS */}
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

            {/* TAB 3: GIVING (This is the new part) */}
            <Tab eventKey="giving" title=" Giving">
              <div className="p-3">
                <AdminGiving />
              </div>
            </Tab>

          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;