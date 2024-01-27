import React, { useContext, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useAuth0 } from "@auth0/auth0-react";

function InputModal() {
  const { showModal, setShowModal } = useContext(AppContext);
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [workLocation, setworkLocation] = useState('Remote');
  const [userId, setUserId] = useState('');

  const hideModal = () => {
    setShowModal(false);
    setCompany('');
    setJobTitle('');
    setLocation('');
    setworkLocation('Remote');
  };

  if (isLoading) {
    console.log("Loading...");
  }

  if (!user) {
    console.log("User not found");
  }

  if (!isAuthenticated) {
    console.log("User not authenticated");
  }

  const handleSave = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
  
      const userData = {
        userId: accessToken,
        company,
        jobTitle,
        location,
        workLocation
      };
  
      const response = await fetch('http://localhost:3001/applications/saveApplication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        console.log('Data saved:', responseData);
        hideModal();
      } else {
        throw new Error(`Error: ${responseData.error}`);
      }
    } catch (error) {
      console.error('Error saving application data:', error);
    }
  };
  
  return (
    <>
      <Modal show={showModal} onHide={() => hideModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Job Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className='mt-3'>Company</Form.Label>
              <Form.Control 
                type="text" 
                value={company} 
                onChange={(e) => setCompany(e.target.value)} 
                placeholder="Enter company name" 
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className='mt-3'>Job Title</Form.Label>
              <Form.Control 
                type="text" 
                value={jobTitle} 
                onChange={(e) => setJobTitle(e.target.value)} 
                placeholder="Enter job title" 
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className='mt-3'>Location</Form.Label>
              <Form.Control 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Enter location" 
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className='mt-3'>Work Location</Form.Label>
              <Form.Control 
                as="select" 
                value={workLocation} 
                onChange={(e) => setworkLocation(e.target.value)}
              >
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className='mt-3'>
          <Button variant="secondary" onClick={() => hideModal()}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InputModal;
