import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { AppContext } from "../context/AppContext";

function DeleteButton() {
  const { setShowConfirmationModal, getCheckedApplicationIds  } = useContext(AppContext);

  const handleDelete = () => {
    const applicationIds = getCheckedApplicationIds();
    
    if (applicationIds.length !== 0) {
      setShowConfirmationModal(true);
    }
  }
  
  return (
    <Button className="pt-1 pb-1 mt-5" variant="danger" onClick={() => handleDelete()}>
      Delete
    </Button>
  );
};

export default DeleteButton;