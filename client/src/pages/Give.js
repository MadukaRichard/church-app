import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ProgressBar, Badge, Modal } from 'react-bootstrap';
import axios from 'axios';
import SkeletonLoader from '../components/SkeletonLoader';

const Give = () => {
  // --- STATE ---
  const [causes, setCauses] = useState([]); 
  const [selectedCause, setSelectedCause] = useState(null);
  const [amount, setAmount] = useState('');
  const [prayerRequest, setPrayerRequest] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for Mission Goal
  const [mission, setMission] = useState(null);

  // State for Mini-Blog Modal
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const MINISTRY_PHONE_NUMBER = '+19712860070'; 

  // --- 1. FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A. Fetch Causes
        const causesRes = await axios.get('http://127.0.0.1:5000/api/giving');
        setCauses(causesRes.data);
        
        // Automatically select the first cause if one exists
        if (causesRes.data.length > 0) {
          setSelectedCause(causesRes.data[0]._id);
        }

        // B. Fetch Mission Goal (This was breaking before)
        const missionRes = await axios.get('http://127.0.0.1:5000/api/mission');
        setMission(missionRes.data);
        
        setLoading(false);

      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. HANDLE WHATSAPP REDIRECT ---
  const handleWhatsAppRedirect = () => {
    if (!amount) {
      alert("Please enter or select an amount.");
      return;
    }

    const causeDetails = causes.find(c => c._id === selectedCause);
    const causeTitle = causeDetails ? causeDetails.title : 'General Giving';

    let message = `Hello! I would like to give $${amount} for *${causeTitle}*.`;
    
    if (prayerRequest.trim()) {
      message += `\n\n *My Prayer Request:* ${prayerRequest} Amen.`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${MINISTRY_PHONE_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // --- 3. OPEN THE STORY MODAL ---
  const handleOpenStory = (e, cause) => {
    e.stopPropagation(); // Stop the click from selecting the card behind it
    setModalContent(cause);
    setShowModal(true);
  };

  return (
    <>
      {/* --- HERO SECTION --- */}
      <div className="bg-success text-white py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">Worship Through Giving</h1>
          <p className="lead">"For where your treasure is, there your heart will be also." — Matthew 6:21</p>
        </Container>
      </div>

      <Container className="my-5">
        <Row>
          {/* --- LEFT COLUMN: SELECT YOUR IMPACT --- */}
          <Col lg={7} className="mb-4">
            <h3 className="fw-bold mb-3">1. Choose Your Impact</h3>
            <p className="text-muted mb-4">Select where you would like your seed to be sown today.</p>
            
            <Row>
              {loading ? (
                [...Array(2)].map((_, i) => (
                  <Col md={12} key={i} className="mb-3">
                    <SkeletonLoader type="card" count={1} />
                  </Col>
                ))
              ) : causes.length === 0 ? (
                 <div className="text-center py-5">
                   <p className="text-muted">No giving options available.</p>
                 </div>
              ) : (
                causes.map((cause) => (
                  <Col md={12} className="mb-3" key={cause._id}> 
                    <Card 
                      className={`cursor-pointer shadow-sm ${selectedCause === cause._id ? 'border-success border-3' : 'border-0'}`}
                      onClick={() => setSelectedCause(cause._id)}
                      style={{ cursor: 'pointer', transition: '0.3s' }}
                    >
                      <Row className="g-0 align-items-center">
                        <Col md={4}>
                          <Card.Img 
                            src={cause.image || 'https://via.placeholder.com/150'} 
                            style={{ height: '140px', objectFit: 'cover' }} 
                          />
                        </Col>
                        <Col md={8}>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="fw-bold mb-1">{cause.title}</h5>
                              {selectedCause === cause._id && <Badge bg="success">Selected</Badge>}
                            </div>
                            <p className="text-muted small mb-2">{cause.desc}</p>

                            {/* READ STORY LINK */}
                            {cause.story && (
                              <Button 
                                variant="link" 
                                className="p-0 text-decoration-none fw-bold text-success"
                                onClick={(e) => handleOpenStory(e, cause)}
                              >
                                Read Full Story &rarr;
                              </Button>
                            )}
                          </Card.Body>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))
              )}
            </Row>

            {/* --- DYNAMIC MISSION GOAL SECTION --- */}
            {mission && (
              <div className="mt-4 p-4 bg-light rounded shadow-sm">
                <h5 className="fw-bold">{mission.title}</h5>
                <ProgressBar 
                  now={mission.goal > 0 ? (mission.raised / mission.goal) * 100 : 0} 
                  variant="success" 
                  label={`${mission.goal > 0 ? Math.round((mission.raised / mission.goal) * 100) : 0}%`} 
                  className="mb-2" 
                  style={{ height: '20px' }} 
                />
                <p className="small text-muted mb-0">
                  ${mission.raised.toLocaleString()} raised of ${mission.goal.toLocaleString()} goal.
                </p>
              </div>
            )}
          </Col>

          {/* --- RIGHT COLUMN: THE GIVING FORM --- */}
          <Col lg={5}>
            {loading ? (
              <Card className="shadow-lg border-0">
                <Card.Header className="bg-white border-0 pt-4 px-4">
                  <div className="skeleton skeleton-text" style={{ width: '200px', height: '28px' }}></div>
                </Card.Header>
                <Card.Body className="p-4">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div className="skeleton skeleton-text" style={{ width: '100px', height: '16px', marginBottom: '8px' }}></div>
                      <div className="skeleton skeleton-button" style={{ width: '100%', height: '36px' }}></div>
                    </div>
                    <div>
                      <div className="skeleton skeleton-text" style={{ width: '150px', height: '16px', marginBottom: '8px' }}></div>
                      <div className="skeleton skeleton-button" style={{ width: '100%', height: '80px' }}></div>
                    </div>
                    <div className="skeleton skeleton-button" style={{ width: '100%', height: '44px' }}></div>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Card className="shadow-lg border-0">
              <Card.Header className="bg-white border-0 pt-4 px-4">
                <h3 className="fw-bold text-success">2. Your Gift</h3>
              </Card.Header>
              <Card.Body className="p-4">
                <Form>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Amount ($)</Form.Label>
                    <div className="d-flex gap-2 mb-2">
                      {['50', '100', '200', '500'].map((val) => (
                        <Button 
                          key={val} 
                          variant={amount === val ? "success" : "outline-secondary"} 
                          onClick={() => setAmount(val)}
                          className="flex-grow-1"
                        >
                          ${val}
                        </Button>
                      ))}
                    </div>
                    <Form.Control 
                      type="number" 
                      placeholder="Or enter custom amount" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Add a Prayer Request/Petition (Optional)</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Pastors will pray over this request..." 
                      value={prayerRequest}
                      onChange={(e) => setPrayerRequest(e.target.value)}
                    />
                  </Form.Group>
                  
                  <Button 
                    variant="success" 
                    size="lg" 
                    className="w-100 fw-bold shadow"
                    onClick={handleWhatsAppRedirect}
                  >
                    <i className="bi bi-whatsapp me-2"></i>
                    GIVE VIA WHATSAPP
                  </Button>
                  
                  <div className="text-center mt-3">
                    <p className="small text-muted">
                      You will be redirected to WhatsApp to complete your transfer details.
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            )}
          </Col>
        </Row>
      </Container>

      {/* --- NEW: MINI-BLOG MODAL (POP-UP) --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalContent.image && (
            <img 
              src={modalContent.image} 
              alt={modalContent.title} 
              className="w-100 rounded mb-4 shadow-sm" 
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          )}
          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}>
            {modalContent.story || "No additional details provided for this cause."}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="success" onClick={() => {
            setSelectedCause(modalContent._id);
            setShowModal(false);
          }}>
            Give to this Cause
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Give;