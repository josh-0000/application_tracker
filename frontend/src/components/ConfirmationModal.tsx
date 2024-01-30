import React, { useContext } from "react";
import { Button, Modal, Form } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';

function ConfirmationModal() {
  const { showConfirmationModal, setShowConfirmationModal } = useContext(AppContext);

  console.log('showConfirmationModal:', showConfirmationModal);
  return (
    <>
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the selected applications?</p>
        </Modal.Body>
        <Modal.Footer className='mt-3'>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            No
          </Button>
          <Button variant="primary">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmationModal;
