import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // "text-light" handles the main headings
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row>
          {/* Column 1 */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold text-uppercase">The Shepherd's Fold</h5>
            {/* CHANGED: text-muted -> text-white-50 */}
            <p className="small text-white-50">
              A digital church family connecting believers worldwide. 
              Join us online every Sunday.
            </p>
          </Col>

          {/* Column 2 */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold text-uppercase">Quick Links</h5>
            <ul className="list-unstyled">
              {/* CHANGED: text-muted -> text-white-50 for all links */}
              <li><Link to="/" className="text-decoration-none text-white-50">Home</Link></li>
              <li><Link to="/sermons" className="text-decoration-none text-white-50">Sermons</Link></li>
              <li><Link to="/give" className="text-decoration-none text-white-50">Give</Link></li>
              <li><Link to="/signup" className="text-decoration-none text-white-50">Join the Family</Link></li>
            </ul>
          </Col>

          {/* Column 3 */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold text-uppercase">Connect</h5>
            {/* CHANGED: text-muted -> text-white-50 */}
            <p className="small text-white-50 mb-1">Email: hello@church.com</p>
            <p className="small text-white-50">Phone: +234 800 CHURCH</p>
            <div>
              <span className="me-3"><i className="fa-brands fa-facebook"></i></span>
              <span className="me-3"><i className="fa-brands fa-youtube"></i></span>
              <span className="me-3"><i className="fa-brands fa-instagram"></i></span>
            </div>
          </Col>
        </Row>
        
        <hr className="border-secondary" />
        
        {/* CHANGED: text-muted -> text-white-50 */}
        <div className="text-center small text-white-50">
          &copy; {new Date().getFullYear()} The Shepherd's Fold. All Rights Reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;