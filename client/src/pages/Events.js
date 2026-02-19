import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- MODAL STATE ---
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});

  // --- THEME COLORS (Matches Home Page) ---
  const ACCENT = '#2563EB'; // Royal Blue
  const DARK = '#0F172A';   // Deep Slate

  // --- FETCH REAL EVENTS FROM DB ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetching from your server instead of using dummy data
        const res = await axios.get('http://127.0.0.1:5000/api/events');
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // --- OPEN MODAL FUNCTION ---
  const handleOpenEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  return (
    <>
      {/* --- HERO SECTION --- */}
      <div style={{ backgroundColor: DARK, color: 'white', padding: '5rem 0' }} className="text-center">
        <Container>
          <h1 className="display-4 fw-bold">Upcoming Events</h1>
          <p className="lead text-white-50">Gather. Grow. Go.</p>
        </Container>
      </div>

      <Container className="my-5">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: ACCENT }} />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="text-muted">No upcoming events scheduled.</h3>
            <p>Check back soon!</p>
          </div>
        ) : (
          <Row>
            {events.map((event) => (
              <Col md={6} lg={4} className="mb-4" key={event._id}>
                <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                  <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <Card.Img 
                      variant="top" 
                      src={event.image || "https://source.unsplash.com/random/800x600?church"} 
                      style={{ height: '100%', objectFit: 'cover' }}
                    />
                    {/* Date Badge */}
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                       <Badge bg="light" text="dark" className="shadow-sm py-2 px-3 rounded-pill fw-bold">
                         {event.date}
                       </Badge>
                    </div>
                  </div>
                  
                  <Card.Body className="d-flex flex-column p-4">
                    <Card.Title className="fw-bold fs-5 mb-2" style={{ color: DARK }}>{event.title}</Card.Title>
                    
                    <Card.Text className="text-muted small flex-grow-1">
                      {event.desc.length > 100 ? event.desc.substring(0, 100) + "..." : event.desc}
                    </Card.Text>
                    
                    <Button 
                      className="w-100 mt-3 fw-bold py-2 border-0"
                      style={{ backgroundColor: ACCENT }}
                      onClick={() => handleOpenEvent(event)}
                    >
                      View Details & Register
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* --- EVENT DETAILS MODAL (POP-UP) --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Body className="p-0 border-0 rounded-3 overflow-hidden">
           {selectedEvent.image && (
             <div style={{ height: '300px', overflow: 'hidden' }}>
               <img 
                 src={selectedEvent.image} 
                 alt={selectedEvent.title} 
                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
               />
             </div>
           )}
           <div className="p-5">
             <Badge bg="primary" className="mb-3">{selectedEvent.date}</Badge>
             <h2 className="fw-bold mb-4" style={{ color: DARK }}>{selectedEvent.title}</h2>
             
             <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', whiteSpace: 'pre-line' }}>
               {selectedEvent.desc}
             </div>

             <div className="mt-4 pt-4 border-top text-end">
               <Button variant="outline-dark" className="me-2" onClick={() => setShowModal(false)}>Close</Button>
               <Button style={{ backgroundColor: ACCENT, border: 'none' }}>Register Now</Button>
             </div>
           </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Events;