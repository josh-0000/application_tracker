import React, { useContext } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useAuth0 } from "@auth0/auth0-react";

function ConfirmationModal() {
  const { showConfirmationModal, setShowConfirmationModal, getCheckedApplicationIds, fetchApplications } = useContext(AppContext);
  const { user } = useAuth0();

  // Send a request to delete the selected applications
  const handleDelete = async () => {
    // Get the selected ApplicationIds using getCheckedApplicationIds
    const selectedApplicationIds = getCheckedApplicationIds();

    try {
      // Check if env variable is undefined
      if (!process.env.REACT_APP_DELETE_APPLICATIONS_URL) {
        throw new Error('REACT_APP_DELETE_APPLICATIONS_URL is undefined');
      }

      // Send a POST request to your deleteApplications endpoint with the selected ApplicationIds
      const response = await fetch(process.env.REACT_APP_DELETE_APPLICATIONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationIds: selectedApplicationIds,
          userId: user?.sub,
        }),
      });

      if (response.ok) {
        // If the request is successful, fetch the applications again
        if (user) {
          fetchApplications(user.sub || '');
        }
        setShowConfirmationModal(false);
      } else {
        console.error('Error deleting applications:', response.status);
      }
    } catch (error) {
      console.error('Error deleting applications:', error);
      alert('Error deleting applications');
    }
  };

  return (
    <>
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the selected applications?
        </Modal.Body>
        <Modal.Footer className='mt-3'>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            No
          </Button>
          <Button variant="primary" onClick={() => handleDelete()}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmationModal;
