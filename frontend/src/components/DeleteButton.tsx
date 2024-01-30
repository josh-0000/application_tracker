import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { AppContext } from "../context/AppContext";

function DeleteButton() {
  const { setShowConfirmationModal } = useContext(AppContext);
  
  return (
    <Button className="pt-1 pb-1 mt-5" variant="danger" onClick={() => setShowConfirmationModal(true)}>
      Delete
    </Button>
  );
};

export default DeleteButton;