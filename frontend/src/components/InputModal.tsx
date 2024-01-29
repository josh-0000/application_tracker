import React, { useContext, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './LoginButton';

function InputModal() {
  const { showModal, setShowModal, fetchApplications } = useContext(AppContext);
  const { user } = useAuth0();
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [workLocation, setworkLocation] = useState('Remote');
  const [progress, setProgress] = useState('Just Applied');

  const hideModal = () => {
    setShowModal(false);
    setCompany('');
    setJobTitle('');
    setLocation('');
    setworkLocation('Remote');
  };

  const handleSave = async () => {
    try {      
      if (!user) {
        throw new Error('User is undefined!');
      }

      const userId = user.sub;
  
      const userData = {
        userId,
        company,
        jobTitle,
        location,
        workLocation,
        progress
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
        fetchApplications(userId);
      } else {
        throw new Error(`Error: ${responseData.error}`);
      }
    } catch (error) {
      console.error('Error saving application data:', error);
    }
  };
    
  if (!user) {
    return (
      <>
        <Modal show={showModal} onHide={() => hideModal()}>
          <Modal.Header closeButton>
            <Modal.Title>Please Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            In order to save your applications, please login to your account. 
            <hr />
            Signing up is free!
            <hr />
            Maximum of 100 applications.
          </Modal.Body>
          <Modal.Footer className='mt-3'>
            <Button variant="secondary" onClick={() => hideModal()}>
              Close
            </Button>
            <LoginButton />
          </Modal.Footer>
        </Modal>
      </>
    )
  }
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
