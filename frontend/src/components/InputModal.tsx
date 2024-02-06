import { useContext, useEffect, useRef, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './LoginButton';

function InputModal() {
  const { showInputModal, setShowInputModal, fetchApplications, applications } = useContext(AppContext);
  const { user } = useAuth0();
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [workLocation, setworkLocation] = useState('Remote');
  const [progress, setProgress] = useState('Waiting');
  const date = new Date().getTime();

  const [companySuggestions, setCompanySuggestions] = useState([] as string[]);
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState([] as string[]);
  const [locationSuggestions, setLocationSuggestions] = useState([] as string[]);

  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // Update the `companySuggestions` array when the `company` state changes
  useEffect(() => {
    const suggestions = applications
      .filter(app => app.company.toLowerCase().includes(company.toLowerCase()) && app.company.toLowerCase() !== company.toLowerCase())
      .map(app => app.company);
  
    const uniqueSuggestions = Array.from(new Set(suggestions));
    setCompanySuggestions(uniqueSuggestions);
  }, [company, applications]);

  // Update the `jobTitleSuggestions` array when the `jobTitle` state changes
  useEffect(() => {
    const suggestions = applications
      .filter(app => app.jobTitle.toLowerCase().includes(jobTitle.toLowerCase()) && app.jobTitle.toLowerCase() !== jobTitle.toLowerCase())
      .map(app => app.jobTitle);
  
    const uniqueSuggestions = Array.from(new Set(suggestions));
    setJobTitleSuggestions(uniqueSuggestions);
  }, [jobTitle, applications]);
  
  // For Location Suggestions
  useEffect(() => {
    const suggestions = applications
      .filter(app => app.location.toLowerCase().includes(location.toLowerCase()) && app.location.toLowerCase() !== location.toLowerCase())
      .map(app => app.location);
  
    const uniqueSuggestions = Array.from(new Set(suggestions));
    setLocationSuggestions(uniqueSuggestions);
  }, [location, applications]);

  // Close the suggestions list when clicking outside the list and input field
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        // Reset suggestions visibility here, e.g., by clearing the suggestions arrays
        setCompanySuggestions([]);
        setJobTitleSuggestions([]);
        setLocationSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard events
  const handleKeyDown = (
    e: React.KeyboardEvent, // The event
    suggestions: string[], // Array of suggestions
    setFunction: React.Dispatch<React.SetStateAction<string>>, // Setter for the input field value
    setSuggestions: React.Dispatch<React.SetStateAction<string[]>> // Setter for the suggestions list
  ) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prevIndex => (prevIndex + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prevIndex => (prevIndex - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && suggestions.length > 0) {
          setFunction(suggestions[selectedSuggestionIndex]);
          setSuggestions([]);
          setSelectedSuggestionIndex(-1);
        }
        break;
      default:
        break;
    }
  };

  // Hide the modal and reset the input fields
  const hideModal = () => {
    setShowInputModal(false);
    setCompany('');
    setJobTitle('');
    setLocation('');
    setworkLocation('Remote');
  };

  // Save the application data to the database
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
        progress,
        date,
      };
  
      if (!process.env.REACT_APP_SAVE_APPLICATION_URL) {
        throw new Error('REACT_APP_SAVE_APPLICATION_URL is undefined');
      }

      const response = await fetch(process.env.REACT_APP_SAVE_APPLICATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        hideModal();
        fetchApplications(userId);
      } else {
        throw new Error(`Error: ${responseData.error}`);
      }
    } catch (error) {
      console.error('Error saving application data:', error);
    }
  };

  // If the user is not logged in, show a modal asking the user to login
  if (!user) {
    return (
      <>
        <Modal show={showInputModal} onHide={() => hideModal()}>
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
            <LoginButton variant='primary'/>
          </Modal.Footer>
        </Modal>
      </>
    )
  }

  // Render the suggestions list
  const renderSuggestions = (suggestions: any, inputSetter: any) => (
    <ul className="list-group" ref={suggestionsRef}>
      {suggestions.map((suggestion: any, index: any) => (
        <li key={index}
            className={`list-group-item list-group-item-action ${index === selectedSuggestionIndex ? 'active' : ''}`}
            onClick={() => inputSetter(suggestion)}
            onMouseEnter={() => setSelectedSuggestionIndex(index)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Modal show={showInputModal} onHide={() => hideModal()}>
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
                onKeyDown={(e) => handleKeyDown(e, companySuggestions, setCompany, setCompanySuggestions)}
              />
              {company && renderSuggestions(companySuggestions, setCompany)}
            </Form.Group>
            <Form.Group>
              <Form.Label className='mt-3'>Job Title</Form.Label>
              <Form.Control
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter job title"
                onKeyDown={(e) => handleKeyDown(e, jobTitleSuggestions, setJobTitle, setJobTitleSuggestions)}
              />
              {jobTitle && renderSuggestions(jobTitleSuggestions, setJobTitle)}
            </Form.Group>
            <Form.Group>
              <Form.Label className='mt-3'>Location</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                onKeyDown={(e) => handleKeyDown(e, locationSuggestions, setLocation, setLocationSuggestions)}
              />
              {location && renderSuggestions(locationSuggestions, setLocation)}
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
