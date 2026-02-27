import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Carousel, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import SkeletonLoader from '../components/SkeletonLoader';

const Home = () => {
  const [heroSlides, setHeroSlides] = useState([]);
  const [featuredCause, setFeaturedCause] = useState(null);
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- NEW: STATE FOR EVENT POP-UP ---
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});

  // --- THEME COLORS ---
  const ACCENT = '#2563EB'; // Royal Blue
  const DARK = '#0F172A';   // Deep Slate
  const LIGHT_BG = '#F8FAFC'; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const heroRes = await api.get('/hero');
        setHeroSlides(Array.isArray(heroRes.data) ? heroRes.data : []);

        const giveRes = await api.get('/giving');
        const givingData = Array.isArray(giveRes.data) ? giveRes.data : [];
        if (givingData.length > 0) setFeaturedCause(givingData[0]);

        const eventRes = await api.get('/events');
        const eventData = Array.isArray(eventRes.data) ? eventRes.data : [];
        setEvents(eventData.slice(0, 3)); 

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FUNCTION TO OPEN MINI-BLOG ---
  const handleOpenEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#fff' }}>
        <div style={{ height: '85vh', display: 'flex', alignItems: 'center' }}>
          <Container>
            <SkeletonLoader type="hero" />
          </Container>
        </div>
        <div style={{ backgroundColor: '#F8FAFC', padding: '5rem 0' }}>
          <Container>
            <Row>
              {[...Array(3)].map((_, i) => (
                <Col md={6} lg={4} key={i} className="mb-4">
                  <SkeletonLoader type="card" count={1} />
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'hidden', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* --- 1. HERO CAROUSEL --- */}
      <Carousel 
        slide
        interval={5000} 
        controls={false} 
        indicators={heroSlides.length > 1}
        pause="hover"
        touch={true}
        className="hero-carousel"
      >
        {(heroSlides.length > 0 ? heroSlides : [null]).map((slide, idx) => (
          <Carousel.Item key={slide?._id || idx}>
            <div 
              className="hero-slide"
              style={{ 
                backgroundImage: `linear-gradient(rgba(15, 23, 42, ${slide?.overlayOpacity ?? 0.5}), rgba(15, 23, 42, ${slide?.overlayOpacity ?? 0.5})), url(${slide?.image || 'https://placehold.co/1500x800/0F172A/white?text=Welcome'})`,
                minHeight: '75vh', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: slide?.textColor || 'white',
                padding: '2rem 0'
              }}
            >
              <Container>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="display-2 fw-bolder mb-3" style={{ opacity: 0.9 }}>
                    {slide?.title || "WELCOME HOME"}
                  </h1>
                  <p className="lead mb-4 fs-5 fw-semibold" style={{ opacity: 1.0 }}>
                    {slide?.subtitle || "A place to belong, believe, and become."}
                  </p>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      className="rounded-pill px-4 py-2 px-md-5 py-md-3 fw-bold border-0 shadow" 
                      style={{ backgroundColor: ACCENT, color: 'white' }}
                      as={Link} 
                      to={slide?.link || "/sermons"}
                    >
                      {slide?.buttonText || "Watch Latest Sermon"}
                    </Button>
                  </motion.div>
                </motion.div>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* --- 2. EVENTS SECTION --- */}
      {events.length > 0 && (
        <div style={{ backgroundColor: LIGHT_BG, padding: '3rem 0' }}>
          <Container>
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true }}
              className="text-center mb-5"
            >
              <h6 className="fw-bold text-uppercase" style={{ color: ACCENT, letterSpacing: '1px' }}>
                Calendar
              </h6>
              <h2 className="fw-bold display-6" style={{ color: DARK }}>Upcoming Events</h2>
            </motion.div>

            <Row className="justify-content-center g-4">
              {events.map((event, index) => (
                <Col md={6} lg={4} key={event._id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                      <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                        <Card.Img 
                          variant="top" 
                          src={event.image || "https://source.unsplash.com/random/800x600?church"} 
                          style={{ height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                           <Badge bg="light" text="dark" className="shadow-sm py-2 px-3 rounded-pill fw-bold">
                             {event.date}
                           </Badge>
                        </div>
                      </div>
                      <Card.Body className="p-4 d-flex flex-column">
                        <Card.Title className="fw-bold fs-5 mb-2" style={{ color: DARK }}>
                          {event.title}
                        </Card.Title>
                        
                        {/* TRUNCATED TEXT */}
                        <Card.Text className="text-muted small flex-grow-1">
                          {event.desc.length > 100 ? event.desc.substring(0, 100) + "..." : event.desc}
                        </Card.Text>

                        {/* READ MORE BUTTON */}
                        <Button 
                          variant="link" 
                          className="p-0 text-decoration-none fw-bold align-self-start"
                          style={{ color: ACCENT }}
                          onClick={() => handleOpenEvent(event)}
                        >
                          Read More &rarr;
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      )}

      {/* --- 3. FEATURED CAUSE --- */}
      {featuredCause && (
        <div style={{ backgroundColor: '#fff', padding: '3rem 0' }}>
          <Container>
            <Row className="align-items-center">
              <Col md={6} className="mb-5 mb-md-0 order-md-2">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={featuredCause.image} 
                    alt="Mission" 
                    className="img-fluid rounded-4 shadow-lg"
                    style={{ maxHeight: '450px', width: '100%', objectFit: 'cover' }}
                  />
                </motion.div>
              </Col>
              <Col md={6} className="order-md-1">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h6 className="fw-bold text-uppercase mb-2" style={{ color: ACCENT }}>
                    Make a Difference
                  </h6>
                  <h2 className="display-4 fw-bold mb-4" style={{ color: DARK }}>
                    {featuredCause.title}
                  </h2>
                  <p className="lead text-muted mb-4">
                    {featuredCause.desc}
                  </p>
                  
                  <Button 
                    as={Link} 
                    to="/give" 
                    size="lg" 
                    className="rounded-pill px-4 py-2 px-md-5 py-md-3 fw-bold border-0 shadow-sm"
                    style={{ backgroundColor: DARK, color: 'white' }}
                  >
                    Partner With Us &rarr;
                  </Button>
                </motion.div>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      {/* --- 4. VISION / FOOTER CALL TO ACTION --- */}
      <div style={{ backgroundColor: DARK, color: 'white', padding: '3rem 0' }} className="text-center">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-3 fw-bold display-6">A Church for the City</h2>
            <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px', opacity: 0.8 }}>
              We are a community of believers dedicated to spreading the love of Christ. 
              Whether you are new to faith or have been walking this path for years, you belong here.
            </p>
            <div>
              <Button 
                 variant="outline-light" 
                 size="lg"
                 className="me-3 rounded-pill px-4"
              >
                Plan Your Visit
              </Button>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* --- 5. EVENT MINI-BLOG MODAL (POP-UP) --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Body className="p-0 border-0 rounded-3 overflow-hidden">
          {selectedEvent.image && (
             <div className="modal-event-img" style={{ height: '300px', overflow: 'hidden' }}>
               <img 
                 src={selectedEvent.image} 
                 alt={selectedEvent.title} 
                 style={{ width: '100%', height: '100%', objectFit: 'cover' }}
               />
             </div>
          )}
          <div className="p-3 p-md-5">
             <Badge bg="primary" className="mb-3">{selectedEvent.date}</Badge>
             <h2 className="fw-bold mb-4" style={{ color: DARK }}>{selectedEvent.title}</h2>
             
             {/* This displays the full text with line breaks */}
             <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', whiteSpace: 'pre-line' }}>
               {selectedEvent.desc}
             </div>

             <div className="mt-4 pt-4 border-top text-end">
               <Button variant="outline-dark" onClick={() => setShowModal(false)}>
                 Close
               </Button>
             </div>
          </div>
        </Modal.Body>
      </Modal>
      
    </div>
  );
};

export default Home;