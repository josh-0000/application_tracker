import React from 'react';
import './App.css';
import NavBar from './components/Navbar';
import Profile from './components/Profile';
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  return (
    <Container fluid className="bg-light p-0 m-0" style={{ minHeight: '100vh' }}>
      <Row className="m-0 p-0">
        <Col className="m-0 p-0">
          <NavBar />
        </Col>
      </Row>
      <Row className="m-0 p-0">
        <Col className="m-0 p-0">
          <Profile />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
