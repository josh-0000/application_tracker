import React from 'react';
import './App.css';
import NavBar from './components/Navbar';
import { Container, Row, Col } from 'react-bootstrap';
import SideBar from './components/SideBar';
import MainContainer from './components/MainContainer';
import { AppContextProvider } from './context/AppContext';

function App() {
  return (
    <Container fluid className="bg-light p-0 m-0" style={{ minHeight: '100vh' }}>
      <Row className="m-0 p-0">
        <Col className="m-0 p-0">
          <NavBar />
        </Col>
      </Row>
      <Row className="m-0 p-0">
        <AppContextProvider>
          <MainContainer />
        </AppContextProvider>
      </Row>
    </Container>
  );
}

export default App;
