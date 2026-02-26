import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-main">
      <Container>
        <Row className="footer-row">

          {/* Brand */}
          <Col xs={12} md={4} className="footer-col">
            <h5 className="footer-brand">The Shepherd's Fold</h5>
            <p className="footer-tagline">
              A community of believers rooted in faith, love, and purpose.
              Join us every Sunday — online or in person.
            </p>
            {/* Social Icons */}
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="Facebook">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={6} md={4} className="footer-col">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/sermons">Sermons</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/give">Give</Link></li>
            </ul>
          </Col>

          {/* Contact */}
          <Col xs={6} md={4} className="footer-col">
            <h6 className="footer-heading">Contact Us</h6>
            <ul className="footer-links">
              <li>
                <a href="mailto:hello@church.com">hello@church.com</a>
              </li>
              <li>
                <a href="tel:+2348001">+234 800 CHURCH</a>
              </li>
            </ul>
          </Col>

        </Row>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} The Shepherd's Fold &mdash; All Rights Reserved.</span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;