import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Spinner } from 'react-bootstrap';
import api from '../api';
import SkeletonLoader from '../components/SkeletonLoader';

const extractVideoId = (input) => {
  if (!input) return '';
  const match = input.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (match) return match[1];
  const idMatch = input.match(/^[a-zA-Z0-9_-]{11}$/);
  return idMatch ? idMatch[0] : input.trim();
};

const Sermons = () => {
  const [sermons, setSermons] = useState([]); // Stores the real data
  const [loading, setLoading] = useState(true); // Shows a spinner while loading
  const [searchTerm, setSearchTerm] = useState('');

  // --- FETCH DATA FROM DATABASE ---
  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const res = await api.get('/sermons');
        setSermons(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sermons:", err);
        setLoading(false);
      }
    };
    fetchSermons();
  }, []);

  // Filter sermons based on search
  const filteredSermons = sermons.filter(sermon => 
    sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* --- HERO SECTION --- */}
      <div className="bg-dark text-light py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">Sermon Archive</h1>
          <p className="lead text-white-50">Watch, listen, and grow from anywhere.</p>
          
          <div className="d-flex justify-content-center mt-4">
            <InputGroup className="mb-3" style={{ maxWidth: '600px' }}>
              <Form.Control
                placeholder="Search by title or preacher..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2"
              />
              <Button variant="danger">Search</Button>
            </InputGroup>
          </div>
        </Container>
      </div>

      {/* --- VIDEO GRID --- */}
      <Container className="my-5">
        {loading ? (
          <Row>
            {[...Array(3)].map((_, i) => (
              <Col md={6} lg={4} key={i} className="mb-4">
                <SkeletonLoader type="card" count={1} />
              </Col>
            ))}
          </Row>
        ) : (
          <Row>
            {filteredSermons.map((sermon) => (
              <Col md={4} className="mb-4" key={sermon._id}> {/* MongoDB uses _id */}
                <Card className="h-100 shadow-sm border-0 hover-effect">
                  <div className="ratio ratio-16x9">
                    <iframe 
                      src={`https://www.youtube.com/embed/${extractVideoId(sermon.videoLink)}`} 
                      title={sermon.title} 
                      allowFullScreen
                      style={{ borderRadius: '5px 5px 0 0' }}
                    ></iframe>
                  </div>
                  
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge bg="primary">{sermon.category}</Badge>
                      <small className="text-muted">
                         {new Date(sermon.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    
                    <Card.Title className="fw-bold text-dark">{sermon.title}</Card.Title>
                    
                    <Card.Text className="text-muted small mb-2">
                      <i className="bi bi-person-fill me-1"></i> {sermon.preacher}
                    </Card.Text>
                    
                    <Card.Text className="small text-secondary">
                      {sermon.description && sermon.description.length > 80 
                        ? sermon.description.substring(0, 80) + "..." 
                        : sermon.description}
                    </Card.Text>
                  </Card.Body>
                  
                  <Card.Footer className="bg-white border-0 pb-3">
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      className="w-100 fw-bold" 
                      href={`https://www.youtube.com/watch?v=${extractVideoId(sermon.videoLink)}`} 
                      target="_blank"
                    >
                      <i className="bi bi-play-circle me-2"></i> Watch on YouTube
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}

            {!loading && filteredSermons.length === 0 && (
              <div className="text-center py-5">
                <h4 className="text-muted">No sermons found matching "{searchTerm}"</h4>
              </div>
            )}
          </Row>
        )}
      </Container>
    </>
  );
};

export default Sermons;